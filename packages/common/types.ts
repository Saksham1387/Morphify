import { z } from "zod";

export const EthinicityEnum = z.enum([
  "White",
  "Black",
  "Asian_American",
  "East_Asian",
  "South_East_Asian",
  "South_Asian",
  "Middle_Eastern",
  "Pacific",
  "Hispanic",
]);

export const TrainModelTypeEnum = z.enum(["Man", "Woman", "Other"]);

export const EyeColorType = z.enum(["Brown", "Blue", "Hazel", "Gray"]);

export const TrainModel = z.object({
  name: z.string(),
  type: TrainModelTypeEnum,
  age: z.number(),
  ethinicity: EthinicityEnum,
  eyeColor: EyeColorType,
  bald: z.boolean(),
  zipUrl: z.string(),
});

export const GenerateImage = z.object({
  prompt: z.string(),
  modelId: z.string(),
  num: z.number(),
});

export const GenerateImagesFromPack = z.object({
  modelId: z.string(),
  packId: z.string(),
});
