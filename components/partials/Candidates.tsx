import React, { Fragment, useState } from "react";
import { PlusIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";

import NoValueMessage from "./NoValueMessage";

const Candidates = ({ candidates, toggleEnabled, loadMore, loading }: any) => {
  return (
    <Fragment>
      <ul
        className={`${
          !toggleEnabled
            ? "flex-nowrap justify-start"
            : "flex-wrap justify-between"
        } flex items-stretch  mbTab:flex-col overflow-x-auto`}
      >
        {/* // Four candidates render here. */}
        {candidates && candidates.length > 0 ? (
          !loadMore ? (
            candidates
              .slice(0, 4)
              .map((candidate: any, i: number) => (
                <Candidate
                  key={i}
                  candidate={candidate}
                  toggleEnabled={toggleEnabled}
                />
              ))
          ) : (
            <CandidateList candidates={candidates} />
          )
        ) : (
          !loading && (
            <NoValueMessage>
              {"Look like there's no candidate..."}
            </NoValueMessage>
          )
        )}
      </ul>
    </Fragment>
  );
};

const Candidate = ({ candidate, toggleEnabled }: any) => {
  const { employeeNumber, description, skills } = candidate;

  return (
    <li
      className={`${
        !toggleEnabled ? "w-1/4" : "w-[48%] mr-0"
      } bg-white rounded shadow-2xl p-4 mb-6 relative mr-4 last:mr-0 flex flex-col mbTab:w-full mbTab:min-h-[30rem]`}
    >
      <span className="clippy absolute left-0">
        <span className="bg-primaryBlue w-[19rem] h-14 absolute z-0 block left-0 mbTab:w-96"></span>
      </span>

      <div className="flex justify-between items-center relative z-10">
        <div className="w-full py-2 text-white">
          <h2 className="font-bold">{employeeNumber}</h2>
          <p className="text-sm">+2 years</p>
        </div>
        <button>
          <PlusIcon className="w-6 h-auto text-gray3" />
        </button>
      </div>

      <p className="text-gray1 my-4 text-subBase">{description}</p>

      <div className="shadow-2xl flex justify-between items-center py-2 px-3 my-2 font-bold">
        <p className="text-gray3 text-sm">Rating</p>
        <h2>Medium best</h2>
      </div>

      <ul className="flex flex-wrap mt-6 mbTab:mt-auto">
        {skills &&
          skills.map((skill: any, index: number) => (
            <li
              key={index}
              className="shadow-full p-2 font-semibold text-black text-sm rounded flex justify-center items-center whitespace-nowrap mb-3 mr-1.5 even:mr-0 px-4 flex-1 text-center"
            >
              {skill.name}
            </li>
          ))}
      </ul>
    </li>
  );
};

const CandidateList = ({ candidates }: any) => {
  const [show, setShow] = useState(false);
  const [tooltipData, setTooltipData] = useState([]);
  const styles: any = {
    head: "text-gray3 whitespace-nowrap font-bold text-xs border-b border-b-solid border-b-primary-main px-7 py-4",
    body: "px-7 py-4 capitalize font-medium text-sm whitespace-nowrap table-data h-16",
  };

  const handleMouseEnter = (data: any) => {
    setTooltipData(data);
    setShow(true);
  };

  return (
    <Fragment>
      <table className="rounded-lg w-full text-left bg-white mb-10 shadow-table overflow-hidden mbTab:overflow-x-auto">
        <thead>
          <tr>
            <th className={styles.head}>Candidate No.</th>
            <th className={styles.head}>Title</th>
            <th className={styles.head}>All Skills known</th>
            <th className={styles.head}>OverAll Rating</th>
            <th className={styles.head}>Notice Period</th>
            <th className={styles.head}>Available From</th>
          </tr>
        </thead>
        {/* Users */}
        <tbody>
          {candidates &&
            candidates.map((candidate: any, i: number) => {
              return (
                <tr
                  key={i}
                  className="hover:bg-gray5"
                  onMouseEnter={() => handleMouseEnter(candidate)}
                  onMouseLeave={() => setShow(false)}
                >
                  <td className={styles.body}>{candidate.employeeNumber}</td>
                  <td className={styles.body}>{candidate.title}</td>
                  <td className={styles.body}>
                    {candidate.skills.map((skill: any, i: number) => {
                      return (
                        <span key={i} className="mr-2 last:mr-0 capitalize">
                          {skill.name},
                        </span>
                      );
                    })}
                  </td>
                  <td className={styles.body}>
                    {candidate.rating || "No rating"}
                  </td>
                  <td className={styles.body}>
                    {candidate?.noticePeriod || "15 days"}
                  </td>
                  <td className={styles.body}>{candidate.updatedAt}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
      <Tooltip data={tooltipData} show={show} />
    </Fragment>
  );
};

function Tooltip({ show, data }: any) {
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
        className={` ${
          show ? "block" : "hidden"
        } z-50 tooltip-gradient fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-[30rem] p-4 user-select-none pointer-events-none`}
      >
        <div className="bg-white rounded h-full p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="font-bold">
              <h2 className="text-xl">{employeeNumber}</h2>
              <h2 className="text-xl capitalize">{title}</h2>
              <p className="text-xs text-gray3">{description}</p>
            </div>

            <a href="" className="text-secondary-main font-bold">
              Candidate Info
            </a>
          </div>
          <ul className="flex flex-wrap">
            {skills &&
              skills.map((item: any) => (
                <li
                  key={item.id}
                  className="shadow-full p-2 font-semibold text-black text-sm rounded flex justify-center items-center whitespace-nowrap mb-3 mr-1.5 even:mr-0 px-4 flex-1 text-center"
                >
                  {item.name}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </Transition>
  );
}

export default Candidates;
