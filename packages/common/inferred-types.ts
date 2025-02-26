import z from "zod"
import {TrainModel,GenerateImage,GenerateImagesFromPack, TrainModelTypeEnum, EthinicityEnum, EyeColorType} from "./types.ts"


export type TrainModelInputType = z.infer<typeof TrainModel>   
export type GenerateimageInputType = z.infer<typeof GenerateImage>   
export type GenerateImageFromPackInputType = z.infer<typeof GenerateImagesFromPack>   
export type TrainModelType = z.infer<typeof TrainModelTypeEnum>;
export type EthinicityType = z.infer<typeof EthinicityEnum>
export type EyeColorType = z.infer<typeof EyeColorType>