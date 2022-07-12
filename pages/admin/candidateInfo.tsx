import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { User } from "../../api/apiServices";
import { URLS } from "../../api/config";
import Close from "../../components/icons/Close";
import Delete from "../../components/icons/Delete";
import Edit from "../../components/icons/Edit";
import ButtonPrimary from "../../components/partials/ButtonPrimary";
import ButtonSecondary from "../../components/partials/ButtonSecondary";
import Card from "../../components/partials/Card";
import FewMoreQuestionsForm from "../../components/partials/FewMoreQuestionsForm";
import HeadingPrimary from "../../components/partials/HeadingPrimary";
import IncludesText from "../../components/partials/IncludesText";
import Input from "../../components/partials/Input";
import TextArea from "../../components/partials/TextArea";
import useAuthState from "../../hooks/useAuthState";
import { useAppContext } from "../../store/context/AppContext";
import { ApplyAsDeveloperFormType } from "../../store/types/types";

const LanguageItemContainer: React.FC<{
  language: string;
  onRemove: () => void;
}> = ({ language, onRemove }) => {
  return (
    <div className="bg-primaryBlue px-4 h-10 flex justify-between items-center text-white rounded">
      <p className="text-sm capitalize">{language}</p>
      <span className="cursor-pointer" onClick={onRemove}>
        <Close />
      </span>
    </div>
  );
};

const SkillCard: React.FC<{
  skillName: string;
  experience: string;
  onDelete: () => void;
  type: string;
  onAddSkill: () => void;
  doesInclude: boolean;
  changeTypeHandler: () => void;
}> = ({
  skillName,
  experience,
  onDelete,
  type,
  onAddSkill,
  doesInclude,
  changeTypeHandler,
}) => {
  return (
    <div
      className={`grid grid-cols-4 h-20 items-center justify-between text-black font-medium py-6 px-5 ${
        type.includes("ADDITIONAL") ? "bg-gray6 border-b-2 border-gray-400" : ""
      }`}
    >
      <p>{skillName}</p>
      <p className="justify-self-center">{experience} Years</p>

      <div className="flex items-center justify-center justify-self-center">
        <input
          type="checkbox"
          name="mainSkill"
          className="mr-8 w-5 h-5"
          defaultChecked={type === "MAIN"}
          onClick={changeTypeHandler}
        />
        <span className="mr-[18px] icon" onClick={onDelete}>
          <Delete />
        </span>
      </div>

      {!doesInclude && (
        <a
          onClick={onAddSkill}
          className="text-sm font-bold text-secondary-main justify-self-end"
        >
          + Add Skill
        </a>
      )}
      {doesInclude && <IncludesText />}
    </div>
  );
};

