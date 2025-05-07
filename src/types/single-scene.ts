export interface Sequence {
  id: number;
  title: string;
  prompts?: { id: number; prompt: string }[];
}

export interface Frame {
  id: number;
  sequenceId: number;
  prompt: string;
}

export interface ImageData {
  id: number;
  frameId: number;
  imageUrl: string;
}