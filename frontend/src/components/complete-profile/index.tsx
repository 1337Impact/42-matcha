import { useEffect, useState } from "react";
import { signupSchema } from "../../utils/zod/signupSchema";
import axios from "axios";
import UploadImage from "../upload-image";
import ReactSelect from "react-select";

const tagsList = ["tag1", "tag2", "tag3", "tag4", "tag5"].map((tag) => ({
  value: tag,
  label: tag,
}));

const uploadImage = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });
  const response = await axios.post("http://localhost:3000/api/update-profile", formData);
  return response.data;
};

export default function CompleteProfile({}: {}) {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState({
    gender: "",
    sexual_preferences: "",
    bio: "",
    tags: [],
  });
  const [images, setImages] = useState<string[]>(Array(5).fill(""));
  const [imageFiles, setImagFiles] = useState<(File | null)[]>(
    Array(5).fill(null)
  );
  // const [error, setError] = useState(data); 



  const handleChange = (e: any) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const handleTagsChange = (e: any) => {
    setData({ ...data, tags: e.map((tag: any) => tag.value) });
  };


  const onSubmit = async () => {
    // setError({
    //   email: "",
    //   username: "",
    //   last_name: "",
    //   first_name: "",
    //   password: "",
    // });
    // const result = signupSchema.safeParse(data);
    // if (!result.success) {
    //   result.error.errors.forEach((err) => {
    //     setError((prev) => ({ ...prev, [err.path[0]]: err.message }));
    //   });
    //   return;
    // }
    try {
      console.log(data);
      const images = await uploadImage(imageFiles.filter((file) => file !== null) as File[]);
      console.log(images);
      // console.log(data);
      // // setStatus("loading");
      // const response = await axios.post(
      //   "http://localhost:3000/api/update-profile",
      //   data
      // );
      // setStatus("success");
      // window.localStorage.setItem("token", response.data.token);
      // console.log(response);
    } catch (error: any) {
      // setStatus("failed");
      // setSignUpError(error.response.data.error);
    }
  };

  
  if (!open) return null;

  return (
    <div
      className="flex items-center absolute w-full h-full z-30 backdrop-blur-sm"
    >
      <div className="w-[90%] rounded-lg mx-auto p-4 bg-gray-100">
        <h1 className="text-xl font-bold text-center mb-5">
          Complete your profile
        </h1>
        <div className="mb-3">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="email"
          >
            gender
          </label>
          <select
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="gender"
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {/* {error.email && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.email}
            </p>
          )} */}
        </div>
        <div className="mb-3"></div>
        <div className="mb-3 w-full">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="first_name"
          >
            Sexual preferences
          </label>
          <select
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="sexual_preferences"
            onChange={handleChange}
          >
            <option value="">Select Sexual preferences</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {/* {error.first_name && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.first_name}
            </p>
          )} */}
        </div>
        <div className="mb-3 w-full">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="biography"
          >
            biography
          </label>
          <textarea
            rows={4}
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="biography"
            placeholder="biography"
            onChange={handleChange}
          />
          {/* {error.last_name && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.last_name}
            </p>
          )} */}
        </div>
        <div className="mb-3 w-full">
          <ReactSelect
            defaultValue={tagsList.filter((tag) =>
              data.tags?.includes(tag.value as never)
            )}
            onChange={handleTagsChange}
            options={tagsList}
            isMulti
          />
        </div>
        <div className="mb-5">
          <div className="flex gap-2 flex-wrap">
            {images.map((img, index) => (
              <UploadImage
                key={index}
                image={img}
                setImage={(image) => {
                  const newImages = [...images];
                  newImages[index] = image || "";
                  setImages(newImages);
                }}
                setImgFile={(imageFile) => {
                  const newImageFiles = [...imageFiles];
                  newImageFiles[index] = imageFile;
                  setImagFiles(newImageFiles);
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            className="w-full hover:bg-gray-500 border-2 border-gray-500 text-black font-bold py-1 px-4 rounded"
            onClick={() => setOpen(false)}
          >
            Skip
          </button>
          <button
            className="w-full  border-2 border-gray-500 bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded"
            onClick={onSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
