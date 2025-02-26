"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import axios from "axios";
import { BACKEND_URL, CLOUDFLARE_URL } from "@/lib/config";
import JSZip from "jszip";
import { useState } from "react";
import {
  EthinicityType,
  EyeColorType,
  TrainModelInputType,
  TrainModelType,
} from "common/inferred-types";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

const Train = () => {
  const [zipUrl, setZipUrl] = useState("dfsfs");
  const [type, setType] = useState<TrainModelType>("Man");
  const [age, setAge] = useState<number>(0);
  const [name, setName] = useState("");
  const [ethinicity, setEthinicity] = useState<EthinicityType>("White");
  const [eyeColor, setEyeColor] = useState<EyeColorType>("Blue");
  const [bald, setBald] = useState(false);
  const router = useRouter();
  const {getToken} = useAuth()
  const handleFileChange = async (files: File[]) => {
    const zip = new JSZip();
    console.log(files);
    const res = await axios.get(`${BACKEND_URL}/pre-signed-url`, {});
    const url = res.data.url;
    const key = res.data.key;

    for (const file of files) {
      const content = await file.arrayBuffer();
      zip.file(file.name, content);
    }

    const content = await zip.generateAsync({ type: "blob" });
    const formData = new FormData();

    formData.append("file", content, url);
    formData.append("key", url);

    const response = await axios.put(url, formData);
    setZipUrl(`${CLOUDFLARE_URL}/${key}`);
  };

  const trainModel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const input: TrainModelInputType = {
      name: name,
      type: type,
      age: age,
      ethinicity: ethinicity,
      eyeColor: eyeColor,
      bald: bald,
      zipUrl: zipUrl,
    };
    console.log(input)

    const token = await getToken();

    const res = await axios.post(`${BACKEND_URL}/ai/training`, input,{
      headers:{
        authorization:`Bearer ${token}`
      }
    });3
    console.log(res)
    router.push("/")
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-10">
      <Card className="w-[700px]">
        <CardHeader>
          <CardTitle>Create a new model</CardTitle>
          <CardDescription>Deploy your new model in one-click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-start gap-6 grid-cols-2">
              {/* Left Column */}
              <div className="flex flex-col space-y-4 pb-5">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Name of your model"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    placeholder="Age of your model"
                    onChange={(e) => {
                      setAge(Number(e.target.value));
                    }}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    onValueChange={(value: TrainModelType) => {
                      setType(value);
                    }}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Man">Man</SelectItem>
                      <SelectItem value="Woman">Woman</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="ethnicity">Ethnicity</Label>
                  <Select
                    onValueChange={(value: EthinicityType) => {
                      setEthinicity(value);
                    }}
                  >
                    <SelectTrigger id="ethnicity">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Asian_American">
                        Asian American
                      </SelectItem>
                      <SelectItem value="East_Asian">East Asian</SelectItem>
                      <SelectItem value="South_East_Asian">
                        South East Asian
                      </SelectItem>
                      <SelectItem value="South_Asian">South Asian</SelectItem>
                      <SelectItem value="Middle_Eastern">
                        Middle Eastern
                      </SelectItem>
                      <SelectItem value="Pacific">Pacific</SelectItem>
                      <SelectItem value="Hispanic">Hispanic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="eyeColor">Eye Color</Label>
                  <Select
                    onValueChange={(value: EyeColorType) => {
                      setEyeColor(value);
                    }}
                  >
                    <SelectTrigger id="eyeColor">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="Brown">Brown</SelectItem>
                      <SelectItem value="Blue">Blue</SelectItem>
                      <SelectItem value="Hazel">Hazel</SelectItem>
                      <SelectItem value="Gray">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between space-y-0">
                  <Label htmlFor="bald">Bald</Label>
                  <Switch
                    id="bald"
                    onClick={(e) => {
                      setBald(!bald);
                    }}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col justify-between h-full pb-5">
                <div className="flex-grow">
                  <FileUpload
                    multiple={true}
                    onChange={(files) => handleFileChange(files)}
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      !eyeColor ||
                      !ethinicity ||
                      !bald ||
                      !type ||
                      !age
                    }
                    onClick={trainModel}
                  >
                    Create Model
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Train;
