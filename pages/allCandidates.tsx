import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";
import { URLS } from "../api/config";
import ArrowDown from "../components/icons/ArrowDown";
import Delete from "../components/icons/Delete";
import Edit from "../components/icons/Edit";
import KebabMenu from "../components/icons/KebabMenu";
import HeadingPrimary from "../components/partials/HeadingPrimary";
import skill1 from "../assets/img/skill-1.png";
import skill2 from "../assets/img/skill-2.png";
import skill3 from "../assets/img/skill-3.png";
import Image from "next/image";
import Candidates from "../components/partials/Candidates";
import Tooltip from "../components/partials/Tooltip";
import { Client } from "../api/apiServices";
import Pagination from "../components/partials/Pagination";
import LoadingSpinner from "../components/partials/Loading/LoadingSpinner";
import NoOfCandidateShown from "../components/partials/NoOfCandidateShown";
import { noImgFoundBase64 } from "../assets/img/no-img-found-base64";
import { info } from "console";

const CandidateCard: React.FC<{
  className: string;
  rating: string;
  noticePeriod: string;
  availableFrom: string;
  candidate: {
    employeeNumber: string;
    description: string;
    title: string;
    skills: [];
    id: string;
  };
}> = ({ candidate, className, rating, noticePeriod, availableFrom }) => {
  const router = useRouter();

  const [showSkills, setShowSkills] = useState(false);
  const [showModal, setShowModal] = useState(
    candidate.title === "candi8" ? true : false
  );

  return (
    <div
      className={`min-h-[80px] pt-3 rounded ${className} ${
        showSkills ? "shadow-sm" : ""
      }`}
    >
      <div
        id={`${candidate.id}`}
        className="grid sm:hover:bg-gray5 active:hover:bg-gray5 active:shadow-sm p-1 py-3 rounded cursor-pointer grid-cols-3 md:grid-cols-6 gap-0 items-center justify-between text-black font-medium relative"
        onClick={() => router.push(`/accountInfo?id=${candidate.id}`)}
      >
        <p className="col-span-1">{candidate.employeeNumber}</p>
        <p className="col-span-1 justify-self-center md:justify-self-start">
          {candidate.title}
        </p>

        <div className="md:flex hidden gap-1 lg:gap-2">
          {candidate.skills
            .slice(0, candidate.skills.length > 3 ? 3 : candidate.skills.length)
            .map((item: { id: string; iconUrl: string }, i) => {
              const icon = item.iconUrl ? item.iconUrl : noImgFoundBase64;
              return (
                <div
                  key={i}
                  className="lg:w-[30px] lg:h-[30px] w-6 h-6 rounded-sm bg-primary-main flex items-center justify-center overflow-hidden"
                >
                  <Image
                    loader={() =>
                      item.iconUrl
                        ? item.iconUrl === "iconUrl"
                          ? noImgFoundBase64
                          : item.iconUrl
                        : noImgFoundBase64
                    }
                    unoptimized
                    width={"100%"}
                    height={"100%"}
                    src={
                      item.iconUrl
                        ? item.iconUrl === "iconUrl"
                          ? noImgFoundBase64
                          : item.iconUrl
                        : noImgFoundBase64
                    }
                    alt="skill-img"
                  />
                </div>
              );
            })}
          {candidate.skills.length > 3 && (
            <div
              onMouseEnter={() => {
                setShowModal(true);
              }}
              onMouseLeave={() => {
                setShowModal(false);
              }}
              className="lg:h-[30px] h-6 rounded relative bg-primary-main flex items-center justify-center px-1 lg:px-2"
            >
              <p className="lg:font-bold font-semibold text-sm text-white">
                {candidate.skills.length < 9
                  ? `+${candidate.skills.length - 3}`
                  : "9+"}
              </p>
              {showModal && (
                <div className="absolute hidden pointer-events-none md:inline-block bottom-0 left-0 w-full h-full tooltip">
                  <Tooltip show data={candidate} display="absolute" />
                </div>
              )}
            </div>
          )}
        </div>

        <p className="justify-self-center lg:justify-self-start">{rating}</p>
        <p className="hidden md:inline-block text-center xl:text-left">
          {noticePeriod}
        </p>
        <p className="hidden md:inline-block">{availableFrom}</p>
      </div>
      {!showSkills && (
        <span
          className="mt-2  md:hidden m-auto w-5 h-5 flex justify-center items-center cursor-pointer rounded-full"
          onClick={() => {
            setShowSkills(true);
          }}
        >
          <ArrowDown />
        </span>
      )}

      <div
        className={`bg-slate-50 rounded mt-3 transition-all ease-out duration-200 w-full border border-t-0 border-gray-300 ${
          showSkills ? "inline-block h-[120px]" : "h-0 overflow-hidden"
        } md:hidden`}
      >
        <p className="text-gray3 mt-2 text-xs font-bold text-center mb-1">
          Skills
        </p>
        <p className="w-[98%] m-auto h-16 overflow-auto border rounded border-gray-400 p-1">
          {candidate.skills.map((item: { name: string }, i) =>
            i + 1 === candidate.skills.length ? item.name : `${item.name}, `
          )}
        </p>
        <span
          className="rotate-180 flex items-center justify-center w-5 h-5 m-auto mt-2"
          onClick={() => {
            setShowSkills(false);
          }}
        >
          <ArrowDown />
        </span>
      </div>
    </div>
  );
};

