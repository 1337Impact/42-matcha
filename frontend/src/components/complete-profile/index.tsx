import axios from "axios";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import completeProfileSchema from "../../utils/zod/completeProfileSchema";
import UploadImage from "../upload-image";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getProfileData } from "../../pages/profile/utils";

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
  { label: "Bird Watching", value: "Bird Watching" },
];

interface EditProfileProps {
  handleClose: () => void;
}

export default function EditProfile({ handleClose }: EditProfileProps) {
  const token = window.localStorage.getItem("token");
  const user = useSelector((state: RootState) => state.userSlice.user);
  const initialData = {
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    sexual_preferences: "",
    biography: "",
    tags: [],
    images: Array(5).fill(""),
  };
  const [data, setData] = useState(initialData);

  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    sexual_preferences: "",
    biography: "",
    tags: "",
    images: "",
  });

  const [imagePreview, setImagePreview] = useState<(string | null)[]>(
    data.images
  );

  useEffect(() => {
    getProfileData(user?.id as string)
      .then((data: any) => {
        setData({
          ...initialData,
          images: data.pictures ? data.pictures : Array(5).fill(""),
        });
      })
      .catch((error) => {
        console.error("error: ", error);
      });
  }, []);

  useEffect(() => {
    setImagePreview(data.images);
  }, [data.images]);
 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (selectedOption: any, actionMeta: any) => {
    const { name } = actionMeta;
    setData({ ...data, [name]: selectedOption ? selectedOption.value : "" });
  };

  const handleTagsChange = (selectedOptions: any) => {
    setData({
      ...data,
      tags: selectedOptions
        ? selectedOptions.map((option: any) => option.value)
        : [],
    });
  };

  const onSubmit = async () => {
    setError({
      first_name: "",
      last_name: "",
      age: "",
      gender: "",
      sexual_preferences: "",
      biography: "",
      tags: "",
      images: "",
    });
    
    const result = completeProfileSchema.safeParse({
      ...data,
      images: imagePreview,
      age: parseInt(data.age),
    });
    if (!result.success) {
      const validationErrors = result.error.errors.reduce(
        (acc: any, err: any) => {
          acc[err.path[0]] = err.message;
          return acc;
        },
        {}
      );
      setError(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("age", data.age);
      formData.append("gender", data.gender);
      formData.append("sexual_preferences", data.sexual_preferences);
      formData.append("biography", data.biography);
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("images", JSON.stringify(imagePreview));

      await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/profile/update`,
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
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex items-center justify-center fixed inset-0 z-50 backdrop-blur-sm overflow-auto overflow-y-auto ">
      <div className="w-[100%] max-w-[790px] max-h-[80dvh] overflow-y-scroll rounded-lg mx-auto p-8 bg-gray-100">
        <h1 className="text-2xl font-bold text-start pt-2 pb-6 text-gray-700">
          Complete Your Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Age */}
          <div className="w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="age"
            >
              Age
            </label>
            <input
              className={`border-2 rounded w-full py-2 px-4 text-gray-700 border-gray-300 focus:border-indigo-500 focus:outline-none placeholder-gray-400 ${
                error.age ? "border-red-500" : ""
              }`}
              id="age"
              type="number"
              placeholder="Age"
              value={data.age}
              onChange={handleChange}
              min="0"
            />
            {error.age && (
              <p className="text-red-500 text-xs mt-1">{error.age}</p>
            )}
          </div>
        </div>

        {/* Gender and Sexual Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Gender */}
          <div className="w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="gender"
            >
              Gender
            </label>
            <ReactSelect
              name="gender"
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
                  : null
              }
              onChange={handleSelectChange}
              placeholder="Select Gender"
              className={`react-select-container ${
                error.gender ? "border-red-500" : ""
              }`}
              classNamePrefix="react-select"
            />
            {error.gender && (
              <p className="text-red-500 text-xs mt-1">{error.gender}</p>
            )}
          </div>

          {/* Sexual Preferences */}
          <div className="w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="sexual_preferences"
            >
              Sexual Preferences
            </label>
            <ReactSelect
              name="sexual_preferences"
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
                  : null
              }
              onChange={handleSelectChange}
              placeholder="Select Sexual Preferences"
              className={`react-select-container ${
                error.sexual_preferences ? "border-red-500" : ""
              }`}
              classNamePrefix="react-select"
            />
            {error.sexual_preferences && (
              <p className="text-red-500 text-xs mt-1">
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
            className={`border-2 rounded w-full py-2 px-4 text-gray-700 border-gray-300 focus:border-indigo-500 focus:outline-none placeholder-gray-400 ${
              error.biography ? "border-red-500" : ""
            }`}
            id="biography"
            placeholder="Tell us about yourself..."
            value={data.biography}
            onChange={handleChange}
          />
          {error.biography && (
            <p className="text-red-500 text-xs mt-1">{error.biography}</p>
          )}
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label
            className="block text-gray-600 text-sm font-bold mb-1"
            htmlFor="tags"
          >
            Interests & Hobbies
          </label>
          <ReactSelect
            isMulti
            options={tagsList}
            value={tagsList.filter((tag) =>
              data.tags.includes(tag.value as never)
            )}
            onChange={handleTagsChange}
            placeholder="Select your interests"
            className={`react-select-container ${
              error.tags ? "border-red-500" : ""
            }`}
            classNamePrefix="react-select"
          />
          {error.tags && (
            <p className="text-red-500 text-xs mt-1">{error.tags}</p>
          )}
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label
            className="block text-gray-600 text-sm font-bold mb-2"
            htmlFor="images"
          >
            Upload Images
          </label>
          <div className="flex flex-wrap gap-4">
            {imagePreview &&
              imagePreview.map((image, index) => (
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
                    return file;
                  }}
                />
              ))}
          </div>
          {error.images && (
            <p className="text-red-500 text-xs mt-1">{error.images}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <button
            className="w-full md:w-1/2 bg-red-500 hover:bg-red-300 text-white font-bold py-2 px-4 rounded transition duration-200"
            onClick={onSubmit}
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}
