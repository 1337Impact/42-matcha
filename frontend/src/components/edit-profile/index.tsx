import axios from "axios";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import { UserProfile } from "../../pages/profile/utils";
import updateProfileSchema from "../../utils/zod/updateProfileSchema";
import UploadImage from "../upload-image";

export const tagsList = [
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
  { label: "Bird Watching", value: "Bird Watching" },
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
    age: initialData.age,
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
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
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

  const handleGenderChange = (choice: any) => {
    setData({ ...data, gender: choice.value });
  };

  const handleSexPreferenceChange = (choice: any) => {
    setData({ ...data, sexual_preferences: choice.value });
  };

  const onSubmit = async () => {
    //data);
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
    const result = updateProfileSchema.safeParse({
      ...data,
      images: imagePreview,
    });
    if (!result.success) {
      result.error.errors.forEach((err) => {
        setError((prev) => ({ ...prev, [err.path[0]]: err.message }));
      });
      return;
    }
    try {
      const formData = new FormData();
      formData.append("gender", data.gender);
      formData.append("sexual_preferences", data.sexual_preferences);
      formData.append("biography", data.biography);
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("images", JSON.stringify(data.images));
      formData.append("age", data.age.toString());
      imageFiles.forEach((file) => {
        file && formData.append("images", file);
      });

      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/profile/update`,
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
      //error);
      toast.error("Failed to update profile");
    }
  };

  useEffect(() => {
    //"images: ", data.images);
  }, [data.images]);

  return (
    <div className="flex items-center fixed inset-0 z-50 backdrop-blur-sm">
      <div className="w-[95%] md:w-[80%] lg:w-[60%] xl:w-[50%] max-h-[80dvh] overflow-y-auto rounded-lg mx-auto p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-5 text-gray-800">
          Edit your profile
        </h1>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
          <div className="w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="first_name"
            >
              First Name
            </label>
            <input
              className="border-2 rounded w-full py-2 px-4 text-gray-700 border-gray-300 focus:border-gray-500 focus:outline-none placeholder-gray-400"
              id="first_name"
              type="text"
              placeholder="First Name"
              value={data.first_name}
              onChange={handleChange}
            />
            {error.first_name && (
              <p className="text-red-400 font-medium text-xs mt-1">
                {error.first_name}
              </p>
            )}
          </div>

          <div className="w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="last_name"
            >
              Last Name
            </label>
            <input
              className="border-2 rounded w-full py-2 px-4 text-gray-700 border-gray-300 focus:border-gray-500 focus:outline-none placeholder-gray-400"
              id="last_name"
              type="text"
              placeholder="Last Name"
              value={data.last_name}
              onChange={handleChange}
            />
            {error.last_name && (
              <p className="text-red-400 font-medium text-xs mt-1">
                {error.last_name}
              </p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="border-2 rounded w-full py-2 px-4 text-gray-700 border-gray-300 focus:border-gray-500 focus:outline-none placeholder-gray-400"
            id="email"
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
          />
          {error.email && (
            <p className="text-red-400 font-medium text-xs mt-1">
              {error.email}
            </p>
          )}
        </div>

        {/* Gender and Sexual Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-4">
          <div className="w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="gender"
            >
              Gender
            </label>
            <ReactSelect
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              value={
                data.gender
                  ? {
                      value: data.gender,
                      label:
                        data.gender.charAt(0).toUpperCase() +
                        data.gender.slice(1),
                    }
                  : ""
              }
              onChange={handleGenderChange}
              classNamePrefix="react-select"
            />
            {error.gender && (
              <p className="text-red-400 font-medium text-xs mt-1">
                {error.gender}
              </p>
            )}
          </div>

          <div className="w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="sexual_preferences"
            >
              Sexual Preferences
            </label>
            <ReactSelect
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
              value={
                data.sexual_preferences
                  ? {
                      value: data.sexual_preferences,
                      label:
                        data.sexual_preferences.charAt(0).toUpperCase() +
                        data.sexual_preferences.slice(1),
                    }
                  : ""
              }
              onChange={handleSexPreferenceChange}
              classNamePrefix="react-select"
            />
            {error.sexual_preferences && (
              <p className="text-red-400 font-medium text-xs mt-1">
                {error.sexual_preferences}
              </p>
            )}
          </div>
        </div>

        {/* Biography */}
        <div className="mb-4">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="biography"
          >
            Biography
          </label>
          <textarea
            rows={4}
            className="border-2 rounded w-full py-2 px-4 text-gray-700 border-gray-300 focus:border-gray-500 focus:outline-none placeholder-gray-400"
            id="biography"
            placeholder="Biography"
            value={data.biography}
            onChange={handleChange}
          />
          {error.biography && (
            <p className="text-red-400 font-medium text-xs mt-1">
              {error.biography}
            </p>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <ReactSelect
            defaultValue={tagsList.filter((tag) =>
              data.tags?.includes(tag.value)
            )}
            onChange={handleTagsChange}
            options={tagsList}
            isMulti
            classNamePrefix="react-select"
          />
          {error.tags && (
            <p className="text-red-400 font-medium text-xs mt-1">
              {error.tags}
            </p>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-6">
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
                  setImageFiles((prev) => {
                    const newFiles = [...prev];
                    newFiles[index] = file;
                    return newFiles;
                  });
                }}
              />
            ))}
          </div>
          {error.images && (
            <p className="text-red-400 font-medium text-xs mt-1">
              {error.images}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-4">
          <button
            className="w-full border-2 border-gray-400 hover:bg-gray-500 hover:text-white text-black font-bold py-2 px-4 rounded transition duration-200"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="w-full bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded transition duration-200"
            onClick={onSubmit}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
