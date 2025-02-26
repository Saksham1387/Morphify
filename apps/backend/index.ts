import express, { json } from "express";
import {
  GenerateImage,
  GenerateImagesFromPack,
  TrainModel,
} from "common/types";
import { prismaClient } from "db";
import { s3, write, S3Client } from "bun";
import { FalAIModel } from "./models/FalAiModel";
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors())

const PORT = process.env.PORT || 8080;  
const USERid = "123";
const falAiModel = new FalAIModel();

app.get("/", async (req, res) => {
  res.send("Hello world");
});

app.get("/pre-signed-url", (req, res) => {
  const key = ` model/${Date.now()}_${Math.random()}.zip`;
  const url = S3Client.presign(key, {
    method:"PUT",
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    bucket: process.env.BUCKET_NAME,
    expiresIn: 60 * 5,
  });
  res.json({
    url,
    key,
  });
});

app.post("/ai/training", async (req, res) => {
  const parsedBody = TrainModel.safeParse(req.body);

  const images = req.body.images;

  if (!parsedBody.success) {
    res.status(411).json({
      message: "Invalid Input",
    });
    return;
  }

  // const { request_id, response_url } = await falAiModel.trainModel(
  //   parsedBody.data.zipUrl,
  //   parsedBody.data.name
  // );
  const request_id = "312"
  const response_url = "fmkods"
  const data = await prismaClient.model.create({
    data: {
      name: parsedBody?.data?.name,
      age: parsedBody.data.age,
      ethinicity: parsedBody.data.ethinicity,
      type: parsedBody.data.type,
      eyeColor: parsedBody.data.eyeColor,
      bald: parsedBody.data.bald,
      userId: USERid,
      falAiRequestId: request_id,
    },
  });

  res.json({
    modelId: data.id,
  });
});

app.post("/ai/generate", async (req, res) => {
  const parsedBody = GenerateImage.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Invalid Input",
    });
    return;
  }

  const model = await prismaClient.model.findUnique({
    where: {
      id: parsedBody.data.modelId,
    },
  });

  if (!model || !model.tensorPath) {
    res.status(411).json({
      message: "Model not found",
    });
    return;
  }

  const { request_id, response_url } = await falAiModel.generateImage(
    parsedBody.data.prompt,
    model?.tensorPath
  );
  const data = await prismaClient.outputImages.create({
    data: {
      prompt: parsedBody.data?.prompt,
      userId: USERid,
      imageUrl: "",
      modelId: parsedBody.data.modelId,
      falAiRequestId: request_id,
    },
  });

  res.json({
    imageId: data.id,
  });
});

app.post("/pack/generate", async (req, res) => {
  const parsedBody = GenerateImagesFromPack.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(411).json({
      message: "Invalid Input",
    });
    return;
  }

  const prompts = await prismaClient.packPrompts.findMany({
    where: {
      packId: parsedBody.data.packId,
    },
  });

  let request_ids: { request_id: string }[] = await Promise.all(
    prompts.map((prompt) =>
      falAiModel.generateImage(prompt.prompt, parsedBody.data.modelId)
    )
  );

  const data = await prismaClient.outputImages.createManyAndReturn({
    data: prompts.map((prompt, index) => {
      return {
        prompt: prompt.prompt,
        userId: USERid,
        imageUrl: "",
        modelId: parsedBody.data.modelId,
        falAiRequestId: request_ids[index].request_id,
      };
    }),
  });

  res.json({
    images: data.map((image) => image.id),
  });
});

app.get("/pack/bluk", async (req, res) => {
  const packs = await prismaClient.packs.findMany({});
  res.json(packs);
});

app.get("/image/bulk", async (req, res) => {
  const ids = req.query.ids as string[];
  const limit = (req.query.limit as string) ?? "10";
  const offset = (req.query.offset as string) ?? "0";

  const data = await prismaClient.outputImages.findMany({
    where: {
      id: { in: ids },
      userId: USERid,
    },
    skip: parseInt(offset),
    take: parseInt(limit),
  });
  res.json({
    images: data,
  });
});

app.post("/fal-ai/webhook/train", async (req, res) => {
  const requestId = req.body.request_id;
  await prismaClient.model.updateMany({
    where: {
      falAiRequestId: requestId,
    },
    data: {
      status: "Completed",
      tensorPath: req.body.tensor_path,
    },
  });
  res.json({
    message: "Webhook received",
  });
});

app.post("/fal-ai/webhook/image", async (req, res) => {
  const requestId = req.body.request_id;

  await prismaClient.outputImages.updateMany({
    where: {
      falAiRequestId: requestId,
    },
    data: {
      status: "Generated",
      imageUrl: req.body.image_url,
    },
  });
  res.json({
    message: "Webhook received",
  });
});

app.listen(PORT, () => {
  console.log("Started the server..");
});
