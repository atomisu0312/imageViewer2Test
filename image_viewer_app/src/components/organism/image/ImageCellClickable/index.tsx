import { fileInfoType } from "@/types/fileInfoType"

interface Props {
  data: fileInfoType,
  setTargetData: (data: fileInfoType) => void,
  className?: string
}

export default function ImageCellClickable({ data, setTargetData, className }: Props) {
  const handleClick = () => {
    setTargetData(data);
  }
  return (
    <div onClick={handleClick} className={className}>
      <img
        src={data.imageUrl}
        alt="Your alt text"
        className="h-full"
      />
    </div>)
}