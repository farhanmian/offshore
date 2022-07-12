import { Transition } from "@headlessui/react";
import React, { Fragment } from "react";

const Tooltip: React.FC<{ show: boolean; data: any; display?: string }> = ({
  show,
  data,
  display,
}) => {
  const { title, employeeNumber, description, skills } = data;

  return (
    <Transition
      as={Fragment}
      show={show}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        id="toolkit"
        className={` ${show ? "block" : "hidden"} z-50 tooltip-gradient ${
          display
            ? display
            : "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        }  h-80 w-[30rem] p-4 user-select-none`}
      >
        <div className="bg-white rounded h-full p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="font-bold">
              <h2 className="text-xl">{employeeNumber}</h2>
              <p className="text-xs text-gray3">{title}</p>
              {/* <h2 className="text-xl capitalize">{title}</h2> */}
            </div>

            <a href="" className="text-secondary-main font-bold">
              Candidate Info
            </a>
          </div>
          <div className="w-full h-full mt-5">
            {skills &&
              skills.map((item: any, i: number) => {
                return (
                  <div
                    key={i}
                    className="py-1 px-3 bg-white inline-block rounded border border-gray-400 mr-2.5 mb-2.5"
                  >
                    {item.name}
                  </div>
                );
              })}
          </div>

          {/* <ul className="flex flex-wrap">
            {skills &&
              skills.map((item: any) => (
                <li
                  key={item.id}
                  className="shadow-full p-2 font-semibold text-black text-sm rounded flex justify-center items-center whitespace-nowrap mb-3 mr-1.5 even:mr-0 px-4 flex-1 text-center"
                >
                  {item.name}
                </li>
              ))}
          </ul> */}
        </div>
      </div>
    </Transition>
  );
};
export default Tooltip;
