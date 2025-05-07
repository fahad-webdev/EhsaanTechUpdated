/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FormData {
  exteriorShort: string;
  character: { id: number; name: string; attributes: string };
  action: { id: number; name: string };
  location: { id: number; name: string };
  combinedText: string;
}
export interface NewItem {
  name: string;
  description: string;
}
export interface FormDataCharacter {
  name: string;
  attributes: string;
}
export interface FormDataAction {
  name: string;
}
export interface FormDataLocation {
  name: string;
}
export interface Character {
  id: number;
  name: string;
  attributes: string;
}
export interface Action {
  id: number;
  name: string;
}
export interface Location {
  id: number;
  name: string;
}
export interface promptData {
  frames?:any[];
  pendingFrames?:any[]
}
export interface Prompt {
  data?: promptData; 
}
export interface Sequence {
  sceneId: number;
  title: string;
  id?: number;
  prompts?: Prompt;
}


