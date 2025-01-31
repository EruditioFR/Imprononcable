import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Heading1, Heading2, Heading3, 
  List, ListOrdered, Image, 
  Quote, Code, Table 
} from 'lucide-react';

interface BlockMenuProps {
  editor: Editor;
}

export function BlockMenu({ editor }: BlockMenuProps) {
  const addImage = () => {
    const url = window.prompt('URL de l\'image');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
        }`}
        title="Titre 1"
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
        }`}
        title="Titre 2"
      >
        <Heading2 size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
        }`}
        title="Titre 3"
      >
        <Heading3 size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('bulletList') ? 'bg-gray-200' : ''
        }`}
        title="Liste à puces"
      >
        <List size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('orderedList') ? 'bg-gray-200' : ''
        }`}
        title="Liste numérotée"
      >
        <ListOrdered size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('blockquote') ? 'bg-gray-200' : ''
        }`}
        title="Citation"
      >
        <Quote size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('codeBlock') ? 'bg-gray-200' : ''
        }`}
        title="Bloc de code"
      >
        <Code size={18} />
      </button>

      <button
        onClick={addImage}
        className="p-2 rounded hover:bg-gray-200"
        title="Ajouter une image"
      >
        <Image size={18} />
      </button>

      <button
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        className={`p-2 rounded hover:bg-gray-200 ${
          editor.isActive('table') ? 'bg-gray-200' : ''
        }`}
        title="Insérer un tableau"
      >
        <Table size={18} />
      </button>
    </div>
  );
}