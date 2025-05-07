import { z } from "zod";

export const createMovieSchema  = z.object({
  title: z.string().min(1, "Movie title is required").max(100, "Title is too long"),
})