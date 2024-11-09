
interface schema {
  startPage: number;
  endPage: number;
}

interface EmblaCarouselOutType {
  slides: any[]

}

export const getSampleData = async ({ startPage, endPage }: schema): Promise<EmblaCarouselOutType> => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { slides: Array.from(Array(endPage - startPage + 1).keys()).map((i) => i + startPage) }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return { slides: [] };
  }
}

export const getSampleDataImage = async ({ startPage, endPage }: schema): Promise<EmblaCarouselOutType> => {
  const data = [
    { id: 1, text: "label1", imageUrl: "https://i.gyazo.com/1c6defc638f71abd065d8dd2f450b207.jpg" },
    { id: 2, text: "label2", imageUrl: "https://i.gyazo.com/7c0573bd6609c7179e296b8123c30054.jpg" },
    { id: 3, text: "label1", imageUrl: "https://i.gyazo.com/9a1bae244482902935c9987040c7f5cb.png" },
    { id: 4, text: "label1", imageUrl: "https://i.gyazo.com/343b83a0b0658de1d08419cfb21f249e.png" },
    { id: 5, text: "label1", imageUrl: "https://i.gyazo.com/175226ec9f3800be54e3f76c1c4d2dca.png" },
    { id: 6, text: "label1", imageUrl: "https://i.gyazo.com/9a1bae244482902935c9987040c7f5cb.png" },
    { id: 7, text: "label1", imageUrl: "https://i.gyazo.com/343b83a0b0658de1d08419cfb21f249e.png" },
    { id: 8, text: "label1", imageUrl: "https://i.gyazo.com/175226ec9f3800be54e3f76c1c4d2dca.png" },
    { id: 9, text: "label1", imageUrl: "https://i.gyazo.com/44bff72b01214b2418ceccd8ae86a6ca.png" }];

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { slides: Array.from(data) }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return { slides: [] };
  }
}