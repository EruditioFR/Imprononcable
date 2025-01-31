import React from 'react';
import type { NotionBlock as NotionBlockType } from '../../services/notion/types';

interface NotionBlockProps {
  block: NotionBlockType;
}

export function NotionBlock({ block }: NotionBlockProps) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="mb-4 text-gray-700">
          {block.paragraph.rich_text.map((text: any, index: number) => (
            <span
              key={index}
              className={`${text.annotations.bold ? 'font-bold' : ''} 
                         ${text.annotations.italic ? 'italic' : ''} 
                         ${text.annotations.strikethrough ? 'line-through' : ''} 
                         ${text.annotations.underline ? 'underline' : ''}`}
            >
              {text.plain_text}
            </span>
          ))}
        </p>
      );

    case 'heading_1':
      return (
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          {block.heading_1.rich_text[0].plain_text}
        </h1>
      );

    case 'heading_2':
      return (
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          {block.heading_2.rich_text[0].plain_text}
        </h2>
      );

    case 'heading_3':
      return (
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          {block.heading_3.rich_text[0].plain_text}
        </h3>
      );

    case 'bulleted_list_item':
      return (
        <li className="ml-4 mb-2 text-gray-700">
          {block.bulleted_list_item.rich_text[0].plain_text}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className="ml-4 mb-2 text-gray-700">
          {block.numbered_list_item.rich_text[0].plain_text}
        </li>
      );

    case 'image':
      return (
        <div className="my-4">
          <img
            src={block.image.file?.url || block.image.external?.url}
            alt={block.image.caption?.[0]?.plain_text || 'Notion image'}
            className="rounded-lg max-w-full h-auto"
          />
          {block.image.caption && (
            <p className="text-sm text-gray-500 mt-2">
              {block.image.caption[0].plain_text}
            </p>
          )}
        </div>
      );

    default:
      return null;
  }
}