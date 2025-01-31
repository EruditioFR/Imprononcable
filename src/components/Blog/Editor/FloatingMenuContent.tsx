import React from 'react';
import { Editor } from '@tiptap/react';
import { Heading1, Heading2, List, ListOrdered, Image } from 'lucide-react';

interface FloatingMenuContentProps {
  editor: Editor;
}

export function FloatingMenuContent({ editor }: FloatingMenuContentProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg shadow-lg">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''}`}
      >
        <Heading1 size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
      >
        <Heading2 size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
      >
        <List size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
      >
        <ListOrdered size={16} />
      </button>
      
      <button
        onClick={() => {
          const url = window.prompt('URL de l\'image');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-1 rounded hover:bg-gray-100"
      >
        <Image size={16} />
      </button>
    </div>
  );
}