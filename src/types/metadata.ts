export interface ImageMetadata {
  width?: number;
  height?: number;
}

export interface ImageAttachment {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
}