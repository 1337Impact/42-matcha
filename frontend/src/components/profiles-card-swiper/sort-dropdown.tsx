import { Menu } from "@headlessui/react";
import Switch from "@mui/material/Switch";
import React from "react";
import SortIcon from "@mui/icons-material/Sort";
import ReactSelect from "react-select";

const SortDropdown: React.FC = () => {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
  };

  const applySort = () => {
    console.log("Sort applied");
  };

  return (
    <Menu as="div" className="relative inline-block text-left z-50">
      <div>
        <Menu.Button>
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
              checked={checked}
              onChange={handleChange}
              inputProps={{ "aria-label": "controlled" }}
              color="error"
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
