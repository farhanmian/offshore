import React, { useEffect, useState } from "react";
import Card from "../components/partials/Card";
import HeadingPrimary from "../components/partials/HeadingPrimary";
import afsImg from "../assets/img/afs.png";
import backendImg from "../assets/img/back-end.png";
import frontEndImg from "../assets/img/front-end.png";
import endToEndImt from "../assets/img/end-to-end.png";
import javaImg from "../assets/img/java.png";
import Image from "next/image";
import ButtonSecondary from "../components/partials/ButtonSecondary";
import ButtonPrimary from "../components/partials/ButtonPrimary";
import { useRouter } from "next/router";
import { setCookies, getCookie } from "cookies-next";
import { URLS } from "../api/config";
import {
  CandidateDataType,
  CandidateSkillDataType,
} from "../store/types/types";
import { useAppContext } from "../store/context/AppContext";

const accountInfoUlData = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmodr incididunt.",
  "Damet, consectetur adipiscing elit, sedut labore et dolore magn. Susmodr incididunt ut.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ut labore et dolore magn. Susmodr incididunt ut.",
  "Dlor sit amet, consectetur adipiscing elit, sed do eiusmodr incididunt.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ut labore et dolore magn. SscSasdsac ascsc Xzx usmodr incididunt ut.",
];

const mainSkillsData = [
  {
    name: "AFS",
    img: afsImg,
  },
  {
    name: "Back End",
    img: backendImg,
  },
  {
    name: "Front End",
    img: frontEndImg,
  },
  {
    name: "End to End",
    img: endToEndImt,
  },
  {
    name: "Java",
    img: javaImg,
  },
];

const knownSkillData = [
  {
    name: "Back End",
    experience: "3.5",
    mainSkill: true,
  },
  {
    name: "Front End",
    experience: "4.5",
    mainSkill: true,
  },
  {
    name: "Full Stack",
    experience: "3.5",
    mainSkill: true,
  },
  {
    name: "AWS",
    experience: "2.5",
    mainSkill: true,
  },
  {
    name: "Content Writing",
    experience: "3.5",
    mainSkill: true,
  },
  {
    name: "End to End Development",
    experience: "0.5",
    mainSkill: false,
  },
  {
    name: "Development",
    experience: "3.5",
    mainSkill: false,
  },
  {
    name: "Back End",
    experience: "1.5",
    mainSkill: false,
  },
  {
    name: "Skills",
    experience: "3.5",
    mainSkill: false,
  },
];

const candidateData = [
  {
    availability: "4 weeks",
    availableFrom: "4 years",
    noticeperiod: "English (Fluent)",
    overallExperience: "English (Fluent)",
  },
  {
    englist: "A2",
    german: "B2",
    french: "A3",
    Viatnamese: "D1",
  },
  {
    availability: "4 weeks",
    availableFrom: "4 years",
    noticeperiod: "English (Fluent)",
    overallExperience: "English (Fluent)",
  },
];

const SkillCard: React.FC<{
  title: string;
  experience: string;
  mainSkill: string;
}> = ({ title, experience, mainSkill }) => {
  return (
    <Card
      className="h-14 relative grid grid-cols-5 items-center px-3 sm:px-5 text-sm font-bold text-dark"
      shadow="shadow-none"
    >
      <p className="font-semibold col-span-3">{title}</p>
      <p className="justify-self-center">{experience}</p>
      <p className="text-gray-600 col-end-6 text-right justify-self-end">
        {mainSkill}
      </p>
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] w-[97%] bg-gray-300" />
    </Card>
  );
};

