'use server'
import { fileInfoType } from "@/types/fileInfoType";

export const getData = async () => {
  const data = [
    { id: 1, text: "label1", imageUrl: "https://i.gyazo.com/1c6defc638f71abd065d8dd2f450b207.jpg" },
    { id: 2, text: "label2", imageUrl: "https://i.gyazo.com/7c0573bd6609c7179e296b8123c30054.jpg" },
    { id: 3, text: "label1", imageUrl: "https://i.gyazo.com/9a1bae244482902935c9987040c7f5cb.png" },
    { id: 4, text: "label1", imageUrl: "https://i.gyazo.com/343b83a0b0658de1d08419cfb21f249e.png" },
    { id: 5, text: "label1", imageUrl: "https://i.gyazo.com/175226ec9f3800be54e3f76c1c4d2dca.png" },
    { id: 6, text: "label1", imageUrl: "https://i.gyazo.com/44bff72b01214b2418ceccd8ae86a6ca.png" }];

  await new Promise(resolve => setTimeout(resolve, 1000));
  return data as fileInfoType[];
}

interface Props {
  apiKey: String;
}
export const getDataFromApiKey = async () => {
  const res = await fetch('https://api.gyazo.com/api/images', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.GYAZP_APP_TOKEN_FOR_APP}`
    },
  });
  const dataTest = await res.json();

  console.log(dataTest);

  const data = [
    { id: 1, text: "label1", imageUrl: "https://i.gyazo.com/1c6defc638f71abd065d8dd2f450b207.jpg" },
    { id: 2, text: "label2", imageUrl: "https://i.gyazo.com/7c0573bd6609c7179e296b8123c30054.jpg" },
    { id: 6, text: "label1", imageUrl: "https://i.gyazo.com/44bff72b01214b2418ceccd8ae86a6ca.png" }];

  await new Promise(resolve => setTimeout(resolve, 1000));
  return data as fileInfoType[];
}