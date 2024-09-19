import { Menu } from "@headlessui/react";
import TuneIcon from "@mui/icons-material/Tune";
import Slider from "@mui/material/Slider";
import React, { useState } from "react";
import ReactSelect from "react-select";
import { tagsList } from "../edit-profile";

interface ProfilesFilter {
  distance: number;
  sexual_preferences: string;
  interests: string[];
  agerange: number[];
}

interface FilterDropDownProps {
  ProfilesFilter: ProfilesFilter;
  setProfilesFilter: React.Dispatch<React.SetStateAction<ProfilesFilter>>;
}

const FilterDropdown: React.FC<FilterDropDownProps> = ({
  ProfilesFilter,
  setProfilesFilter,
}) => {
  const [sexual_preferences, setSexual_preferences] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [distance, setDistance] = useState<number>(10);
  const [ageRange, setAgeRange] = useState<number[]>([18, 22]);

  const sexPreference = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const handleSexPreferenceChange = (choice: any) => {
    console.log(choice);
    setSexual_preferences(choice.value);
  };

  const handleTagsChange = (tags: any) => {
    console.log(tags);
    setTags(tags.map((tag: any) => tag.value));
  };

  const handleDistanceChange = (distance: any) => {
    console.log(distance.target.value);
    setDistance(distance.target.value);
  };

  const handleAgeRangeChange = (event: Event, newValue: number | number[]) => {
    event.preventDefault();
    if (typeof newValue === "number") {
      setAgeRange([newValue, ageRange[1]]);
      return;
    }
    setAgeRange(newValue);
  };

  const applyFilter = async () => {
    setProfilesFilter({
      distance: distance,
      sexual_preferences: sexual_preferences,
      interests: tags,
      agerange: ageRange,
    });
  };

  return (
    <Menu as="div" className="relative inline-block text-right z-20">
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
          <div className="mb-3 w-full text-start">
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

        <div className="p-4 ">
          <div className="flex flex-col text-start items-start gap-2 w-full">
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
              htmlFor="age range"
            >
              age range
            </label>
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={
                ProfilesFilter.agerange
              }
              onChange={handleAgeRangeChange}
              valueLabelDisplay="auto"
              sx={{
                color: "red",
              }}
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
              sx={{
                color: "red",
              }}
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
