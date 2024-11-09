
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