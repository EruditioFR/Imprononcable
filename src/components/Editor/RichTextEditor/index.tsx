import React from 'react';
import { EditorContent } from '@tiptap/react';
import { BlockMenu } from './blocks/BlockMenu';
import { TableMenu } from './blocks/TableMenu';
import { EditorToolbar } from './EditorToolbar';
import { useEditorConfig } from './hooks/useEditorConfig';
import './styles.css';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export function RichTextEditor({ content, onChange, disabled }: RichTextEditorProps) {
  const editor = useEditorConfig({ content, onChange, disabled });

  if (!editor) {
    return null;
  }

  return (
    <div className="relative border border-gray-300 rounded-lg overflow-hidden">
      <EditorToolbar editor={editor} />
      <BlockMenu editor={editor} />
      
      <div className="px-4 py-3 min-h-[400px] prose prose-sm max-w-none">
        <EditorContent editor={editor} />
      </div>

      <TableMenu editor={editor} />
    </div>
  );
}