import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { URLS } from "../../api/config";
import Delete from "../../components/icons/Delete";
import HeadingPrimary from "../../components/partials/HeadingPrimary";

import { ApplyAsDeveloperFormType } from "../../store/types/types";
import NextLink from "next/link";
import { User } from "../../api/apiServices";
import LoadingSpinner from "../../components/partials/Loading/LoadingSpinner";
import toast, { Toaster } from "react-hot-toast";
import Pagination from "../../components/partials/Pagination";
import LoadingComponent from "../../components/partials/Loading/LoadingComponent";
import { useAppContext } from "../../store/context/AppContext";
import RoundedButton from "../../components/partials/RoundedButton";

const ReqContainer: React.FC<{
  candidate: ApplyAsDeveloperFormType;
  className?: string;
  onDelete: () => void;
  onCheckedChange: () => void;
  loading: boolean;
  checked: boolean;
  shouldDelete: boolean;
}> = ({
  candidate,
  className,
  onDelete,
  loading,
  onCheckedChange,
  checked,
  shouldDelete,
}) => {
  const skills: string[] = [];
  candidate.skills.map((item: { skillName: string }) => {
    skills.push(item.skillName);
  });

  console.log("shouldDelete", shouldDelete);

  return (
    <div
      className={`p-5 rounded-lg border border-gray-300 flex items-center gap-5 bg-white ${className}`}
    >
      <input
        type="checkbox"
        className="w-5 h-5 min-w-[20px] min-h-[20px]"
        onChange={onCheckedChange}
        checked={checked}
      />
      <NextLink href={`/admin/candidateInfo?id=${candidate.id}`}>
        <p className="text-sm leading-6 text-gray1 w-full cursor-pointer hover:text-secondary-main transition100">
          {candidate.title} has applied.{" "}
          <b>
            Overall Exp - {candidate.overallExperience} years, Notice Period -{" "}
            {candidate.noticePeriod}, Skills :-{" "}
            {skills.map((item, i) => {
              const name = item.length > 15 ? `${item.slice(0, 15)}..` : item;
              return i + 1 === skills.length ? name : `${name}, `;
            })}
            {/* {skills.map(
              (item, i) =>
                item.length > 15 &&
                `${item.slice(0, 15)}...${skills.length === i + 1 ? "" : ", "}`
            )} */}
          </b>
        </p>
      </NextLink>
      {shouldDelete && (
        <span className="cursor-pointer" onClick={onDelete}>
          {!loading ? (
            <Delete />
          ) : (
            <LoadingSpinner spinnerClassName="h-4 w-4" />
          )}
        </span>
      )}
    </div>
  );
};

