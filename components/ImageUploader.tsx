import React, { useRef } from 'react';

interface ImageUploaderProps {
  id: string;
  label: string;
  previewUrl: string | null;
  onImageChange: (file: File) => void;
  description: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, previewUrl, onImageChange, description }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleCardClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 h-full flex flex-col transition-colors duration-300">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">{label}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{description}</p>
      <input
        type="file"
        id={id}
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        aria-label={`Upload for ${label}`}
      />
      <div 
        onClick={handleCardClick}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        role="button"
        tabIndex={0}
        aria-label={`Upload image for ${label}`}
        className="relative flex-grow border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl flex items-center justify-center cursor-pointer hover:border-[#F54927] hover:bg-[#F54927]/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F54927]"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-xl p-2" />
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 p-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
             </svg>
            <p className="mt-2 font-semibold">Click to upload an image</p>
            <p className="text-xs mt-1">PNG, JPG, or WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
