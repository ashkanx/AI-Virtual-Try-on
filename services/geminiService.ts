

import { GoogleGenAI, Modality } from "@google/genai";

// Debug logging for API key
console.log("Environment check:", {
    hasApiKey: !!process.env.API_KEY,
    hasGeminiApiKey: !!process.env.GEMINI_API_KEY,
    apiKeyLength: process.env.API_KEY?.length || 0,
    apiKeyPrefix: process.env.API_KEY?.substring(0, 10) || 'none'
});

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  const base64EncodedData = await base64EncodedDataPromise;
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

export const virtualTryOn = async (personFile: File, clothingFile: File): Promise<string> => {
    try {
        const personPart = await fileToGenerativePart(personFile);
        const clothingPart = await fileToGenerativePart(clothingFile);
        
        const prompt = {
            text: "Take the person from the first image and the clothing item from the second image. Generate a new, photorealistic image of the person wearing the clothing item. The output should only be the final image. Ensure the fit and lighting are natural.",
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    personPart,
                    clothingPart,
                    prompt
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT], // Must include both Modality.IMAGE and Modality.TEXT
            },
        });
        
        // Find the image part in the response
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("The AI did not return an image. It might have refused the request due to safety policies. Please try with different images.");

    } catch (error) {
        console.error("Error in virtualTryOn service:", error);
        if (error instanceof Error) {
           throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unexpected error occurred while calling the Gemini API.");
    }
};