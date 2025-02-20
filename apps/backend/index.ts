import express, { json } from "express";
import {
  GenerateImage,
  GenerateImagesFromPack,
  TrainModel,
} from "common/types";
import { prismaClient } from "db";


const app = express();
app.use(express.json())

const PORT = process.env.PORT || 8080;
const USERid = "123"
app.get("/", async (req, res) => {
  res.send("Hello world");
});

app.post("/ai/training", async (req, res) => {
  const parsedBody = TrainModel.safeParse(req.body);
  if(!parsedBody.success){
    res.status(411).json({
        message:"Invalid Input"
    })
    return 
  }


  const data = await prismaClient.model.create({
    data:{
        name:parsedBody?.data?.name,
        age:parsedBody.data.age,
        ethinicity:parsedBody.data.ethinicity,
        type:parsedBody.data.type,
        eyeColor:parsedBody.data.eyeColor,
        bald : parsedBody.data.bald,
        userId:USERid
    }
  })

  res.json({
    modelId:data.id
  })

  
});

app.post("/ai/generate", async (req, res) => {
  const parsedBody = GenerateImage.safeParse(req.body);
  if(!parsedBody.success){
    res.status(411).json({
      message:"Invalid Input"
    })
  }
});
app.post("/pack/generate", async (req, res) => {});
app.post("/pack/bluk", async (req, res) => {
  res.send("Hello world");
});

app.post("/image", async (req, res) => {
  res.send("Hello world");
});
app.listen(PORT, () => {
  console.log("Started the server..");
});
