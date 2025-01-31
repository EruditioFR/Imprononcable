import React, { useState, useCallback, MouseEvent } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Editor } from '@tiptap/react';
import { dropboxService } from '../../../services/dropbox/dropboxService';
import { ImageSelector } from '../ImageSelector/ImageSelector';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
  editor: Editor;
}

export function ImageUploadModal({ isOpen, onClose, onImageSelect, editor }: ImageUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent clicks inside modal from bubbling up
  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Upload to Dropbox
      const imageUrl = await dropboxService.uploadFile(file, 'blog-images');
      
      // Store editor state
      const { from, to } = editor.state.selection;
      
      // Insert image at current cursor position
      editor
        .chain()
        .focus()
        .setImage({ 
          src: imageUrl,
          alt: file.name,
          title: file.name
        })
        .run();

      // Restore selection
      editor.commands.setTextSelection({ from, to });

      onClose();
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Image upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  }, [editor, onClose]);

  const handleImageSelect = useCallback((imageInfo: { url: string; title: string }) => {
    // Store editor state
    const { from, to } = editor.state.selection;
    
    editor
      .chain()
      .focus()
      .setImage({ 
        src: imageInfo.url,
        alt: imageInfo.title,
        title: imageInfo.title
      })
      .run();

    // Restore selection
    editor.commands.setTextSelection({ from, to });
    
    onClose();
  }, [editor, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      onClick={onClose}
    >
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black opacity-30" />
        
        <div 
          className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl p-6"
          onClick={handleModalClick}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Ajouter une image
            </h2>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Upload from computer */}
            <div>
              <h3 className="text-lg font-medium mb-4">Uploader une image</h3>
              <label 
                className="block"
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Cliquez pour sélectionner</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 5MB</p>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </label>
            </div>

            {/* Select from image bank */}
            <div onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-medium mb-4">Choisir depuis la médiathèque</h3>
              <ImageSelector
                clientId={null}
                onImageSelect={handleImageSelect}
                selectedImage={null}
                disabled={isUploading}
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}