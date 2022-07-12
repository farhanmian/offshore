import { useRouter } from "next/router";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import useAuthState from "../../hooks/useAuthState";
import { CandidateDataType } from "../types/types";

interface AppContextInterface {
  appliedCandidateData: CandidateDataType;
  setAppliedCandidateData: React.Dispatch<
    React.SetStateAction<CandidateDataType>
  >;
  appliedCandidateCount: number;
  setAppliedCandidateCount: React.Dispatch<React.SetStateAction<number>>;
  hiringListCount: number;
  setHiringListCount: React.Dispatch<React.SetStateAction<number>>;
  landingPageSearchFormValue: string;
  setLandingPageSearchFormValue: React.Dispatch<React.SetStateAction<string>>;
}

const defaultAppliedCandidatesState = {
  employeeNumber: "",
  title: "",
  aboutInfo: "",
  additionalInfo: "",
  terms: "",
  skills: [
    {
      skillName: "",
      iconUrl: "",
      experience: "",
      type: "",
    },
  ],

  properties: [
    {
      name: "",
      value: "",
    },
  ],

  /// extra question
  fullTimeJob: "",
  partTimeJob: "",
  havePc: "",
  okWithWorking8To1: "",
  id: "",
  status: "",
};

const MainContext = createContext<AppContextInterface>({
  appliedCandidateData: defaultAppliedCandidatesState,
  setAppliedCandidateData: () => {},
  appliedCandidateCount: 0,
  setAppliedCandidateCount: () => {},
  hiringListCount: 0,
  setHiringListCount: () => {},
  landingPageSearchFormValue: "",
  setLandingPageSearchFormValue: () => {},
});

const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [appliedCandidateData, setAppliedCandidateData] =
    useState<CandidateDataType>(defaultAppliedCandidatesState);
  const [appliedCandidateCount, setAppliedCandidateCount] = useState(0);
  const [hiringListCount, setHiringListCount] = useState(0);
  const [landingPageSearchFormValue, setLandingPageSearchFormValue] =
    useState("");

  const { clearCreateCandidateForm } = useAuthState();

  useEffect(() => {
    if (router.pathname !== "search" || landingPageSearchFormValue !== "") {
      setLandingPageSearchFormValue("");
    }

    if (
      !router.pathname.includes("candidateInfo") &&
      router.pathname !== "/admin/createCandidate"
    ) {
      setAppliedCandidateData(defaultAppliedCandidatesState);
      clearCreateCandidateForm();
    }
  }, [router.pathname]);

  // useEffect(() => {
  //   console.log("router", router.pathname);
  //   if (
  //     router.pathname.includes("candidateInfo") ||
  //     router.pathname === "/admin/createCandidate"
  //   )
  //     return;
  //   alert("clearing");
  //   setAppliedCandidateData(defaultAppliedCandidatesState);
  // }, [router.pathname]);

  const states = {
    appliedCandidateData,
    setAppliedCandidateData,
    appliedCandidateCount,
    setAppliedCandidateCount,
    hiringListCount,
    setHiringListCount,
    landingPageSearchFormValue,
    setLandingPageSearchFormValue,
  };

  return <MainContext.Provider value={states}>{children}</MainContext.Provider>;
};

export default AppWrapper;

export function useAppContext() {
  return useContext(MainContext);
}