const AccountInfo: React.FC<{
  candidateDataInfo: CandidateDataType;
}> = ({ candidateDataInfo }) => {
  const router = useRouter();
  const candidateId = router.query.id;
  const [candidatesHiringList, setCandidatesHiringList] = useState<string[]>(
    []
  );
  const propertyColumns =
    candidateDataInfo && Math.ceil(candidateDataInfo.properties.length / 4);
  const { setHiringListCount } = useAppContext();

  useEffect(() => {
    const hiringList: any = getCookie("hiringList");
    if (!hiringList) return;
    const data: [] = JSON.parse(hiringList);
    setCandidatesHiringList(data);
  }, []);

  // updating hiringList count
  useEffect(() => {
    const hiringList = getCookie("hiringList");
    const hiringCount = hiringList ? JSON.parse(`${hiringList}`) : [];
    setHiringListCount(hiringCount.length);
  }, [candidatesHiringList, setHiringListCount]);

  const addToHiringListHandler = () => {
    if (candidatesHiringList.length > 0) {
      if (candidatesHiringList.includes(`${candidateId}`)) {
        const updatedData = candidatesHiringList.filter(
          (item) => item !== candidateId
        );
        console.log("remove form list", updatedData);

        setCookies("hiringList", [updatedData]);
        setCandidatesHiringList(updatedData);
        return;
      }

      setCookies("hiringList", [...candidatesHiringList, candidateId]);
      setCandidatesHiringList((prev) => [...prev, `${candidateId}`]);
    } else {
      console.log("creting new list");

      setCookies("hiringList", [candidateId]);
      setCandidatesHiringList([`${candidateId}`]);
    }
  };

  console.log("candidateDataInfo", candidateDataInfo);

  let propertyColumnData: any = {};

  for (let i = 0; i < propertyColumns; i++) {
    const a = i + 1;
    let data: any = [];
    candidateDataInfo.properties.slice((a - 1) * 4, a * 4).map((item) => {
      data.push(item);
    });
    propertyColumnData[i] = data;
  }

  const mainSkillData = candidateDataInfo.skills.filter(
    (item: { type: string }) => item.type === "MAIN"
  );
  console.log("mainSkillData", mainSkillData);

  return (
    candidateDataInfo && (
      <section className="h-full max-w-screen-2xl p-3 py-7.5 sm:p-7.5 m-auto">
        <div>
          <p className="text-xs font-semibold text-black mb-5">
            <span className="text-gray3">{`Find Jobs >`}</span> Candidate’s
            Account Informatiion
          </p>

          <div className="p-3 lg:p-7.5 rounded-lg bg-gray6">
            {/* heading and rating container */}
            <div className="w-full mb-7.5 flex items-center sm:justify-between flex-col sm:flex-row">
              <HeadingPrimary
                heading={`${candidateDataInfo.employeeNumber} : ${candidateDataInfo.title}`}
                className="mb-2 sm:mb-0"
              />
              <Card className="bg-white flex md:w-[300px] h-10 px-4 py-2.5 rounded font-semibold">
                <p className="text-gray3 mr-2 md:mr-4">Rating</p>
                <span className="h-5 w-[1px] border-l border-gray4" />
                <p className="text-black w-full text-center">Medium Best</p>
              </Card>
            </div>

            <div className="font-semibold w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-around justify-items-center gap-y-4 gap-x-7 bg-white py-[26px] px-4 xl:px-7 rounded-lg border border-gray3 mb-7.5 text-sm">
              {
                //property column
                Object.keys(propertyColumnData).map((key) => {
                  return (
                    <div key={key} className="flex flex-col gap-y-4 w-full">
                      {propertyColumnData[key].map(
                        (item: { name: string; value: string; id: string }) => {
                          return (
                            <span
                              key={item.id}
                              className="w-full grid gap-5 text-center sm:text-left grid-cols-2 items-center"
                            >
                              <p className="text-gray3 capitalize">
                                {item.name}
                              </p>
                              <p className="text-black">{item.value}</p>
                            </span>
                          );
                        }
                      )}
                    </div>
                  );
                })
              }

              {/* {candidateData.map((item, i) => {
                return (
                  <div
                    key={i}
                    className={`flex min-w-max w-[80%] sm:w-[100%] flex-col gap-4 ${
                      candidateData.length === i + 1
                        ? ""
                        : "lg:border-r border-gray3"
                    } `}
                  >
                    {Object.keys(item).map((key, a) => {
                      const data: any = item;
                      return (
                        <span
                          key={a}
                          className="w-full grid gap-5 text-center sm:text-left grid-cols-2 items-center"
                        >
                          <p className="text-gray3 capitalize">{key}</p>
                          <p className="text-black">{data[key]}</p>
                        </span>
                      );
                    })}
                    <span
                      className={`lg:hidden w-full sm:w-[80%] ${
                        candidateData.length === i + 1
                          ? ""
                          : "border-b mt-3 mb-3"
                      } inline-block border-gray-400`}
                    />
                  </div>
                );
              })} */}
            </div>

            {/* text */}
            <div className="text-dark text-sm font-normal mb-7.5">
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmodr incididunt ut labore et dolore magn Lorem ipsum do sit
                amet, coctetur adipiscing elit, sed do eiusmodr incididunt ut
                labore et dolore magn. Susmodr incididunt ut labore et dolore
                magn Lorem ipsum dolor sit amet, coctetur adipiscing elit, sed
                do eiusmodr incididunt ut labore et dolore magn.
              </p>
              <ul className="pl-3">
                {accountInfoUlData.map((item, i) => (
                  <li className="list-disc" key={i}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* main skill */}
            <div className="mb-7.5">
              <p className="text-sm font-bold text-black mb-[14px]">
                Main Skills
              </p>
              <div className="bg-white rounded-lg border border-gray-300 p-5 grid ms:grid-cols-2 grid-cols-3 md:grid-cols-5 gap-2 lg:gap-5">
                {mainSkillData.length > 0 ? (
                  mainSkillData.map((item: any, i) => {
                    return (
                      <div
                        key={i}
                        className="bg-secondary-main p-5 relative max-w-[260px] flex text-white h-32 lg:h-40 rounded-lg justify-between"
                      >
                        <h6 className="text-base font-bold">{item.name}</h6>
                        <div className="ms:w-8 lg:w-14 self-end absolute right-2 bottom-1 lg:bottom-2">
                          <Image
                            src={afsImg}
                            alt={item.name}
                            objectFit="contain"
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm font-semibold text-center col-span-full my-5">
                    No Main Skill Found!
                  </p>
                )}
              </div>
            </div>

            {/* all known skills */}
            <div className="mb-7.5">
              <p className="text-sm font-bold mb-[14px] text-black">
                All known Skills
              </p>

              <div className="rounded-lg border bg-white border-gray-300">
                {/* skill heading */}
                <div
                  className="text-white text-sm rounded-lg font-semibold px-5 h-10 items-center grid grid-cols-5 shadow-md"
                  style={{
                    backgroundImage:
                      "linear-gradient(-45deg, #16B3EF -24.88%, #050C3D 132.3%)",
                  }}
                >
                  <p className="col-span-3">Skills</p>
                  <p className="justify-self-center min-w-max">
                    No. of Years of Experience
                  </p>
                </div>
                <div>
                  {candidateDataInfo.skills &&
                    candidateDataInfo.skills.map((item: any, i) => {
                      return (
                        <SkillCard
                          key={i}
                          experience={item.experience}
                          title={item.name}
                          mainSkill={item.type}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
            {/* additional info */}
            <div className="mb-7.5">
              <p className="text-sm font-bold text-black mb-[14px]">
                Additional information
              </p>
              <ul className="rounded-lg p-5 pl-10 border border-gray-300 bg-white">
                <li className="list-disc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmodr incididunt.
                </li>
                <li className="list-disc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmodr incididunt consectetur adipiscing elit.
                </li>
                <li className="list-disc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmodr incididunt consectetur adipiscing elit, sed do
                  eiusmodr incididunt.
                </li>
              </ul>
            </div>

            {/* contract requirements */}
            <div className="mb-7.5">
              <p className="text-sm font-bold text-black mb-[14px]">
                Contract requirements
              </p>
              <ul className="rounded-lg p-5 pl-10 border border-gray-300 bg-white">
                <li className="list-disc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmodr incididunt.
                </li>
                <li className="list-disc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmodr incididunt consectetur adipiscing elit.
                </li>
                <li className="list-disc">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmodr incididunt consectetur adipiscing elit, sed do
                  eiusmodr incididunt.
                </li>
              </ul>
            </div>

            {/* btn container */}
            <div className="flex ml-auto w-max">
              <ButtonSecondary
                className="h-10 px-[26px] mr-5"
                onClick={addToHiringListHandler}
              >
                {candidatesHiringList.includes(`${candidateId}`)
                  ? "Remove from Hiring List"
                  : "Add to Hiring List"}
              </ButtonSecondary>
              {candidatesHiringList.includes(`${candidateId}`) && (
                <ButtonPrimary
                  className="h-10 px-12"
                  onClick={() => {
                    router.push("/enquiry");
                  }}
                >
                  Go to Hiring List
                </ButtonPrimary>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default AccountInfo;

export const getServerSideProps = async (context: any) => {
  const { token } = context.req.cookies;
  const id = context.query.id;
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

  const res = await fetch(`${URLS.GET_CANDIDATE_CLIENT}/${id}`, {
    method: "GET",
    headers: header,
  });

  console.log("res", res);

  if (res.status !== 200) {
    return {
      props: {
        candidateDataInfo: null,
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
