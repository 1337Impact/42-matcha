import Switch from "@mui/material/Switch";
import React from "react";
import SortIcon from "@mui/icons-material/Sort";
import ReactSelect from "react-select";
import { Menu } from "@headlessui/react";

interface SortCriteria {
  age: string;
  interests: boolean;
  distance: boolean;
  fameRating: boolean;
}

interface SortCriteriaProps {
  sortCriteria: SortCriteria;
  setSortCriteria: React.Dispatch<React.SetStateAction<SortCriteria>>;
}

const SortDropdown: React.FC<SortCriteriaProps> = ({
  sortCriteria,
  setSortCriteria,
}) => {
  const [CIChecked, setCIChecked] = React.useState(false);
  const [fameRateChecked, setFameRateChecked] = React.useState(false);
  const [DistanceChecked, setDistanceChecked] = React.useState(false);
  const [sort, setSort] = React.useState("");

  const handleSortChange = (newValue: any) => {
    //newValue.value);
    setSort(newValue.value);
  };

  const applySort = () => {
    setSortCriteria({
      ...sortCriteria,
      age: sort,
      interests: CIChecked,
      distance: DistanceChecked,
      fameRating: fameRateChecked,
    });
    //"Sort applied");
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-20">
      <div>
        <Menu.Button as="div" className="cursor-pointer">
          <SortIcon
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
            Sort Profiles
          </h3>
        </div>

        <div className="p-4">
          <div className="mb-3 w-full">
            <label
              className="block text-gray-600 text-sm font-bold mb-1"
              htmlFor="first_name"
            >
              Sort by age
            </label>
            <ReactSelect
              className="w-full"
              onChange={handleSortChange}
              value={{
                value: sort,
                label: sort === "asc" ? "Ascending" : "Descending",
              }}
              options={[
                { value: "asc", label: "Ascending" },
                { value: "desc", label: "Descending" },
              ]}
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-row items-center w-full justify-between">
            <label
              className="text-gray-700 text-sm font-bold mb-1"
              htmlFor="interests"
            >
              Sort by common Interests
            </label>
            <Switch
              checked={CIChecked}
              onChange={() => setCIChecked(!CIChecked)}
              inputProps={{ "aria-label": "controlled" }}
              color="error"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center w-full">
            <label
              className="text-gray-700 text-sm font-bold mb-1"
              htmlFor="age range"
            >
              sort by fame rating
            </label>
            <Switch
              checked={fameRateChecked}
              onChange={() => setFameRateChecked(!fameRateChecked)}
              inputProps={{ "aria-label": "controlled" }}
              color="error"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between w-full">
            <label
              className="text-gray-700 text-sm font-bold mb-1"
              htmlFor="distance"
            >
              Sort by Distance
            </label>
            <Switch
              checked={DistanceChecked}
              onChange={() => setDistanceChecked(!DistanceChecked)}
              inputProps={{ "aria-label": "controlled" }}
              color="error"
            />
          </div>
        </div>

        <div className="p-4">
          <div className="flex flex-col items-end gap-2 w-full">
            <button
              onClick={applySort}
              className="flex items-end gap-1 text-red-500 font-bold border-2 border-red-500 p-1 rounded-md"
            >
              Apply Sort
            </button>
          </div>
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default SortDropdown;
