import axios from "axios";
import { useEffect, useState } from "react";
import ReactSelect from "react-select";
import { toast } from "react-toastify";
import UploadImage from "../../components/upload-image";
import completeProfileSchema from "../../utils/zod/completeProfileSchema";

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

export default function Settings() {
  const token = window.localStorage.getItem("token");
  const initialData = {
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    sexual_preferences: "",
    biography: "",
    tags: [] as string[],
    images: Array(5).fill(""),
    new_password: "",
    confirm_password: "",
    address: "",
    latitude: 0,
    longitude: 0,
    age: "",
  };
  const [data, setData] = useState(initialData);

  const [error, setError] = useState({
    first_name: "",
    last_name: "",
    email: "",
    gender: "",
    sexual_preferences: "",
    biography: "",
    tags: "",
    images: "",
    password: "",
    confirm_password: "",
    address: "",
    age: "",
  });

  const [imageFiles, setImageFiles] = useState<(File | null)[]>(
    Array(5).fill(null)
  );
  const [imagePreview, setImagePreview] = useState<(string | null)[]>(
    data.images
  );

  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);

  useEffect(() => {
    // Fetch user profile data on component mount
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          }
        );
        //"response", response.data, response.data.pictures.length);
        const pictureArrayFromString = JSON.parse(response.data.pictures);
        //"pictureArray", pictureArrayFromString);
        setImagePreview(pictureArrayFromString);
        setData({
          ...initialData, // Ensure all fields are present
          first_name: response.data.first_name ?? "",
          last_name: response.data.last_name ?? "",
          email: response.data.email ?? "",
          gender: response.data.gender ?? "",
          sexual_preferences: response.data.sexual_preferences ?? "",
          biography: response.data.bio ?? "",
          tags: response.data.interests ?? [],
          images: pictureArrayFromString ?? Array(5).fill(""),
          address: response.data.address ?? "",
          latitude: response.data.latitude ?? 0,
          longitude: response.data.longitude ?? 0,
          age: response.data.age ?? "",
          new_password: "",
          confirm_password: "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile data", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleTagsChange = (selectedOptions: any) => {
    setData({ ...data, tags: selectedOptions?.map((tag: any) => tag.value) });
  };

  const onAddressChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setData({ ...data, address: query });

    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=${
          import.meta.env.VITE_APP_GEOAPIFY_API_KEY
        }`
      );
      //"Address suggestions: --------> ", response.data);
      const suggestions = response.data.features.map(
        (feature: any) => feature.properties
      );
      setAddressSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  const onSelectAddress = (address: any) => {
    setSelectedAddress(address);
    setData({
      ...data,
      address: address.formatted,
      latitude: address.lat,
      longitude: address.lon,
    });
    setAddressSuggestions([]);
  };

  const onSubmit = async () => {
    setError({
      first_name: "",
      last_name: "",
      email: "",
      images: "",
      tags: "",
      biography: "",
      sexual_preferences: "",
      gender: "",
      password: "",
      confirm_password: "",
      address: "",
      age: "",
    });

    if (data.new_password && data.new_password !== data.confirm_password) {
      setError((prev) => ({
        ...prev,
        confirm_password: "Passwords do not match",
      }));
    }

    const result = completeProfileSchema.safeParse({
      ...data,
      images: imagePreview,
      address: selectedAddress ? selectedAddress.formatted : data.address,
      age: parseInt(data.age),
    });
    if (!result.success) {
      result.error.errors.forEach((err) => {
        setError((prev) => ({ ...prev, [err.path[0]]: err.message }));
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("gender", data.gender);
      formData.append("sexual_preferences", data.sexual_preferences);
      formData.append("biography", data.biography);
      formData.append("tags", JSON.stringify(data.tags));
      formData.append("images", JSON.stringify(data.images));
      formData.append("new_password", data.new_password);
      formData.append("confirm_password", data.confirm_password);
      formData.append("address", data.address);
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      formData.append("age", parseInt(data.age).toString());
      imageFiles.forEach((file) => {
        file && formData.append("images", file);
      });

      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/profile/settings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Your profile has been updated");
    } catch (error: any) {
      console.error("Failed to update profile", error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="w-full p-4 bg-white ">
      <h1 className="text-2xl font-bold text-start mb-5">Edit Your Profile</h1>

      {/* First Name */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="first_name"
        >
          First Name
        </label>
        <input
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="first_name"
          value={data.first_name}
          onChange={handleChange}
          placeholder="Enter your first name"
        />
        {error.first_name && (
          <p className="text-red-500 text-xs mt-1">{error.first_name}</p>
        )}
      </div>

      {/* Last Name */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="last_name"
        >
          Last Name
        </label>
        <input
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="last_name"
          value={data.last_name}
          onChange={handleChange}
          placeholder="Enter your last name"
        />
        {error.last_name && (
          <p className="text-red-500 text-xs mt-1">{error.last_name}</p>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="email"
        >
          Email
        </label>
        <input
          type="email"
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="email"
          value={data.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        {error.email && (
          <p className="text-red-500 text-xs mt-1">{error.email}</p>
        )}
      </div>

      {/* Address */}

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="address"
        >
          Address
        </label>
        <input
          type="text"
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="address"
          value={data.address}
          onChange={onAddressChange}
          placeholder="Enter your address"
        />
        {error.address && (
          <p className="text-red-500 text-xs mt-1">{error.address}</p>
        )}
        {/* Display Address Suggestions */}
        {addressSuggestions.length > 0 && (
          <ul className="bg-white border rounded shadow-md">
            {addressSuggestions &&
              addressSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => onSelectAddress(suggestion)}
                >
                  {suggestion.formatted}
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="age"
        >
          Age
        </label>
        <input
          type="text"
          placeholder="Enter your age"
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="age"
          value={data.age}
          onChange={handleChange}
        />
        {error.age && <p className="text-red-500 text-xs mt-1">{error.age}</p>}
      </div>

      {/* Gender */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="gender"
        >
          Gender
        </label>
        <select
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="gender"
          value={data.gender}
          onChange={handleChange}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {error.gender && (
          <p className="text-red-500 text-xs mt-1">{error.gender}</p>
        )}
      </div>

      {/* Sexual Preferences */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="sexual_preferences"
        >
          Sexual Preferences
        </label>
        <select
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="sexual_preferences"
          value={data.sexual_preferences}
          onChange={handleChange}
        >
          <option value="">Select Sexual Preferences</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {error.sexual_preferences && (
          <p className="text-red-500 text-xs mt-1">
            {error.sexual_preferences}
          </p>
        )}
      </div>

      {/* Biography */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="biography"
        >
          Biography
        </label>
        <textarea
          rows={4}
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="biography"
          placeholder="Tell us about yourself"
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
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="tags"
        >
          Tags
        </label>
        <ReactSelect
          value={tagsList.filter((tag) =>
            data.tags?.includes(tag.value as never)
          )}
          onChange={handleTagsChange}
          options={tagsList}
          isMulti
        />
        {error.tags && (
          <p className="text-red-500 text-xs mt-1">{error.tags}</p>
        )}
      </div>

      {/* Change Password */}
      {/* New Password */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="new_password"
        >
          New Password
        </label>
        <input
          type="password"
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="new_password"
          value={data.new_password}
          onChange={handleChange}
        />
        {error.password && (
          <p className="text-red-500 text-xs mt-1">{error.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="confirm_password"
        >
          Confirm Password
        </label>
        <input
          type="password"
          className="border rounded w-full py-2 px-3 text-gray-700"
          id="confirm_password"
          value={data.confirm_password}
          onChange={handleChange}
        />
        {error.confirm_password && (
          <p className="text-red-500 text-xs mt-1">{error.confirm_password}</p>
        )}
      </div>

      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
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
          <p className="text-red-500 text-xs mt-1">{error.images}</p>
        )}
      </div>
      <div className="flex justify-between gap-4">
        <button
          className="w-full bg-gray-300 text-black font-bold py-2 px-4 rounded"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          className="w-full bg-gray-600 text-white font-bold py-2 px-4 rounded"
          onClick={onSubmit}
        >
          Update
        </button>
      </div>
    </div>
  );
}
