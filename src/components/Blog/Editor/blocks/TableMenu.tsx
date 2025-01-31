import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Trash2, Plus, ArrowDown, ArrowUp,
  Combine, Split, Table2
} from 'lucide-react';

interface TableMenuProps {
  editor: Editor;
}

export function TableMenu({ editor }: TableMenuProps) {
  if (!editor.isActive('table')) return null;

  return (
    <div className="flex items-center gap-1 p-2 bg-gray-50 border-t border-gray-200">
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-500 mr-2">Colonnes:</span>
        <button
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Ajouter une colonne avant"
        >
          <Plus size={18} className="rotate-90" />
        </button>

        <button
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Ajouter une colonne après"
        >
          <Plus size={18} className="rotate-90" />
        </button>

        <button
          onClick={() => editor.chain().focus().deleteColumn().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Supprimer la colonne"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-500 mr-2">Lignes:</span>
        <button
          onClick={() => editor.chain().focus().addRowBefore().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Ajouter une ligne avant"
        >
          <ArrowUp size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().addRowAfter().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Ajouter une ligne après"
        >
          <ArrowDown size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().deleteRow().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Supprimer la ligne"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-500 mr-2">Cellules:</span>
        <button
          onClick={() => editor.chain().focus().mergeCells().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Fusionner les cellules"
          disabled={!editor.can().mergeCells()}
        >
          <Combine size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().splitCell().run()}
          className="p-2 rounded hover:bg-gray-200"
          title="Diviser la cellule"
          disabled={!editor.can().splitCell()}
        >
          <Split size={18} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        className="p-2 rounded hover:bg-gray-200 text-red-600"
        title="Supprimer le tableau"
      >
        <Table2 size={18} />
      </button>
    </div>
  );
}