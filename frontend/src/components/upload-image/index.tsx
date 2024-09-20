import { Plus } from "lucide-react";
import { useEffect } from "react";

interface AddProductImageProps {
  setImgFile: (imgFile: File | null) => void;
  image?: string | null;
  setImage: (img: string | null) => void;
}

export default function UploadImage({
  setImgFile,
  image,
  setImage,
}: AddProductImageProps) {

  const handleUploadClick = async (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      setImgFile(file);
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        setImage(reader.result as string);
      };
    }
  };

  const handleResetClick = () => {
    setImage("");
    setImgFile(null);
  };

  useEffect (() => {
    //"image: ", image);
  }
  ,[image]);

  return (
    <div className="w-24 h-32 flex flex-col justify-center items-center border border-gray-300 rounded-lg overflow-hidden relative">
      {image ? (
        <>
          <img
            src={image}
            alt="product image"
            className="w-full aspect-square object-cover"
          />
          <button
            onClick={handleResetClick}
            className="w-full h-full cursor-pointer text-center bg-red-500 text-white font-semibold"
          >
            Remove
          </button>
        </>
      ) : (
        <label className="w-full h-full flex justify-center items-center cursor-pointer relative">
          <input
            accept="image/jpeg,image/png,image/webp"
            id="contained-button-file"
            name="logo"
            type="file"
            onChange={handleUploadClick}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <Plus />
        </label>
      )}
    </div>
  );
}
