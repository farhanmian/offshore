import React, { useEffect, useState } from "react";
import addNewCandidate from "../../assets/img/add-new-candidate.png";
import addNewSkill from "../../assets/img/add-new-skill.png";
import Image from "next/image";
import RoundedButton from "../../components/partials/RoundedButton";
import Input from "../../components/partials/Input";
import ArrowDown from "../../components/icons/ArrowDown";
import Search from "../../components/icons/Search";
import Delete from "../../components/icons/Delete";
import Edit from "../../components/icons/Edit";
import OnOffBtn from "../../components/partials/OnOffBtn";
import { User } from "../../api/apiServices";
import { URLS } from "../../api/config";
import HeadingPrimary from "../../components/partials/HeadingPrimary";
import { useRouter } from "next/router";
import {
  CandidateDataType,
  CandidateSkillDataType,
} from "../../store/types/types";
import NextLink from "next/link";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "../../components/partials/Loading/LoadingSpinner";
import Pagination from "../../components/partials/Pagination";
import NoOfCandidateShown from "../../components/partials/NoOfCandidateShown";

const CandidateCard: React.FC<{
  candidateNo: string;
  title: string;
  skills: any[];
  id: string;
  onChangeActiveStatus: () => void;
  activeStatus: string;
  onDelete: () => void;
  loading: boolean;
}> = ({
  candidateNo,
  title,
  skills,
  id,
  onChangeActiveStatus,
  activeStatus,
  onDelete,
  loading,
}) => {
  const router = useRouter();
  return (
    <div className="grid grid-cols-6 h-20 items-center justify-between text-black font-medium">
      <p>{candidateNo}</p>
      <p>{title}</p>
      <p className="col-span-3">
        {skills.map((item: { name: string }, i) => {
          return skills.length === i + 1 ? `${item.name}` : `${item.name}, `;
        })}
      </p>

      <div className="flex items-center justify-self-end col-end-7">
        <OnOffBtn
          className="mr-[18px]"
          status={activeStatus}
          onChangeActiveStatus={onChangeActiveStatus}
        />
        <span className="mr-[18px] icon" onClick={onDelete}>
          {!loading ? (
            <Delete />
          ) : (
            <LoadingSpinner spinnerClassName="h-4 w-4" />
          )}
        </span>
        <span
          className="icon"
          onClick={() => {
            router.push(`/admin/createCandidate?id=${id}`);
          }}
        >
          <Edit />
        </span>
      </div>
    </div>
  );
};

