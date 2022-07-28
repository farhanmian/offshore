import React, { useEffect, useState, Fragment } from "react";
import { useAsyncRetry, useList } from "react-use";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";

import Candidates from "../components/Candidates";
import SearchPanel from "../components/SearchPanel";
import Loader from "../components/Loader";
import ArrowNext from "../components/icons/ArrowNext";
import { getCookie, setCookies } from "cookies-next";
import { useAppContext } from "../store/context/AppContext";
import { BASE_URL } from "../api/config";

const Search = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const url = `${BASE_URL}/client/get/candidate/?limit=${limit}&page=${page}`;
  const [stateData, state] = useList<any | never>([]);
  const [loadMore, setLoadMore] = useState<boolean>(false);

  const [candidateHiringList, setCandidateHiringlist] = useState<string[]>([]);
  const { setHiringListCount } = useAppContext();

  useEffect(() => {
    const hiringList: any = getCookie("hiringList");
    const list = hiringList ? JSON.parse(hiringList) : [];

    setCandidateHiringlist(list);
  }, []);

  const toggleCandidateToHiringList = (id: string) => {
    if (candidateHiringList.includes(id)) {
      // remove
      const updatedData = candidateHiringList.filter((item) => item !== id);
      setCandidateHiringlist(updatedData);
      setHiringListCount(updatedData.length);
      setCookies("hiringList", updatedData);
    } else {
      // add
      const updatedData =
        candidateHiringList.length > 0 ? [...candidateHiringList, id] : [id];
      setCandidateHiringlist(updatedData);
      setHiringListCount(updatedData.length);
      setCookies("hiringList", updatedData);
    }
  };

  const fetchCandidates = useAsyncRetry(async () => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        relation: "and",
        values: stateData.map((value: any) => {
          return {
            skill: value.skill.name,
            experience: value.experience.years,
          };
        }),
      }),
    });

    const result = await response.json();

    if (result) {
      return result;
    }
  }, [stateData, url]);

  console.log("fetchedCandidates", fetchCandidates);

  return (
    <>
      <SearchPanel
        state={state}
        stateData={stateData}
        fetchCandidates={fetchCandidates}
      />

      <section className="my-4 relative mx-section mbTab:mx-sectionMobile">
        <div className="flex justify-between items-center">
          <h2 className="text-lg text-secondary-main font-bold">
            Search Results
          </h2>
          <button
            className="text-secondary-main hover:text-secondary-dark font-bold"
            onClick={() => setLoadMore(!loadMore)}
          >
            {!loadMore ? "See more" : "See less"}
          </button>
        </div>

        {/* Candidates List */}
        <ul className="bg-gray6 min-h-[10rem] mbTab:min-h-[15rem] relative my-4 rounded-lg flex items-stretch justify-between px-8 mbTab:px-4 py-4 flex-wrap">
          <li className="w-full">
            <div
              className={`${
                loadMore && "mb-10"
              } flex justify-between items-center`}
            >
              <h3 className="text-black font-bold mb-4 mbTab:mb-0">
                All Skills Result
              </h3>
              {loadMore && (
                <CandidateLimitDropdown setLimit={setLimit} limit={limit} />
              )}
            </div>
            <Candidates
              onToggleCandidateToHiringList={toggleCandidateToHiringList}
              hiringList={candidateHiringList}
              candidates={fetchCandidates.value}
              loading={fetchCandidates.loading}
              loadMore={loadMore}
              stateData={stateData}
            />
          </li>
          {fetchCandidates.loading && <Loader className="text-center" />}
        </ul>
        {loadMore && (
          <Pagination
            data={fetchCandidates.value}
            pageIndex={page}
            setPageIndex={setPage}
          />
        )}
      </section>
    </>
  );
};

function CandidateLimitDropdown({ setLimit, limit }: any) {
  const pagination = [5, 10, 15, 20, 25];

  return (
    <div className="bg-primaryBlue rounded inline-flex justify-between items-center py-1 pl-4 pr-1">
      <h2 className="text-white font-medium text-xs mr-4">
        No. of Candidates shown
      </h2>
      <div className="w-32 small:w-20">
        <Listbox value={limit} onChange={setLimit}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded bg-white py-1.5 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-primaryBlue sm:text-sm">
              <span className="block truncate font-bold">{limit}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {pagination.map((number) => (
                  <Listbox.Option
                    key={number}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active
                          ? "bg-primaryBlue bg-opacity-20 text-primaryBlue"
                          : "text-gray-900"
                      }`
                    }
                    value={number}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-bold" : "font-medium"
                          }`}
                        >
                          {number}
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
    </div>
  );
}

const Pagination = ({ data, pageIndex, setPageIndex }: any) => {
  const [pages, setPages] = useState(0);

  useEffect(() => {
    if (data) {
      setPages(Math.ceil(data.length / 10));
    }
  }, [data]);

  return (
    <Fragment>
      {data.length > 0 && (
        <div
          className={`relative mx-auto mb-8 flex items-center justify-between text-base font-bold text-secondary-main`}
        >
          <button
            disabled={pageIndex === 0 ? true : false}
            onClick={() => setPageIndex(pageIndex - 1)}
            className={`capitalize flex items-center ${
              pageIndex === 0 ? "opacity-25" : ""
            }`}
          >
            <ArrowNext className="w-5 mr-2 h-auto ml-4 rotate-180 " />
            previous
          </button>

          <button
            disabled={pages - 1 === pageIndex ? true : false}
            onClick={() => setPageIndex(pageIndex + 1)}
            className={`${
              pageIndex === pages - 1 ? "opacity-25" : ""
            } flex capitalize items-center`}
          >
            next
            <ArrowNext className="w-5 h-auto ml-2" />
          </button>
        </div>
      )}
    </Fragment>
  );
};
export default Search;
