import { Menu } from "@headlessui/react";
import SearchIcon from "@mui/icons-material/Search";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import ReactSelect from "react-select";
import { tagsList } from "../edit-profile";

interface SearchCriteria {
  agerange: number[];
  fameRating: number[];
  distance: number;
  interests: string[];
  sexual_preferences: string;
}

interface AdvancedSearchMenuProps {
  searchCriteria: SearchCriteria;
  setSearchCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
}

const AdvancedSearchMenu: React.FC<AdvancedSearchMenuProps> = ({
  searchCriteria,
  setSearchCriteria,
}) => {
  const [ageGap, setAgeGap] = useState([18, 99]);
  const [fameRatingGap, setFameRatingGap] = useState([0, 10]);
  const [distance, setDistance] = useState(10);
  const [interestTags, setInterestTags] = useState<string[]>([]);

  const handleAgeGapChange = (event: any, newValue: number | number[]) => {
    setAgeGap(newValue as number[]);
    return event;
  };

  const handleFameRatingGapChange = (
    event: any,
    newValue: number | number[]
  ) => {
    setFameRatingGap(newValue as number[]);
    return event;
  };

  const handleLocationChange = (newValue: any) => {
    setDistance(newValue.value);
  };

  const handleInterestTagsChange = (selectedOptions: any) => {
    setInterestTags(selectedOptions.map((option: any) => option.value));
  };

  const applySearch = () => {
    setSearchCriteria({
      agerange: [ageGap[0], ageGap[1]],
      fameRating: [fameRatingGap[0], fameRatingGap[1]],
      distance,
      interests: interestTags,
      sexual_preferences: searchCriteria.sexual_preferences,
    });
  };

  return (
    <Menu as="div" className="relative inline-block text-right z-20">
      <Menu.Button as="div" className="cursor-pointer">
        <div>
          <Menu.Button as="div" className="cursor-pointer">
            <SearchIcon
              sx={{
                width: 32,
                height: 32,
                color: "gray",
                fontWeight: "bold",
              }}
            />
          </Menu.Button>
        </div>
      </Menu.Button>

      <Menu.Items className="absolute right-0 w-[20rem] mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-4">
          <h3 className="text-gray-700 text-start p-1 w-full font-semibold">
            Advanced Search
          </h3>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-start gap-0 w-full">
            <label className="text-gray-700 text-sm font-bold mb-1">
              Age Gap
            </label>
            <Slider
              value={ageGap}
              onChange={handleAgeGapChange}
              valueLabelDisplay="auto"
              min={0}
              max={99}
              sx={{ color: "blue" }}
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-start gap-0 w-full">
            <label className="text-gray-700 text-sm font-bold mb-1">
              Fame Rating Gap
            </label>
            <Slider
              value={fameRatingGap}
              onChange={handleFameRatingGapChange}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              sx={{ color: "blue" }}
            />
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3 w-full text-start">
            <label className="block text-gray-600 text-sm font-bold mb-2">
              Location
            </label>
            <div className="flex items-center gap-2 flex-nowrap">
              <ReactSelect
                className="w-full"
                onChange={handleLocationChange}
                value={{
                  value: distance,
                  label: "Within " + distance + " Km",
                }}
                options={[
                  { value: 20, label: "Within 20 Km" },
                  { value: 50, label: "Within 50 Km" },
                  { value: 100, label: "Within 100 Km" },
                ]}
                placeholder="Select location"
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col text-start items-start gap-2 w-full">
            <label className="text-gray-700 text-sm font-bold mb-1">
              Interest Tags
            </label>
            <ReactSelect
              className="w-full"
              value={interestTags.map((tag) => ({ value: tag, label: tag }))}
              onChange={handleInterestTagsChange}
              options={tagsList}
              isMulti
              placeholder="Select interests"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-end gap-2 w-full">
            <button
              onClick={applySearch}
              className="flex items-end gap-1 text-blue-500 font-bold border-2 border-blue-500 p-1 rounded-md"
            >
              Apply Search
            </button>
          </div>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default AdvancedSearchMenu;