const CandidateInfo: React.FC<{
  candidateDataInfo: ApplyAsDeveloperFormType;
}> = ({ candidateDataInfo }) => {
  console.log("candidateDataInfo", candidateDataInfo);
  const router = useRouter();
  const { applyForm, setApplyForm, handleApplyForm } = useAuthState();
  const { appliedCandidateData, setAppliedCandidateData } = useAppContext();

  useEffect(() => {
    if (!candidateDataInfo) return;

    let x = { ...applyForm };

    Object.keys(x).map((key) => {
      if (
        key !== "title" &&
        key !== "aboutInfo" &&
        key !== "additionalInfo" &&
        key !== "overallExperience" &&
        key !== "noticePeriod" &&
        key !== "fullTimeJob" &&
        key !== "partTimeJob" &&
        key !== "havePc" &&
        key !== "okWithWorking8To1" &&
        key !== "skills" &&
        key !== "languages"
      )
        return;
      if (key !== "skills" && key !== "languages") {
        // common
        x[key].value = candidateDataInfo[key];
      } else {
        // uncommon
        x.skills = candidateDataInfo.skills;
        x.languages = candidateDataInfo.languages;
      }
    });

    setApplyForm(x);
  }, [candidateDataInfo]);

  const updateCandidateForm = (name: string, key?: string) => {
    console.log("name", name);
    key && console.log("key", key);

    let x = { ...appliedCandidateData };

    if (name === "aboutInfo" || name === "additionalInfo") {
      x[name] = applyForm[name].value;
    } else if (name === "skills") {
      const skill: any = applyForm.skills
        .filter((item) => item.skillName === key)
        .pop();
      console.log("skill", skill);
      if (x.skills[0].skillName.trim().length === 0) {
        /// skills array is empty
        x.skills = [skill];
      } else {
        x.skills.push(skill);
      }
    } else if (name === "languages") {
      const languageData: { name: string; value: string }[] = [];
      applyForm.languages.map((item) => {
        languageData.push({ name: item.language, value: item.rating });
      });

      if (languageData[0].name.trim().length === 0) {
        alert("languageData is empty");
        console.log("languageData is empty");
        return;
      }
      if (
        x.properties.length === 0 ||
        x.properties[0].name.trim().length === 0
      ) {
        x.properties = languageData;
      } else {
        const updatedData = [...languageData, ...x.properties];
        x.properties = updatedData;
      }
    } else if (name === "overallExperience" || name === "noticePeriod") {
      const data = {
        name: name,
        value: `${applyForm[name].value} ${
          name === "noticePeriod" ? "days" : "years"
        }`,
      };

      if (data.name.trim().length === 0) return;

      if (x.properties[0].name.trim().length === 0) {
        /// candidateForm properties are empty
        x.properties = [data];
      } else {
        const updatedProperties = [data, ...x.properties];
        x.properties = updatedProperties;
      }
    } else if (name === "fewMoreQuestions") {
      x.fullTimeJob = applyForm.fullTimeJob.value;
      x.partTimeJob = applyForm.partTimeJob.value;
      x.havePc = applyForm.havePc.value;
      x.okWithWorking8To1 = applyForm.okWithWorking8To1.value;
    } else if (name === "title") {
      x.title = applyForm.title.value;
    }
    x.id = `${candidateDataInfo.id}`;

    console.log("x---------", x);
    setAppliedCandidateData(x);
  };

  let includeExtraQuestionCondition;
  Object.keys(appliedCandidateData).map((key) => {
    if (
      key === "fullTimeJob" ||
      key === "partTimeJob" ||
      key === "havePc" ||
      key === "okWithWorking8To1"
    ) {
      includeExtraQuestionCondition =
        appliedCandidateData[key] === applyForm[key].value;
    }
  });

  console.log("includeExtraQuestionCondition", includeExtraQuestionCondition);

  const deleteSkillHandler = async (id?: string) => {
    if (!id) return;
    let x = { ...applyForm };

    x.skills = x.skills.filter((item: any) => item.id !== id);

    setApplyForm(x);
  };

  const changeTypeHandlerFn = (id?: string) => {
    if (!id) return;

    let x = { ...applyForm };
    const updatedSkills: any[] = [];
    x.skills.map((item: any) => {
      if (item.id === id) {
        // change the type and push
        const data = { ...item, type: item.type === "MAIN" ? "OTHER" : "MAIN" };
        console.log("data--", data);
        updatedSkills.push(data);
      } else {
        // just push
        updatedSkills.push(item);
      }
    });

    console.log("updatedSkills", updatedSkills);
    x.skills = updatedSkills;
    setApplyForm(x);
  };

  const mainSkills = applyForm.skills.filter((item) => item.type === "MAIN");

  const appliedCandidateSkillIds: string[] = [];
  appliedCandidateData.skills.map((item: any) => {
    appliedCandidateSkillIds.push(item.id);
  });

  return (
    <section className="h-full p-7.5">
      <div className="w-full text-black">
        <p className="mb-5 text-xs">Transform Candidate Info</p>

        {/* candidate info */}
        <div className="mb-7.5">
          <HeadingPrimary heading="Candidate Information" className="mb-5" />

          {/* candidate title / skill */}
          <div className="p-7.5 bg-gray6 ">
            <p className="text-sm mb-3 font-bold">Candidate title</p>
            <Card
              className="px-5 pl-3 w-full flex items-center justify-between bg-white rounded-lg h-10 mb-7.5"
              shadow="shadow-none"
            >
              {/* <p className="text-sm font-normal">Senior Java developer</p> */}
              <Input
                placeholder="Candidate title"
                value={applyForm.title.value}
                error={applyForm.title.error}
                containerClassName="border-none px-0"
                handleForm={handleApplyForm}
                name="title"
              />
              {appliedCandidateData.title !== applyForm.title.value ? (
                <a
                  onClick={() => {
                    updateCandidateForm("title");
                  }}
                  className="text-secondary-main font-bold text-sm min-w-max"
                >
                  + Add Job Title
                </a>
              ) : (
                <IncludesText />
              )}
            </Card>

            <p className="text-sm mb-3 font-bold">Candidate Skills</p>
            {/* skill container */}
            <div className="bg-white rounded-lg border border-gray-300">
              {/* headings */}
              <div className="text-gray3 py-6 px-5 text-xs font-bold grid grid-cols-4">
                <p>Name of the skill</p>
                <p className="justify-self-center">
                  No. of Years of Experience
                </p>
                <p className="justify-self-center">
                  Main Skill({mainSkills.length})
                </p>
              </div>

              <div className="w-full border border-blue-400" />

              <div className="font-medium text-sm text-black">
                {applyForm.skills.length > 0 &&
                  applyForm.skills[0].skillName.length > 0 &&
                  applyForm.skills.map(
                    (
                      item: {
                        skillName: string;
                        experience: string;
                        type: string;
                        iconUrl: string;
                        id?: string;
                      },
                      i
                    ) => {
                      return (
                        <SkillCard
                          doesInclude={appliedCandidateSkillIds.includes(
                            `${item.id}`
                          )}
                          onAddSkill={() => {
                            updateCandidateForm("skills", item.skillName);
                          }}
                          changeTypeHandler={() => {
                            changeTypeHandlerFn(item.id);
                          }}
                          type={item.type}
                          experience={item.experience}
                          onDelete={() => {
                            deleteSkillHandler(item.id);
                          }}
                          skillName={item.skillName}
                          key={i}
                        />
                      );
                    }
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* about employee */}
        <div className="mb-7.5">
          <HeadingPrimary heading="about employee" className="mb-5" />
          <div className="p-7.5 bg-gray6">
            <div className="mb-7.5">
              <div className="mb-3 w-full flex items-center justify-between">
                <span className="flex items-center">
                  <p className="font-bold mr-3 text-sm">Describe Yourself</p>
                  <span className="cursor-pointer w-4 h-4">
                    <Edit />
                  </span>
                </span>
                {appliedCandidateData.aboutInfo !==
                applyForm.aboutInfo.value ? (
                  <a
                    onClick={() => updateCandidateForm("aboutInfo")}
                    className="text-sm font-bold text-secondary-main justify-self-end"
                  >
                    + Add Description
                  </a>
                ) : (
                  <IncludesText />
                )}
              </div>
              <TextArea
                placeholder="Type here..."
                className="rounded-lg border border-gray-300 w-full p-5 bg-white resize-none"
                value={applyForm.aboutInfo.value}
                error={applyForm.aboutInfo.error}
                name="aboutInfo"
                handleForm={handleApplyForm}
                row={5}
              />
            </div>

            <div>
              <div className="mb-3 w-full flex items-center justify-between">
                <span className="flex items-center">
                  <p className="font-bold mr-3 text-sm">
                    Additional Information
                  </p>
                  <span className="cursor-pointer w-4 h-4">
                    <Edit />
                  </span>
                </span>
                {appliedCandidateData.additionalInfo !==
                applyForm.additionalInfo.value ? (
                  <a
                    onClick={() => updateCandidateForm("additionalInfo")}
                    className="text-sm font-bold text-secondary-main justify-self-end"
                  >
                    + Add Info
                  </a>
                ) : (
                  <IncludesText />
                )}
              </div>
              <TextArea
                placeholder="Type here..."
                className="rounded-lg border border-gray-300 w-full p-5 bg-white resize-none"
                value={applyForm.additionalInfo.value}
                error={applyForm.additionalInfo.error}
                name="additionalInfo"
                handleForm={handleApplyForm}
                row={5}
              />
            </div>
          </div>
        </div>

        {/* basic info */}
        <div className="mb-20">
          <HeadingPrimary heading="basic information" className="mb-5" />
          <div className="p-7.5 bg-gray6">
            <div className="mb-3 w-full flex items-center justify-between">
              <span className="flex items-center">
                <p className="font-bold mr-3 text-sm">Describe Yourself</p>
                <span className="cursor-pointer w-4 h-4">
                  <Edit />
                </span>
              </span>
              {!appliedCandidateData.properties.find((item) => {
                if (item.name.includes(applyForm.languages[0].language))
                  return true;
              }) ? (
                <a
                  onClick={() => updateCandidateForm("languages")}
                  className="text-sm font-bold text-secondary-main justify-self-end"
                >
                  + Add languages into properties
                </a>
              ) : (
                <IncludesText />
              )}
            </div>

            {/* language known container */}
            <div className="py-4 grid grid-cols-4 gap-5 px-5 rounded bg-white mb-15">
              {candidateDataInfo.languages.length > 0 ? (
                candidateDataInfo.languages.map(
                  (item: { language: string; rating: string }, i) => {
                    return (
                      <LanguageItemContainer
                        onRemove={() => {
                          console.log("removeLanguage");
                        }}
                        key={i}
                        language={item.language}
                      />
                    );
                  }
                )
              ) : (
                <p className="text-center mt-5 font-bold text-sm col-span-full">
                  No Language Added!
                </p>
              )}
            </div>

            {/* overall exp */}
            <div className="mb-3 w-full flex items-center justify-between">
              <p className="font-bold mr-3 text-sm">
                Oveall Experience in years
              </p>

              {!appliedCandidateData.properties.find(
                (item) => item.name === "overallExperience"
              ) ? (
                <a
                  onClick={() => updateCandidateForm("overallExperience")}
                  className="text-sm font-bold text-secondary-main justify-self-end"
                >
                  + Add Experience into properties
                </a>
              ) : (
                <IncludesText />
              )}
            </div>
            <Input
              containerClassName="w-full bg-white mb-7.5"
              rounded="rounded-lg"
              value={applyForm.overallExperience.value}
              error={applyForm.overallExperience.error}
              name="overallExperience"
              handleForm={handleApplyForm}
              icon={
                <span>
                  <Edit />
                </span>
              }
              placeholder="Enter"
              shadow={false}
            />

            {/* notice period */}
            <div className="mb-3 w-full flex items-center justify-between">
              <p className="font-bold mr-3 text-sm">
                Notice Period / When Available
              </p>

              {!appliedCandidateData.properties.find(
                (item) => item.name === "noticePeriod"
              ) ? (
                <a
                  onClick={() => updateCandidateForm("noticePeriod")}
                  className="text-sm font-bold text-secondary-main justify-self-end"
                >
                  + Add Notice Period into properties
                </a>
              ) : (
                <IncludesText />
              )}
            </div>
            <Input
              containerClassName="w-full bg-white mb-7.5"
              rounded="rounded-lg"
              value={applyForm.noticePeriod.value}
              error={applyForm.noticePeriod.error}
              name="noticePeriod"
              handleForm={handleApplyForm}
              icon={
                <span>
                  <Edit />
                </span>
              }
              placeholder="Enter"
              shadow={false}
            />
          </div>
        </div>

        <FewMoreQuestionsForm
          showAddBtn={true}
          doesInclude={includeExtraQuestionCondition}
          onAddQuestion={() => updateCandidateForm("fewMoreQuestions")}
          quesData={applyForm}
          className="mb-10"
          onChange={(e) => {
            console.log(e);
          }}
        />

        <div className="flex gap-5 justify-end">
          <ButtonSecondary className="px-7 h-10">
            Delete Request
          </ButtonSecondary>
          <ButtonPrimary
            onClick={() => router.push("/admin/createCandidate")}
            className="px-16 h-10"
          >
            Next
          </ButtonPrimary>
        </div>
      </div>
    </section>
  );
};

export default CandidateInfo;

export const getServerSideProps = async (context: any) => {
  const { token } = context.req.cookies;
  const id = context.query.id;

  if (!token) {
    return {
      redirect: {
        destination: "/admin/signIn",
        permanent: false,
      },
    };
  }

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

  const res = await fetch(`${URLS.GET_ALL_APPLIED_CANDIDATES}/${id}`, {
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
