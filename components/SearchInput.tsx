import { Fragment, useState, useRef, useEffect } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/solid";
import { useAsync } from "react-use";

import SearchIcon from "./icons/SearchIcon";
import { Client } from "../api/apiServices";
import Loader from "../components/Loader";
import SkillsPanel from "./SkillsPanel";
import { useAppContext } from "../store/context/AppContext";

export default function SearchInput({ selected, setSelected }: any) {
  const [query, setQuery] = useState("");
  const { landingPageSearchFormValue } = useAppContext();

  const fetchAllSkills = useAsync(async () => {
    try {
      const response = await Client.getAllSkills();
      if (response.stauts !== 200) {
        throw new Error(response);
      }
      const data = await response.data;
      console.log("data", data);
      return data;
    } catch (err) {
      console.log(err);
      return [];
    }
  }, []);

  const filteredSkills =
    query === ""
      ? fetchAllSkills.value
      : fetchAllSkills.value.filter((skill: any) =>
          skill.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Fragment>
      <div className="flex-1 mbTab:w-full">
        <Combobox value={selected} onChange={setSelected}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                className="w-full rounded border-none py-2 pl-4 pr-12 text-base leading-5 text-gray3 focus:ring-0"
                displayValue={(skills: any) =>
                  skills ? skills?.name : landingPageSearchFormValue
                }
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by job, skill set, candidate number"
              />
              <Combobox.Button className="absolute inset-y-0 right-0  pr-2 flex justify-center items-center">
                {fetchAllSkills.loading ? (
                  <Loader className="w-4 h-auto m-0" />
                ) : (
                  <SearchIcon className="w-6" />
                )}
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery("")}
            >
              <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-50">
                {filteredSkills &&
                filteredSkills.length <= 0 &&
                query !== "" ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray3">
                    Nothing found.
                  </div>
                ) : (
                  filteredSkills &&
                  filteredSkills.map((skill: any) => (
                    <Combobox.Option
                      key={skill.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? "bg-primaryBlue text-white" : "text-gray3"
                        }`
                      }
                      value={skill}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {skill.name}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? "text-white" : "text-primaryBlue"
                              }`}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
      <SkillsPanel setSelected={setSelected} data={fetchAllSkills} />
    </Fragment>
  );
}
