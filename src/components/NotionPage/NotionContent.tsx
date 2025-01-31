import React from 'react';
import { NotionBlock } from './NotionBlock';
import type { NotionBlock as NotionBlockType } from '../../services/notion/types';

interface NotionContentProps {
  blocks: NotionBlockType[];
}

export function NotionContent({ blocks }: NotionContentProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {blocks.map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </div>
  );
}