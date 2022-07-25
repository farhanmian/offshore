import { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import NextLink from "next/link";

import Search from "./icons/Search";
import Input from "./partials/Input";
import { Client, User } from "../api/apiServices";
import { useAppContext } from "../store/context/AppContext";
import LoadingSpinner from "./partials/Loading/LoadingSpinner";

export default function SearchBar({ className }: any) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [candidateList, setCandidateList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchValue("");
  }, [router.asPath, router.pathname]);

  useEffect(() => {
    if (searchValue.trim().length === 0) return;
    setIsLoading(true);
    const fetchCandidates = async () => {
      const resp = await Client.searchCandidateByEmployeeNo(searchValue); /// search endpoint
      console.log("nav resp", resp);
      if (resp.status !== 200) return;
      setCandidateList(resp.data);
      setIsLoading(false);
    };
    const id = setTimeout(() => {
      fetchCandidates();
    }, 500);

    () => clearTimeout(id);
  }, [searchValue]);

  const searchChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  return (
    <div className={className ? className : "relative w-80"}>
      <Input
        placeholder="Search by Candidate No."
        width="w-full"
        icon={<Search />}
        shadow
        handleForm={searchChangeHandler}
        value={searchValue}
      />

      {searchValue.length > 0 && (
        <div className="w-[100%] max-h-72 overflow-y-auto absolute top-[120%] left-0 min-h-[40px] bg-slate-50 shadow-sm rounded border border-t-0 rounded-t-none px-3 py-5">
          {!isLoading ? (
            candidateList.length > 0 ? (
              candidateList.map(
                (
                  item: { title: string; id: string; employeeNumber: string },
                  i
                ) => {
                  return (
                    <NextLink key={i} href={`/accountInfo?id=${item.id}`}>
                      <div className="flex items-center justify-between w-full font-medium py-2 px-1 rounded transition100 mb-2 cursor-pointer hover:bg-gray-200">
                        <abbr
                          title={
                            item.employeeNumber.length > 7
                              ? item.employeeNumber
                              : ""
                          }
                        >
                          <p>
                            {item.employeeNumber.length > 7
                              ? `${item.employeeNumber.slice(0, 6)}...`
                              : item.employeeNumber}
                          </p>
                        </abbr>
                        <p>{`(Candidates's Job Profile)`}</p>
                      </div>
                    </NextLink>
                  );
                }
              )
            ) : (
              <p className="font-semibold text-sm text-center">
                No search result found!
              </p>
            )
          ) : (
            <LoadingSpinner spinnerClassName="h-5 w-5 m-auto" />
          )}
        </div>
      )}
    </div>
  );
}

export const MobileSearchBar = () => {
  let [isOpen, setIsOpen] = useState(true);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }
  return (
    <>
      <button type="button" onClick={openModal}>
        <Search />
      </button>
      {isOpen && (
        <Fragment>
          <div
            className="bg-black fixed inset-0 bg-opacity-40 z-40"
            onClick={closeModal}
          ></div>
          <div className="fixed top-4 left-0 right-0 z-50 pt-1.5 px-2">
            <SearchBar className="w-full relative bg-white" />
          </div>
        </Fragment>
      )}
    </>
  );
};
