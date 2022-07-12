import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";

export default function ExperienceList({
  selectedExperience,
  setSelectedExperience,
  experiences,
}: any) {
  const { years } = selectedExperience;

  return (
    <div className="w-full mbTab:mt-4">
      <Listbox value={selectedExperience} onChange={setSelectedExperience}>
        <div className="relative mt-1">
          <Listbox.Button
            placeholder="No. of years of Experience"
            className="relative w-full cursor-default rounded bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm"
          >
            <span className="block truncate">
              {years === 0
                ? "All"
                : years === 1
                ? `${years} year of experience`
                : `${years} years of experience`}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon className="h-5 w-5 text-gray3" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {experiences.map((experience: any, experienceIdx: number) => (
                <Listbox.Option
                  key={experienceIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 mbTab:px-4 pr-4 ${
                      active ? "bg-primaryBlue text-white" : "text-gray-900"
                    }`
                  }
                  value={experience}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                      >
                        {experience.years === 0
                          ? "All"
                          : experience.years === 1
                          ? `${experience.years} year of experience`
                          : `${experience.years} years of experience`}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primaryBlue">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
