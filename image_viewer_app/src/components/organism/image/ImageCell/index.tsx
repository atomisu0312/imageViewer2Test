import ImageOnLabel from "@/components/molecule/imageOnLabel"
import { fileInfoType } from "@/types/fileInfoType"

interface Props {
  data: fileInfoType,
  setTargetData: (data: fileInfoType) => void,
  className?: string
}

export default function ImageCell({ data, setTargetData, className }: Props) {
  const handleClick = () => {
    setTargetData(data);
  }
  return (
    <div onClick={handleClick} className="w-1/12">
      <ImageOnLabel labelText={data.text} imageUrl={data.imageUrl} className={className} />
    </div>)
}