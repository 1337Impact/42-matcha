import React, { useState } from "react";
import ProfileDropdown from "./profile-dropdown";
import Notifications from "../notifications/notifications";
import Slider from "@mui/material/Slider";
import ReactSelect from "react-select";
import { tagsList } from "../edit-profile"; // Assuming tags are coming from here
import { SearchIcon } from "lucide-react";

interface SearchCriteria {
  ageRange: number[];
  fameRating: number[];
  location: string;
  interests: string[];
}

const Navbar: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    ageRange: [18, 99],
    fameRating: [0, 10],
    location: "",
    interests: [],
  });

  const toggleSearch = () => setShowSearch(!showSearch);

  const handleAgeChange = (event: any, newValue: number | number[]) => {
    setSearchCriteria((prev) => ({
      ...prev,
      ageRange: newValue as number[],
    }));
  };

  const handleFameRatingChange = (event: any, newValue: number | number[]) => {
    setSearchCriteria((prev) => ({
      ...prev,
      fameRating: newValue as number[],
    }));
  };

  const handleLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCriteria((prev) => ({
      ...prev,
      location: event.target.value,
    }));
  };

  const handleInterestsChange = (selectedOptions: any) => {
    setSearchCriteria((prev) => ({
      ...prev,
      interests: selectedOptions.map((option: any) => option.value),
    }));
  };

  const applySearch = () => {
    console.log("Search Criteria:", searchCriteria);
    // Add logic to filter/sort the profile list based on searchCriteria
  };

  return (
    <header className="w-full max-w-[786px] mx-auto z-50 bg-white text-gray-700 border-b border-gray-200 shadow-md">
      <div className="py-4 mx-4 md:mx-6 lg:mx-8 xl:mx-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-red-500 text-xl font-bold">Logo</div>
          </div>
          <div className="flex gap-4 items-center">
            <button
              className="text-gray-500 hover:text-red-500"
              onClick={toggleSearch}
            >
              <SearchIcon size={24} />
            </button>
            <Notifications />
            <ProfileDropdown />
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="p-4 bg-gray-100 shadow-lg border-t border-gray-200">
          <div className="flex flex-col gap-4">
            {/* Age Range Slider */}
            <div>
              <label className="text-gray-600 text-sm font-bold mb-2">
                Age Range
              </label>
              <Slider
                value={searchCriteria.ageRange}
                onChange={handleAgeChange}
                valueLabelDisplay="auto"
                min={18}
                max={99}
                sx={{ color: "red" }}
              />
            </div>

            {/* Fame Rating Slider */}
            <div>
              <label className="text-gray-600 text-sm font-bold mb-2">
                Fame Rating
              </label>
              <Slider
                value={searchCriteria.fameRating}
                onChange={handleFameRatingChange}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                sx={{ color: "red" }}
              />
            </div>

            {/* Location Input */}
            <div>
              <label className="text-gray-600 text-sm font-bold mb-2">
                Location
              </label>
              <input
                type="text"
                className="p-2 border border-gray-300 rounded-lg w-full"
                placeholder="Enter location"
                value={searchCriteria.location}
                onChange={handleLocationChange}
              />
            </div>

            {/* Interests Select */}
            <div>
              <label className="text-gray-600 text-sm font-bold mb-2">
                Interests
              </label>
              <ReactSelect
                options={tagsList.map((tag) => ({
                  value: tag,
                  label: tag,
                }))}
                isMulti
                onChange={handleInterestsChange}
                placeholder="Select interests"
              />
            </div>

            {/* Apply Search Button */}
            <div className="flex justify-end">
              <button
                onClick={applySearch}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Apply Search
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
