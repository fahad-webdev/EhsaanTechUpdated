import { z } from "zod";

export const sceneSchema = z.object({
  exteriorShort: z.string().min(1, "Shot description is required"),
  character: z.object({
    id: z.number().nullable(),
    name: z.string(),
    attributes: z.string(),
  }),
  action: z.object({
    id: z.number().nullable(),
    name: z.string(),
  }),
  location: z.object({
    id: z.number().nullable(),
    name: z.string(),
  }),
  combinedText: z.string(),
});

export const characterSchema = z.object({
  name: z.string().min(1, "Character name is required"),
  attributes: z.string().min(1, "Character description is required"),
});

export const actionSchema = z.object({
  name: z.string().min(1, "Action name is required"),
});

export const locationSchema = z.object({
  name: z.string().min(1, "Environment name is required"),
});


export const sequenceSchema = z.object({
  title: z.string().min(1, "Sequence title is required").max(100, "Title is too long"),
})

export const createSceneSchema  = z.object({
  title: z.string().min(1, "Scene title is required").max(100, "Title is too long"),
})