const AppliedCandidates: React.FC<{
  candidateDataInfo: {
    appliedCandidates: ApplyAsDeveloperFormType[];
    count: number;
  };
}> = ({ candidateDataInfo }) => {
  // console.log("candidateDataInfo", candidateDataInfo);
  const router = useRouter();
  const curPage = router.query.page;
  const queryStatus = router.query.status as "draft" | "approved" | "rejected";

  console.log("queryStatus", queryStatus);

  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);

  const [candidateDataList, setCandidateDataList] = useState({
    ...candidateDataInfo,
  });
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(curPage ? +curPage : 1);
  const totalPages = Math.ceil(candidateDataInfo.count / limit);
  const [deleteLoading, setDeleteLoading] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAppliedCandidateCount, appliedCandidateCount } = useAppContext();
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"draft" | "approved" | "rejected">(
    queryStatus ? queryStatus : "draft"
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const resp: any = await User.getAppliedCandidates(
          limit,
          page,
          activeTab
        );
        if (resp.status !== 200) {
          throw new Error(resp);
        }
        console.log("resp", resp);
        setCandidateDataList(resp.data);
        setIsLoading(false);

        if (
          activeTab === "draft" &&
          resp.data.appliedCandidates.length !== appliedCandidateCount
        ) {
          setAppliedCandidateCount(resp.data.appliedCandidates.length);
        }
      } catch (err: any) {
        notifyError(err.message);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [page, limit, activeTab]);

  const handleDeleteCandidate = async (id: string) => {
    console.log("activeTab", activeTab);
    let x = { ...candidateDataList };
    setDeleteLoading(id);
    try {
      let resp;
      if (activeTab === "rejected") {
        console.log("deleting candidate");
        resp = await User.deleteAppliedCandidate(id);
      } else {
        resp = await User.changeAppliedCandidateStatus("REJECTED", id);
      }
      if (resp.status !== 200) {
        throw new Error(resp);
      }
      console.log("delete candidate resp", resp);

      x.appliedCandidates = x.appliedCandidates.filter(
        (item) => item.id !== id
      );
      x.count = x.count - 1;

      setCandidateDataList(x);
      setDeleteLoading("");
      notifySuccess(
        activeTab === "rejected"
          ? "candidate delete successfully"
          : "candidate successfully rejected"
      );
      setAppliedCandidateCount((prev) => prev - 1);
    } catch (err: any) {
      console.log("err", err);
      setDeleteLoading("");
      notifyError(err.message);
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

  const selectCandidateHandler = (id: string) => {
    if (selectedCandidates.includes(id)) {
      // remove id
      const updatedIds = selectedCandidates.filter((item) => item !== id);
      setSelectedCandidates(updatedIds);
    } else {
      // add id
      setSelectedCandidates((prev) => (prev.length > 0 ? [...prev, id] : [id]));
    }
  };

  const deleteSelectedCandidatesHandler = async () => {
    try {
      let resp;
      if (activeTab === "rejected") {
        resp = await User.deleteMultipleAppliedCandidate({
          ids: selectedCandidates,
        });
      } else {
        resp = await User.rejectMultipleCandidates({
          ids: selectedCandidates,
        });
      }

      if (resp.status !== 200) {
        throw new Error(resp);
      }

      const selectedCandidateCount = selectedCandidates.length;
      console.log("selectedCandidatesCount", selectedCandidateCount);

      setAppliedCandidateCount(appliedCandidateCount - selectedCandidateCount);

      let x = { ...candidateDataList };
      const updatedData = x.appliedCandidates.filter(
        (item) => !selectedCandidates.includes(`${item.id}`)
      );
      console.log("updatedData", updatedData);

      x.appliedCandidates = updatedData;
      setCandidateDataList(x);
      setSelectedCandidates([]);

      notifySuccess(
        activeTab === "rejected"
          ? "candidates deleted successfully"
          : "candidate successfully rejected"
      );
    } catch (err: any) {
      console.log("err", err);
      notifyError(err);
    }
  };

  const tabBtns: ["draft", "approved", "rejected"] = [
    "draft",
    "approved",
    "rejected",
  ];

  return (
    <section className="h-full p-7.5">
      <div className="w-full max-w-[2000px] m-auto">
        <p className="text-xs font-semibold text-black mb-5">Applications</p>
        <HeadingPrimary heading="Applied candidates" className="mb-5" />

        <div className="bg-gray6 rounded py-5 px-7.5 min-h-[300px]">
          {!isLoading ? (
            <>
              <div className="flex items-center justify-between mb-5">
                <div className="bg-gray5 flex rounded-full items-center">
                  {tabBtns.map((item, i) => (
                    <RoundedButton
                      key={item}
                      active={item === activeTab}
                      className="w-37.5"
                      onClick={() => {
                        setActiveTab(item);
                        router.push(`/admin/appliedCandidates?status=${item}`);
                      }}
                    >
                      {item}
                    </RoundedButton>
                  ))}
                </div>
                <div className="bg-primaryBlue pl-4 h-10 pr-1.5 flex items-center justify-between ml-auto rounded">
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
                    <option>5</option>
                    <option>10</option>
                    <option>15</option>
                    <option>20</option>
                    <option>25</option>
                  </select>
                </div>
              </div>

              {/* list container */}
              <div>
                {candidateDataList.appliedCandidates.length > 0 ? (
                  candidateDataList.appliedCandidates.map((item, i) => {
                    return (
                      <ReqContainer
                        loading={deleteLoading === item.id}
                        onDelete={() => handleDeleteCandidate(`${item.id}`)}
                        checked={selectedCandidates.includes(`${item.id}`)}
                        onCheckedChange={() => {
                          selectCandidateHandler(`${item.id}`);
                        }}
                        className={
                          candidateDataList.appliedCandidates.length === i + 1
                            ? ""
                            : "mb-3"
                        }
                        key={item.id}
                        candidate={item}
                        shouldDelete={activeTab === "draft"}
                      />
                    );
                  })
                ) : (
                  <p className="font-semibold text-center mt-10 bg-white p-3 rounded text-sm">
                    No Applied Candidates Found
                  </p>
                )}
              </div>

              <div className="flex items-center mt-10 justify-between">
                {selectedCandidates.length > 0 && (
                  <span
                    className="cursor-pointer flex justify-center items-center ml-5"
                    onClick={deleteSelectedCandidatesHandler}
                  >
                    <Delete width="24" height="34" />
                  </span>
                )}

                {totalPages > 1 && (
                  <Pagination
                    onClickNext={goNextPageHandler}
                    onClickPrev={goPrevPageHandler}
                    currentPage={page}
                    totalPages={totalPages}
                    className="w-64 justify-between ml-auto"
                  />
                )}
              </div>
            </>
          ) : (
            <LoadingComponent
              message="Fetching..."
              loadingSpinnerClassName="h-10 w-10"
            />
          )}
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default AppliedCandidates;

export const getServerSideProps = async (context: any) => {
  const { token } = context.req.cookies;
  const status = context.query.status;

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

  const res = await fetch(
    `${URLS.GET_ALL_APPLIED_CANDIDATES}?limit=5&status=${
      status ? status : "draft"
    }`,
    {
      method: "GET",
      headers: header,
    }
  );

  if (res.status !== 200) {
    return {
      props: {
        candidateDataInfo: {
          appliedCandidates: [],
          count: 0,
        },
      },
    };
  }

  const data = await res.json();

  return {
    props: {
      candidateDataInfo: data,
    },
  };
};
