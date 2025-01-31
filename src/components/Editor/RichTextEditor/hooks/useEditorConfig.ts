import { useEditor } from '@tiptap/react';
import { getEditorExtensions } from '../config/extensions';

interface UseEditorConfigProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
}

export function useEditorConfig({ content, onChange, disabled }: UseEditorConfigProps) {
  return useEditor({
    extensions: getEditorExtensions(),
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
}