const Dashboard: React.FC<{
  candidatesList: { candidates: CandidateDataType[]; count: number };
}> = ({ candidatesList }) => {
  const router = useRouter();
  const curPage = router.query.page;

  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);
  const [showActiveCandidates, setShowActiveCandidates] = useState(true);
  const [candidatesListData, setCandidatesListData] = useState({
    ...candidatesList,
  });

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(curPage ? +curPage : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteCandidateLoading, setDeleteCandidateLoading] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  console.log("totalPages", totalPages);

  //// fetching candidates list whenever limit changes
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        let resp: any;
        if (showActiveCandidates) {
          // get enabled candidates
          resp = await User.getEnabledCandidates(limit, page);
        } else {
          // get disabled candidates
          resp = await User.getDisabledCandidates(limit, page);
        }

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
  }, [limit, page, showActiveCandidates]);

  useEffect(() => {
    if (page > 1 && candidatesListData.candidates.length === 0) {
      setPage((prev) => prev - 1);
    }
  }, [page, candidatesListData]);

  const searchHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = { ...candidatesListData };
    if (name === "skill") {
      if (value.trim().length === 0) {
        setCandidatesListData(candidatesList);
        return;
      }
      const updatedData: CandidateDataType[] = [];
      candidatesList.candidates.map((item: CandidateDataType) => {
        let foundData = false;
        item.skills.map((data: any) => {
          if (data.name.toLowerCase().includes(value.toLowerCase())) {
            foundData = true;
          }
        });
        if (foundData) {
          updatedData.push(item);
        }
      });

      data.candidates = updatedData;
    } else if (name === "candidateNumber") {
      if (value.trim().length === 0) {
        setCandidatesListData(candidatesList);
        return;
      }
      data.candidates = candidatesList.candidates.filter((item) =>
        item.employeeNumber.includes(value)
      );
    }
    setCandidatesListData(data);
  };

  const changeActiveStatusHandler = async (id: string) => {
    try {
      const resp: any = await User.updateCandidateStatus(id);
      console.log("updates candidate status", resp);
      if (resp.status !== 200) return;

      let x = { ...candidatesListData };
      const data: any = [];

      candidatesListData.candidates.map(
        (item: { id: string; status: string }) => {
          if (item.id === id) {
            /// update status and push item
            const updatedData = { ...item };
            updatedData.status =
              item.status === "ENABLED" ? "DISABLED" : "ENABLED";
            data.push(updatedData);
          } else {
            //// push item
            data.push(item);
          }
        }
      );

      x.count = x.count - 1;
      x.candidates = data;

      setTimeout(() => {
        setCandidatesListData(x);
        notifySuccess("Skill update Successfully");
      }, 300);
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
    }
  };

  const deleteCandidateHandler = async (id: string) => {
    setDeleteCandidateLoading(id);
    console.log("delete", id);
    try {
      const resp: any = await User.deleteCandidate(id);
      if (resp.status !== 200) {
        throw new Error(resp);
      }

      let x = { ...candidatesListData };
      const updatedList: any = candidatesListData.candidates.filter(
        (item) => item.id !== id
      );
      x.candidates = updatedList;
      setCandidatesListData(x);

      notifySuccess("candidate successfully deleted");
      setDeleteCandidateLoading("");
    } catch (err: any) {
      notifyError(err.message);
      setDeleteCandidateLoading("");
    }
  };

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
    <section className="h-full p-7.5">
      <div className="w-full max-w-[2000px] m-auto">
        <p className="text-xs font-semibold text-black mb-5">Dashboard</p>

        <div className="text-white grid grid-cols-2 gap-[30px] w-full mb-7.5">
          <div className="px-5 py-4 flex items-end justify-between rounded-lg bg-secondary-main">
            {/* image */}
            <div className="w-[77px] h-[77px]">
              <Image src={addNewCandidate} alt="new candidate" />
            </div>

            <NextLink href="/admin/createCandidate">
              <a className="font-bold text-sm">+ Add new Candidates</a>
            </NextLink>
          </div>
          <div className="px-5 py-4 flex items-end justify-between rounded-lg bg-secondary-main">
            {/* image */}
            <div className="w-[77px] h-[77px]">
              <Image src={addNewSkill} alt="new candidate" />
            </div>

            <NextLink href="/admin/createSkill">
              <a className="font-bold text-sm">+ Add a new Skill</a>
            </NextLink>
          </div>
        </div>

        {/* all candidates */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <HeadingPrimary heading="All Candidates" />

            <div className="flex items-center">
              <p className="text-gray-3 mr-3 uppercase text-sm font-semibold">
                Show Only
              </p>

              <div className="bg-gray5 flex rounded-full">
                <RoundedButton
                  active={showActiveCandidates}
                  className="w-37.5"
                  onClick={() => {
                    setShowActiveCandidates(true);
                  }}
                >
                  Enabled
                </RoundedButton>
                <RoundedButton
                  active={!showActiveCandidates}
                  className="w-37.5"
                  onClick={() => {
                    setShowActiveCandidates(false);
                  }}
                >
                  Disabled
                </RoundedButton>
              </div>
            </div>
          </div>

          <div className="bg-gray6 py-5 px-7.5">
            {/* options */}
            <div className="flex mb-5">
              <Input
                placeholder="Skills"
                name="skill"
                width="w-60"
                containerClassName="mr-5 bg-white"
                handleForm={searchHandler}
              />

              <Input
                placeholder="Search by Candidate No."
                name="candidateNumber"
                icon={<Search />}
                width="w-[228px]"
                containerClassName="bg-white"
                handleForm={searchHandler}
              />

              <NoOfCandidateShown limit={limit} onChange={(e) => setLimit(e)} />

              {/* <div className="bg-primaryBlue pl-4 h-10 pr-1.5 flex items-center justify-between ml-auto rounded">
                <p className="text-white text-xs font-medium mr-5">
                  No. of Candidates shown
                </p>

                <select
                  id="noOfCandidate"
                  name="noOfCandidate"
                  className="w-30 h-7 rounded focus:outline-none px-3 font-bold"
                  value={limit}
                  onChange={(e) => {
                    setLimit(+e.target.value);
                  }}
                >
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                  <option>25</option>
                </select>
              </div> */}
            </div>

            {/* candidates */}
            <div className="bg-white py-6 px-5 rounded-lg border border-gray-300">
              {/* headings */}
              <div className="text-gray3 text-xs font-bold grid grid-cols-6 mb-4">
                <p>Candidate No.</p>
                <p>Title</p>
                <p>All Skills known</p>
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
                          skills: any[];
                          status: string;
                          id: string;
                        },
                        i
                      ) => {
                        return (
                          item.status.includes(
                            `${showActiveCandidates ? "ENABLED" : "DISABLED"}`
                          ) && (
                            <CandidateCard
                              loading={deleteCandidateLoading === item.id}
                              onDelete={() => deleteCandidateHandler(item.id)}
                              onChangeActiveStatus={() =>
                                changeActiveStatusHandler(item.id)
                              }
                              activeStatus={item.status}
                              key={i}
                              id={item.id}
                              candidateNo={item.employeeNumber}
                              title={item.title}
                              skills={item.skills}
                            />
                          )
                        );
                      }
                    )
                  ) : (
                    <div className="flex items-center mt-5 font-semibold text-sm justify-center gap-1">
                      <p>No Candidates Found!</p>
                      <NextLink href={"/admin/createCandidate"}>
                        <a className="text-secondary-main underline">
                          Add Candidates
                        </a>
                      </NextLink>
                    </div>
                  )
                ) : (
                  <LoadingSpinner spinnerClassName="h-12 w-12 m-auto mt-20" />
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
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default Dashboard;

export const getServerSideProps = async (context: any) => {
  const { token } = context.req.cookies;
  let header;

  if (!token) {
    return {
      redirect: {
        destination: "/admin/signIn",
        permanent: false,
      },
    };
  }

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

  const res = await fetch(`${URLS.GET_ENABLED_CANDIDATES}?limit=10`, {
    method: "GET",
    headers: header,
  });

  const data = await res.json();

  if (res.status !== 200) {
    return {
      props: {
        candidatesList: { candidates: [], counts: 0 },
      },
    };
  } else {
    return {
      props: {
        candidatesList: data,
      },
    };
  }
};
