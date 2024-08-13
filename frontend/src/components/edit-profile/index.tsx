import { useEffect, useState } from "react";
import axios from "axios";
import UploadImage from "../upload-image";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { UserProfile } from "../../pages/profile/utils";
import updateProfileSchema from "../../utils/zod/updateProfileSchema";

const tagsList = [
  { label: "Reading", value: "Reading" },
  { label: "Traveling", value: "Traveling" },
  { label: "Gardening", value: "Gardening" },
  { label: "Cooking", value: "Cooking" },
  { label: "Photography", value: "Photography" },
  { label: "Drawing", value: "Drawing" },
  { label: "Painting", value: "Painting" },
  { label: "Writing", value: "Writing" },
  { label: "Fishing", value: "Fishing" },
  { label: "Hiking", value: "Hiking" },
  { label: "Swimming", value: "Swimming" },
  { label: "Cycling", value: "Cycling" },
  { label: "Yoga", value: "Yoga" },
  { label: "Dancing", value: "Dancing" },
  { label: "Running", value: "Running" },
  { label: "Playing Music", value: "Playing Music" },
  { label: "Knitting", value: "Knitting" },
  { label: "Crafting", value: "Crafting" },
  { label: "Gaming", value: "Gaming" },
  { label: "Bird Watching", value: "Bird Watching" }
];


interface EditProfileProps {
  initialData: UserProfile;
  handleClose: () => void;
}

export default function EditProfile({
  initialData,
  handleClose,
}: EditProfileProps) {
  const token = window.localStorage.getItem("token");
  const [data, setData] = useState({
    first_name: initialData.first_name,
    last_name: initialData.last_name,
    email: initialData.email,
    images: initialData.pictures,
    tags: initialData.interests,
    biography: initialData.bio,
    sexual_preferences: initialData.sexual_preferences,
    gender: initialData.gender,
  });
  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    email: "",
    images: "",
    tags: "",
    biography: "",
    sexual_preferences: "",
    gender: "",
  });
  const [imageFiles, setImagFiles] = useState<(File | null)[]>(
    Array(5).fill(null)
  );
  const [imagePreview, setImagePreview] = useState<(string | null)[]>(
    data.images
  );

  const handleChange = (e: any) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };
  const handleTagsChange = (e: any) => {
    setData({ ...data, tags: e.map((tag: any) => tag.value) });
  };

  const onSubmit = async () => {
    console.log(data);
    setError({
      first_name: "",
      last_name: "",
      email: "",
      images: "",
      tags: "",
      biography: "",
      sexual_preferences: "",
      gender: "",
    });
    const result = updateProfileSchema.safeParse({...data, images: imagePreview});
    if (!result.success) {
      result.error.errors.forEach((err) => {
        setError((prev) => ({ ...prev, [err.path[0]]: err.message }));
      });
      return;
    }
    try {
      console.log(data);
      const formData = new FormData();
      formData.append("gender", data.gender);
      formData.append("sexual_preferences", data.sexual_preferences);
      formData.append("biography", data.biography);
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("images", JSON.stringify(data.images));
      imageFiles.forEach((file) => {
        file && formData.append("images", file);
      });
      await axios.post(
        "http://localhost:3000/api/profile/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Your profile has been updated");
      handleClose();
    } catch (error: any) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    console.log("images: ", data.images);
  }, [data.images]);

  return (
    <div className="flex items-center fixed top-0 w-full h-full z-50 backdrop-blur-sm">
      <div className="w-[90%] max-h-[80dvh] overflow-y-scroll rounded-lg mx-auto p-4 bg-gray-100">
        <h1 className="text-xl font-bold text-center mb-5">
          Edit your profile
        </h1>
        <div className="flex gap-2 w-full">
          <div className="mb-3 w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="first_name"
            >
              First Name
            </label>
            <input
              className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
              id="first_name"
              type="text"
              placeholder="First Name"
              value={data.first_name}
              onChange={handleChange}
            />
            {error.first_name && (
              <p className="text-red-400 font-medium text-xs -mb-[8px]">
                {error.first_name}
              </p>
            )}
          </div>
          <div className="mb-3 w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="last_name"
            >
              Last Name
            </label>
            <input
              className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
              id="last_name"
              type="text"
              placeholder="Last Name"
              value={data.last_name}
              onChange={handleChange}
            />
            {error.last_name && (
              <p className="text-red-400 font-medium text-xs -mb-[8px]">
                {error.last_name}
              </p>
            )}
          </div>
        </div>
        <div className="mb-3">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="border-2 rounded w-full py-1 px-3 text-gray-600 border-gray-500 placeholder-gray-300"
            id="email"
            type="email"
            required={false}
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
          />
          {error.email && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.email}
            </p>
          )}
        </div>
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
            value={data.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {error.gender && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.gender}
            </p>
          )}
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
            value={data.sexual_preferences}
            onChange={handleChange}
          >
            <option value="">Select Sexual preferences</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {error.sexual_preferences && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.sexual_preferences}
            </p>
          )}
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
            value={data.biography}
            onChange={handleChange}
          />
          {error.biography && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.biography}
            </p>
          )}
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
          {error.tags && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.tags}
            </p>
          )}
        </div>
        <div className="mb-5">
          <div className="flex gap-2 flex-wrap">
            {imagePreview.map((image, index) => (
              <UploadImage
                key={index}
                image={image}
                setImage={(image) => {
                  setImagePreview((prev) => {
                    const newImages = [...prev];
                    newImages[index] = image;
                    return newImages;
                  });
                  if (!image) {
                    setData((prev) => {
                      const newImages = [...prev.images];
                      newImages[index] = "";
                      return { ...prev, images: newImages };
                    });
                  }
                }}
                setImgFile={(file) => {
                  setImagFiles((prev) => {
                    const newFiles = [...prev];
                    newFiles[index] = file;
                    return newFiles;
                  });
                }}
              />
            ))}
          </div>
          {error.images && (
            <p className="text-red-400 font-medium text-xs -mb-[8px]">
              {error.images}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            className="w-full hover:bg-gray-500 border-2 border-gray-500 text-black font-bold py-1 px-4 rounded"
            onClick={handleClose}
          >
            Cancel
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
