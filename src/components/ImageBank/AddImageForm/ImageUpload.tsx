import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
  currentImage?: string;
}

export function ImageUpload({ onUpload, disabled, currentImage }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    disabled
  });

  if (currentImage) {
    return (
      <div className="relative">
        <img
          src={currentImage}
          alt="Current image"
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div {...getRootProps()} className="cursor-pointer p-4 text-white text-center">
            <input {...getInputProps()} />
            <p>Cliquez ou déposez une nouvelle image pour remplacer</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
        isDragActive 
          ? 'border-primary-500 bg-primary-50' 
          : 'border-gray-300 hover:border-primary-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className="space-y-1 text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <input {...getInputProps()} />
          <p className="pl-1">
            {isDragActive
              ? 'Déposez l\'image ici...'
              : 'Glissez-déposez une image ou cliquez pour sélectionner'}
          </p>
        </div>
        <p className="text-xs text-gray-500">
          PNG, JPG, GIF jusqu'à 10MB
        </p>
      </div>
    </div>
  );
}