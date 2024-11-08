import ImageWithFallback from "@/components/atom/imageWithFallBack";
import TextLabel from "@/components/atom/textClickable";
interface Props {
  labelText: string,
  imageUrl: string,
  className?: string
}

export default function ImageOnLabel({ labelText, imageUrl, className }: Props) {
  const classNameDefault = "flex flex-col items-center justify-center mx-3"
  const classNameImage = className ? `${className} ${classNameDefault}` : classNameDefault;

  return (
    <>
      <div className={classNameImage}>
        <ImageWithFallback
          src={imageUrl}
          alt="Vercel Logo"
          height={1000}
          width={1000}
          fallback="/Donald.jpg" />
      </div>
    </>
  )
}