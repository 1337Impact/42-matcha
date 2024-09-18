import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../store";
import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import TuneIcon from "@mui/icons-material/Tune";
import ReactSelect from "react-select";
import { tagsList } from "../edit-profile";
import Slider from "@mui/material/Slider";
import axios from "axios";

const FilterDropdown: React.FC = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  //   const ProfilesFilter = useSelector(
  //     (state: RootState) => state.profileFilterSlice
  //   );
  interface ProfileFilter {
    distance: number;
    sexual_preferences: string;
    interests: string[];
  }
  const [ProfilesFilter, setProfilesFilter] = useState({
    distance: 10,
    sexual_preferences: "",
    interests: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/signin");
  };

  const sexPreference = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const handleSexPreferenceChange = (choice: any) => {
    console.log(choice);
    setProfilesFilter({
      ...ProfilesFilter,
      sexual_preferences: choice.value,
    });
  };

  const handleTagsChange = (tags: any) => {
    console.log(tags);
    setProfilesFilter({
      ...ProfilesFilter,
      interests: tags.map((tag: any) => tag.value),
    });
  };

  const handleDistanceChange = (distance: any) => {
    console.log(distance.target.value);
    setProfilesFilter({
      ...ProfilesFilter,
      distance: distance.target.value,
    });
  };

  const applyFilter = async () => {
    const token = window.localStorage.getItem("token");
    console.log(ProfilesFilter);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/profile/FilteredProfiles`,
        {
            ProfilesFilter: ProfilesFilter,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Filtered profiles: ", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <div>
        <Menu.Button>
          <TuneIcon
            sx={{
              width: 32,
              height: 32,
              color: "red",
              fontWeight: "bold",
            }}
          />
        </Menu.Button>
      </div>

      <Menu.Items className="absolute right-0 w-[20rem] mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-4">
          <h3 className="text-gray-700 text-start p-1 w-full font-semibold">
            Filter Profiles
          </h3>
        </div>

        <div className="p-4">
          <div className="mb-3 w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="first_name"
            >
              Sexual preferences
            </label>
            <ReactSelect
              className="w-full"
              onChange={handleSexPreferenceChange}
              defaultValue={
                ProfilesFilter.sexual_preferences
                  ? {
                      value: ProfilesFilter.sexual_preferences,
                      label: ProfilesFilter.sexual_preferences,
                    }
                  : null
              }
              options={sexPreference}
              isMulti={false}
              placeholder="Select your preference"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-start gap-2 w-full">
            <label
              className="text-gray-700 text-sm font-bold mb-1"
              htmlFor="interests"
            >
              Common Interests
            </label>
            <ReactSelect
              className="w-full"
              defaultValue={ProfilesFilter.interests.map((tag) => ({
                value: tag,
                label: tag,
              }))}
              onChange={handleTagsChange}
              options={tagsList as any}
              isMulti
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-start gap-0 w-full">
            <label
              className="text-gray-700 text-sm font-bold mb-1"
              htmlFor="distance"
            >
              Distance
            </label>
            <Slider
              className="w-full"
              defaultValue={
                ProfilesFilter.distance ? ProfilesFilter.distance : 10
              }
              onChange={handleDistanceChange}
              aria-label="Default"
              valueLabelDisplay="auto"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-end gap-2 w-full">
            <button
              onClick={applyFilter}
              className="flex items-end gap-1 text-red-500 font-bold border-2 border-red-500 p-1 rounded-md"
            >
              Apply Filter
            </button>
          </div>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default FilterDropdown;
