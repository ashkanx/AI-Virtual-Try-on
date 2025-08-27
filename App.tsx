import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';
import { virtualTryOn } from './services/geminiService';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [personPreview, setPersonPreview] = useState<string | null>(null);
  const [clothingPreview, setClothingPreview] = useState<string | null>(null);
  
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (
    file: File, 
    setImage: React.Dispatch<React.SetStateAction<File | null>>, 
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVirtualTryOn = useCallback(async () => {
    if (!personImage || !clothingImage) {
      setError("Please upload both images before proceeding.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultBase64 = await virtualTryOn(personImage, clothingImage);
      setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [personImage, clothingImage]);

  const canTryOn = personImage && clothingImage;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 font-sans text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ImageUploader
            id="person-image"
            label="1. Upload Your Full-Body Photo"
            previewUrl={personPreview}
            onImageChange={(file) => handleImageChange(file, setPersonImage, setPersonPreview)}
            description="A clear, well-lit photo works best."
          />
          <ImageUploader
            id="clothing-image"
            label="2. Upload a Clothing Item"
            previewUrl={clothingPreview}
            onImageChange={(file) => handleImageChange(file, setClothingImage, setClothingPreview)}
            description="A photo of the clothing on a plain background is ideal."
          />
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleVirtualTryOn}
            disabled={!canTryOn || isLoading}
            className="bg-[#F54927] text-white font-bold py-3 px-12 rounded-lg shadow-lg hover:bg-opacity-90 transition-all duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-[#F54927]/50 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? "Generating Your New Look..." : "Try It On!"}
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 min-h-[30rem] flex items-center justify-center transition-colors duration-300">
          {isLoading && <Spinner />}
          {error && <div className="text-center text-red-500 font-medium">
              <p className="text-xl">Oops! Something went wrong.</p>
              <p className="text-sm mt-2">{error}</p>
            </div>}
          {!isLoading && !error && generatedImage && (
             <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">Here's Your New Look!</h2>
                <img src={generatedImage} alt="Generated virtual try-on" className="rounded-xl shadow-2xl max-w-full h-auto mx-auto border-4 border-white dark:border-slate-600" style={{maxHeight: '70vh'}}/>
             </div>
          )}
          {!isLoading && !error && !generatedImage && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold">Your generated image will appear here.</h3>
              <p className="mt-1 text-sm">Upload both photos and click "Try It On" to see the magic.</p>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Powered by Gemini. Created for demonstration purposes.</p>
      </footer>
    </div>
  );
};

export default App;
