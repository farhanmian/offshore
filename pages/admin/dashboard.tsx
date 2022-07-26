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
import Dropdown from "../../components/partials/Dropdown";

const CandidateCard: React.FC<{
  candidateNo: string;
  title: string;
  skills: any[];
  id: string;
  onChangeActiveStatus: () => void;
  activeStatus: string;
  onDelete: () => void;
  loading: boolean;
  statusLoading: string;
}> = ({
  candidateNo,
  title,
  skills,
  id,
  onChangeActiveStatus,
  activeStatus,
  onDelete,
  loading,
  statusLoading,
}) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-6 h-20 items-center justify-between text-black font-medium">
      <p>
        {candidateNo.trim().length < 15
          ? candidateNo
          : `${candidateNo.slice(0, 14)}...`}
      </p>
      <p>{title}</p>
      <p className="col-span-3">
        {skills.map((item: { name: string }, i) => {
          return skills.length === i + 1 ? `${item.name}` : `${item.name}, `;
        })}
      </p>

      <div className="flex items-center justify-self-end col-end-7">
        {statusLoading !== id ? (
          <OnOffBtn
            className={`mr-[18px] ${
              statusLoading ? "pointer-events-none" : ""
            }`}
            status={activeStatus}
            onChangeActiveStatus={onChangeActiveStatus}
          />
        ) : (
          <div className="w-10 mr-[18px]">
            <LoadingSpinner spinnerClassName="h-4 w-4 m-auto" />
          </div>
        )}
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
  const [activeStatusLoading, setActiveStatusLoading] = useState("");
  const [skillsData, setSkillsData] = useState<
    { name: string; type: string; id: string }[]
  >([]);
  const [searchValue, setSearchValue] = useState("");

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

  // fetching skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await User.getAllSkills();
        if (res.status !== 200) {
          throw new Error(res);
        }

        setSkillsData(res.data);
      } catch (err: { message: string } | any) {
        notifyError(err.message);
      }
    };
    fetchSkills();
  }, []);

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
    if (activeStatusLoading) return;
    setActiveStatusLoading(id);
    try {
      const resp: any = await User.updateCandidateStatus(id);
      console.log("updates candidate status", resp);
      if (resp.status !== 200) return;
      let status = "";

      let x = { ...candidatesListData };
      const data: any = [];

      candidatesListData.candidates.map(
        (item: { id: string; status: string }) => {
          if (item.id === id) {
            /// update status and push item
            const updatedData = { ...item };
            updatedData.status =
              item.status === "ENABLED" ? "DISABLED" : "ENABLED";
            status = updatedData.status;
            data.push(updatedData);
          } else {
            //// push item
            data.push(item);
          }
        }
      );

      x.count = x.count - 1;
      x.candidates = data;

      setCandidatesListData(x);
      notifySuccess(
        status === "ENABLED" ? "Profile Enabled" : "Profile Disabled"
      );

      setActiveStatusLoading("");
      // setTimeout(() => {

      // }, 300);
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
      setActiveStatusLoading("");
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

  const skillChangeHandler = (e: { name: string; id: string }) => {
    const data: any = {
      target: { name: "skill", value: e.name, id: e.id },
    };
    console.log("onChange", data);
    setSearchValue(data.target.value);
    searchHandler(data);
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
              <div className="w-60 mr-5">
                {/* <Dropdown placeholder="Skills" dataList={skillsData} handleForm={} /> */}
                <Dropdown
                  placeholder="Skills"
                  // error={candidatePropertyForm.name.error}
                  linkText="Create Property"
                  disabled={isLoading}
                  link={"/admin/createProperty"}
                  dataList={skillsData && skillsData}
                  onChange={skillChangeHandler}
                  handleForm={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                />
              </div>

              <Input
                placeholder="Search by Candidate No."
                name="candidateNumber"
                icon={<Search />}
                width="w-[228px]"
                containerClassName="bg-white"
                handleForm={searchHandler}
              />

              <NoOfCandidateShown limit={limit} onChange={(e) => setLimit(e)} />
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
                              statusLoading={activeStatusLoading}
                            />
                          )
                        );
                      }
                    )
                  ) : showActiveCandidates ? (
                    <div className="flex items-center mt-5 font-semibold text-sm justify-center gap-1">
                      <p>No Candidates Found!</p>
                      <NextLink href={"/admin/createCandidate"}>
                        <a className="text-secondary-main underline">
                          Add Candidates
                        </a>
                      </NextLink>
                    </div>
                  ) : (
                    <div className="flex items-center mt-5 font-semibold text-sm justify-center gap-1">
                      <p>No Disabled Candidates Found!</p>
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

  if (res.status !== 200) {
    return {
      props: {
        candidatesList: { candidates: [], counts: 0 },
      },
    };
  }
  const data = await res.json();

  return {
    props: {
      candidatesList: data,
    },
  };
};