const AllCandidates: React.FC<{
  candidatesData: { candidates: []; count: number };
}> = ({ candidatesData }) => {
  const router = useRouter();
  const curPage = router.query.page;
  const [candidatesListData, setCandidatesListData] = useState({
    ...candidatesData,
  });

  console.log("candidatesData001021215State", candidatesListData);

  const [limit, setLimit] = useState(8);
  const [page, setPage] = useState(curPage ? +curPage : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const resp = await Client.getAllCandidatesClient(limit, page);

        if (resp.status !== 200) {
          throw new Error(resp);
        }
        console.log("resp candidate data", resp);

        const pageCount = Math.ceil(resp.data.count / limit);
        setTotalPages(pageCount);

        setCandidatesListData(resp.data);
        setIsLoading(false);

        if (resp.data.candidates.length === 0 && resp.data.count > 0) {
          router.push(`/admin/dashboard?page=${page - 1}`);
          setPage((prev) => prev - 1);
        }
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, [page, limit]);

  const goNextPageHandler = () => {
    if (page === totalPages) return;
    router.push(`${router.pathname}?page=${page + 1}`);
    setPage(page + 1);
  };
  const goPrevPageHandler = () => {
    if (page === 1) return;
    router.push(`${router.pathname}?page=${page - 1}`);
    setPage(page - 1);
  };

  return (
    <section className="h-full py-7.5 px-3 md:p-7.5 m-auto">
      <div className="max-w-screen-2xl m-auto">
        <p className="text-xs font-semibold text-black mb-5">
          <span className="text-gray3">{`Find Jobs >`}</span> Candidate’s
          Account Informatiion
        </p>

        <div className="py-5 px-3 lg:p-7.5 rounded-lg bg-gray6">
          <div className="flex justify-between items-center mb-7.5">
            <HeadingPrimary heading="All Added Candidates" />
            <NoOfCandidateShown
              limit={limit}
              onChange={(e) => {
                setLimit(e);
              }}
            />
          </div>

          {/* candidates */}
          <div className="bg-white py-6 px-2 lg:px-5 rounded-lg border border-gray-300">
            {/* headings */}
            <div className="text-gray3 text-xs font-bold grid gap-0 grid-cols-3 md:grid-cols-6 items-center w-full mb-4">
              <p className="col-span-1">Candidate No.</p>
              <p className="justify-self-center md:justify-self-start col-span-1">
                Title
              </p>
              <p className="hidden md:inline-block justify-self-center lg:justify-self-start col-span-1">
                All Skills known
              </p>
              <p className="justify-self-center lg:justify-self-start">
                OverAll Rating
              </p>
              <p className="hidden md:inline-block justify-self-center xl:justify-self-start">
                Notice Period
              </p>
              <p className="hidden md:inline-block">Available From</p>
            </div>

            <div className="w-full border border-blue-400" />

            {/* candidates container */}
            <div className="font-medium text-sm text-black">
              {!isLoading ? (
                candidatesListData.candidates.length > 0 ? (
                  candidatesListData.candidates.map(
                    (
                      item: {
                        employeeNumber: string;
                        title: string;
                        skills: [];
                        id: string;
                        experience: string;
                        description: string;
                        properties: { name: string; value: string }[];
                      },
                      i
                    ) => {
                      const skillData: any = [];
                      item.skills.map((item: { name: string }) => {
                        skillData.push(item.name);
                      });
                      const noticePeriod = item.properties
                        .filter(
                          (item) => item.name === "Notice Period" && item.value
                        )
                        .pop();

                      return (
                        <CandidateCard
                          candidate={item}
                          key={i}
                          className={
                            candidatesListData &&
                            candidatesListData.candidates.length === i + 1
                              ? ""
                              : "my-2 mb-3 lg:m-0"
                          }
                          availableFrom="02/07/2022"
                          noticePeriod={`${
                            noticePeriod ? noticePeriod.value : "-"
                          }`}
                          rating="Medium Good"
                        />
                      );
                    }
                  )
                ) : (
                  <p className="text-sm text-center font-semibold mt-8">
                    No Candidates Found!
                  </p>
                )
              ) : (
                <LoadingSpinner spinnerClassName="h-10 w-10 m-auto mt-14" />
              )}

              {!isLoading && totalPages > 1 && (
                <Pagination
                  onClickNext={goNextPageHandler}
                  onClickPrev={goPrevPageHandler}
                  currentPage={page}
                  totalPages={totalPages}
                  className="mt-10 ml-auto w-64 justify-between"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCandidates;

export const getServerSideProps = async (context: any) => {
  const { token } = context.req.cookies;
  let header;

  if (token) {
    header = {
      "Access-Control-Allow-Origin": "*",
      Authorization: token ? "Bearer " + token : "",
    };
  } else {
    header = {
      "Access-Control-Allow-Origin": "*",
    };
  }

  const res = await fetch(URLS.GET_ALL_CANDIDATES_CLIENT, {
    method: "GET",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });

  if (res.status !== 200) {
    return {
      props: {
        candidatesData: {
          candidates: [],
          count: 0,
        },
      },
    };
  }

  const data = await res.json();

  console.log("data", data);

  const updatedData =
    data &&
    data.candidates &&
    data.candidates.filter(
      (item: { status: string }) => item.status === "ENABLED"
    );

  if (res.status !== 200) {
    return {
      props: { candidatesData: { candidates: [], count: 0 } },
    };
  } else {
    return {
      props: {
        candidatesData: {
          candidates: updatedData,
          count: data.count,
        },
      },
    };
  }
};
