import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Typography from '@tiptap/extension-typography';
import { 
  CustomTable, 
  CustomTableRow, 
  CustomTableHeader, 
  CustomTableCell 
} from '../extensions/table';

export const getEditorExtensions = () => [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Image.configure({
    HTMLAttributes: {
      class: 'max-w-full rounded-lg',
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-500 hover:text-blue-600 underline',
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Placeholder.configure({
    placeholder: 'Commencez à écrire...',
  }),
  Typography,
  CustomTable,
  CustomTableRow,
  CustomTableHeader,
  CustomTableCell,
];