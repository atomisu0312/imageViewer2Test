import ImageOnLabel from "@/components/molecule/imageOnLabel"
import { fileInfoType } from "@/types/fileInfoType"

interface Props {
  data: fileInfoType,
  setTargetData: (data: fileInfoType) => void,
  className?: string
}

export default function ImageCell({ data, setTargetData }: Props) {
  const handleClick = () => {
    setTargetData(data);
  }
  return (
    <div onClick={handleClick} className="w-1/6">
      <ImageOnLabel labelText={data.text} imageUrl={data.imageUrl} />
    </div>)
}