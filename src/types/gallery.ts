import type { ImageMetadata } from './metadata';

export interface ImageRights {
  startDate: string | null;
  endDate: string | null;
  isExpired: boolean;
}

export interface Image {
  id: string;
  url: string;
  thumbnailUrl: string;
  hdUrl?: string; // Add HD URL field
  title: string;
  categories: string[];
  tags: string[];
  "tags proposés"?: string;
  client: string;
  width: number;
  height: number;
  rights: ImageRights;
  Format: string;
  Projet?: string;
}

export interface ClientInfo {
  name: string;
  description: string;
}

export interface CategoryCount {
  category: string;
  count: number;
}

export interface TagCount {
  tag: string;
  count: number;
}