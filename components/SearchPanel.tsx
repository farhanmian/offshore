import { useState, useEffect, useRef } from "react";
import { PlusIcon } from "@heroicons/react/solid";
import CloseIcon from "./icons/CloseIcon";
import { SkillType } from "../store/types/types";
import SearchInput from "./SearchInput";
import ExperienceDialog from "./ExperienceDialog";

const SearchPanel = ({ fetchCandidates, state, stateData }: any) => {
  const formRef = useRef<HTMLFormElement>(null);
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

  const handleSubmit = () => {
    const newFilter: any = {
      skill: selectedSkill,
      experience: selectedExperience,
    };

    const isExist: any = stateData.findIndex(
      (data: any) =>
        data.skill.id === newFilter.skill.id &&
        data.experience.years === newFilter.experience.years
    );
    if (isExist >= 0) {
      state.updateAt(isExist, newFilter);
    } else {
      state.insertAt(0, newFilter);
    }
    // setSelectedSkill(null);
  };

  useEffect(() => {
    // const newFilter: any = {
    //   skill: selectedSkill,
    //   experience: selectedExperience,
    // };
    // state.insertAt(0, newFilter);

    fetchCandidates.retry();
  }, [stateData, selectedExperience]);

  const removeFilter = (e: any, index: number) => {
    e.preventDefault();
    state.removeAt(index);
  };

  return (
    <section className="mx-section mbTab:mx-sectionMobile">
      <form
        ref={formRef}
        className="bg-gray2 rounded-md py-8 px-6 my-8 flex justify-between items-center flex-wrap"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
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
        <SearchInput
          selected={selectedSkill}
          setSelected={(e: { name: string }) => setSelectedSkill(e)}
        />
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
                  state={state}
                  stateData={stateData}
                  data={data}
                />
                <p className="whitespace-nowrap">
                  <span>
                    {data.skill.name.length > 18
                      ? `${data.skill.name.slice(0, 17)}..`
                      : data.skill.name}
                  </span>
                  <span className="ml-0.5">
                    (
                    {data.experience.years === 0
                      ? "all"
                      : data.experience.years}
                    )
                  </span>
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
