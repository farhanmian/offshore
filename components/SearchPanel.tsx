import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/solid";

import CloseIcon from "./icons/CloseIcon";
import { SkillType } from "../store/types/types";
import SearchInput from "./SearchInput";
import SettingsIcon from "./icons/SettingsIcon";
import ExperienceDialog from "./ExperienceDialog";

const SearchPanel = ({ fetchCandidates, state, stateData }: any) => {
  const experiences = [
    { years: 0 },
    { years: 1 },
    { years: 2 },
    { years: 3 },
    { years: 4 },
    { years: 5 },
    { years: 6 },
  ];
  const [selectedSkill, setSelectedSkill] = useState<SkillType | any>(null);
  const [selectedExperience, setSelectedExperience] = useState(experiences[0]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newFilter: any = {
      skill: selectedSkill,
      experience: selectedExperience,
    };
    // checking if filter already exist or not
    const isExist: any = stateData.findIndex(
      (data: any) => data.skill.id === newFilter.skill.id
    );
    if (isExist === -1) {
      // setting new filter
      state.insertAt(0, newFilter);
    }
    console.log("------------isExist", isExist);
    setSelectedSkill(null);
  };

  useEffect(() => {
    fetchCandidates.retry();
  }, [stateData, selectedExperience]);

  const removeFilter = (e: any, index: number) => {
    e.preventDefault();
    state.removeAt(index);
  };

  return (
    <section className="mx-section mbTab:mx-sectionMobile">
      <form
        className="bg-gray2 rounded-md py-8 px-6 my-8 flex justify-between items-center flex-wrap"
        onSubmit={(e) => handleSubmit(e)}
      >
        {selectedSkill && (
          <input type="hidden" name="skill" value={selectedSkill?.name} />
        )}
        {selectedExperience && (
          <input
            type="hidden"
            name="experience"
            value={selectedExperience.years}
          />
        )}
        {/* Search bar */}
        <SearchInput selected={selectedSkill} setSelected={setSelectedSkill} />
        <button
          type="submit"
          className="button-primary cursor-pointer ml-6 mbTab:w-full mbTab:mt-4 mbTab:order-4 flex justify-between items-center"
          disabled={
            selectedSkill === null || selectedSkill === "" ? true : false
          }
        >
          <span>
            <PlusIcon className="w-4 h-auto text-white mr-1" />
          </span>
          Add
        </button>

        <span className="w-full bg-white h-[1px] mb-4 order-4"></span>
        {/* Filters array */}
        <ul className="w-full mt-4 flex items-center order-5 mbTab:w-full mbTab:flex-wrap mbTab:justify-between">
          {stateData.map((data: any, idx: number) => {
            return (
              <li
                key={idx}
                className="text-white rounded mr-4 last:mr-0 flex justify-between items-center w-65 bg-white bg-opacity-20 py-2 pl-4 pr-2 mbTab:w-[48%] mbTab:mr-0 mbTab:mb-2"
              >
                <ExperienceDialog
                  experiences={experiences}
                  selectedExperience={selectedExperience}
                  setSelectedExperience={setSelectedExperience}
                />
                <p className="whitespace-nowrap">
                  <span>{data.skill.name}</span>
                  <span className="ml-0.5">({data.experience.years})</span>
                </p>
                <button
                  onClick={(e) => {
                    removeFilter(e, idx);
                  }}
                  className="px-2"
                >
                  <CloseIcon />
                </button>
              </li>
            );
          })}
        </ul>
      </form>
    </section>
  );
};

export default SearchPanel;
