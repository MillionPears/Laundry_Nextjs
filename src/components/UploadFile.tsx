// src/components/UploadImage.tsx
"use client";
import { useState, ChangeEvent } from "react";

interface UploadImageProps {
  onUpload: (file: File) => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onUpload }) => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onUpload(file);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center justify-center text-center"
        >
          {image ? (
            <img
              src={image}
              alt="Uploaded"
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16s1-1.5 3-1.5S10 16 12 16s3-1.5 5-1.5 3 1.5 3 1.5M4 8s1-1.5 3-1.5S10 8 12 8s3-1.5 5-1.5 3 1.5 3 1.5M4 12s1-1.5 3-1.5S10 12 12 12s3-1.5 5-1.5 3 1.5 3 1.5"
                />
              </svg>
              <span className="text-gray-600 mt-2">Upload an image</span>
            </div>
          )}
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>
    </div>
  );
};

export default UploadImage;
