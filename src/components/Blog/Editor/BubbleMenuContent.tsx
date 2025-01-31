import React from 'react';
import { Editor } from '@tiptap/react';
import { Bold, Italic, Code, Link } from 'lucide-react';

interface BubbleMenuContentProps {
  editor: Editor;
}

export function BubbleMenuContent({ editor }: BubbleMenuContentProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white border border-gray-200 rounded-lg shadow-lg">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
      >
        <Bold size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
      >
        <Italic size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-gray-100' : ''}`}
      >
        <Code size={16} />
      </button>
      
      <button
        onClick={() => {
          const url = window.prompt('URL du lien');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
      >
        <Link size={16} />
      </button>
    </div>
  );
}