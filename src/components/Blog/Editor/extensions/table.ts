import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

export const CustomTable = Table.configure({
  resizable: true,
  HTMLAttributes: {
    class: 'border-collapse table-auto w-full',
  },
});

export const CustomTableRow = TableRow.configure({
  HTMLAttributes: {
    class: 'border-b border-gray-200',
  },
});

export const CustomTableHeader = TableHeader.configure({
  HTMLAttributes: {
    class: 'border-b-2 border-gray-300 bg-gray-50 p-2 text-left font-semibold',
  },
});

export const CustomTableCell = TableCell.configure({
  HTMLAttributes: {
    class: 'border border-gray-200 p-2',
  },
});