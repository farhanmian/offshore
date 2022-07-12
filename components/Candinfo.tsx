import React, { Fragment, useEffect } from "react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import uniqid from "uniqid";
import { Client, User } from "../api/apiServices";
import Skills from "../components/Skills";
import useAuthState from "../hooks/useAuthState";
import Close from "./icons/Close";
import Delete from "./icons/Delete";
import ButtonSecondary from "./partials/ButtonSecondary";
import Dropdown from "./partials/Dropdown";
import FewMoreQuestionsForm from "./partials/FewMoreQuestionsForm";
import HeadingPrimary from "./partials/HeadingPrimary";
import Input from "./partials/Input";
import LoadingSpinner from "./partials/Loading/LoadingSpinner";
import TextArea from "./partials/TextArea";

const CandidateInfoCard: React.FC<{
  skillName: string;
  experience: string | number;
  onDelete: () => void;
  onMarkMain: (e: boolean) => void;
  checked: boolean;
}> = ({ skillName, experience, onDelete, onMarkMain, checked }) => {
  return (
    <div className="grid grid-cols-3 h-20 items-center justify-between">
      <p>{skillName}</p>
      <p className="justify-self-center">{experience} Years</p>
      <div className="flex w-full justify-end -ml-3">
        <input
          type="checkbox"
          className="mr-12 w-5 h-5 cursor-pointer"
          checked={checked}
          onChange={(e) => {
            onMarkMain(e.target.checked);
          }}
        />
        <span className="icon" onClick={onDelete}>
          <Delete />
        </span>
      </div>
    </div>
  );
};

const LanguageItemContainer: React.FC<{
  language: string;
  rating: string;
  onRemove: () => void;
}> = ({ language, onRemove, rating }) => {
  return (
    <div className="bg-primaryBlue px-4 h-10 flex justify-between items-center text-white rounded">
      <div className="flex justify-between items-center gap-3">
        <p className="text-sm capitalize">
          {language} : {rating}
        </p>
      </div>
      <span className="cursor-pointer" onClick={onRemove}>
        <Close />
      </span>
    </div>
  );
};

const Candinfo = () => {
  const {
    applyForm,
    handleApplyForm,
    candidateSkillForm,
    handleCandidateSkillForm,
    extractCandidateSkillForm,
    setApplyForm,
    extractlanguageAndRatingForm,
    handlelanguageAndRatingForm,
    languageAndRatingForm,
    postApplyAsDeveloperForm,
    clearCandidateSkillForm,
    clearApplyForm,
    clearLanguageAndRatingForm,
  } = useAuthState();
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);
  const [skillListData, setSkillListData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  // fetching skill and properties data and updating state
  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        const resp: any = await Client.getAllSkillsClient();
        if (resp.status !== 200) {
          setSkillListData([]);
          return;
        }
        const data = (resp.data.filter = resp.data.filter(
          (item: { status: string }) => item.status === "ENABLED"
        ));
        setSkillListData(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSkillData();
  }, []);

  const skillChangeHandler = (
    e: { name: string; id: string },
    type?: string
  ) => {
    const data: any = {
      target: { name: "skillName", value: e.name, id: e.id },
    };
    const typeData: any = {
      target: { name: "type", value: type, id: e.id },
    };
    //// update local skill form
    handleCandidateSkillForm(data);
    handleCandidateSkillForm(typeData);
  };
  const addSkillHandler = (e: React.FormEvent) => {
    let x = { ...applyForm };
    e.preventDefault();
    try {
      const data: {
        skillName: string;
        experience: string;
        type: string;
        iconUrl: "iconUrl...";
      } = extractCandidateSkillForm();

      if (x.skills.length === 0 || x.skills[0].skillName.length === 0) {
        x.skills = [data];
      } else {
        const error = x.skills
          .filter(
            (item) =>
              item.skillName.toLowerCase() === data.skillName.toLowerCase()
          )
          .pop();

        if (error) {
          alert("Skill already exist");
          return;
        }

        console.log("error", error);
        x.skills.push(data);
      }
      console.log("x", x);
      setApplyForm(x);

      clearCandidateSkillForm();
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
    }
  };

  const removeSkillHandler = (e: number) => {
    let x = { ...applyForm };
    x.skills.splice(e, 1);
    setApplyForm(x);
  };
  const addLanguageAndRating = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let x = { ...applyForm };

      const data = extractlanguageAndRatingForm();

      const alreadyExist = x.languages
        .filter((item) => item.language === data.language)
        .pop();

      if (alreadyExist) {
        throw new Error("Language already exist!");
      }

      if (x.languages[0].language.length === 0) {
        x.languages = [data];
      } else {
        x.languages.push(data);
      }
      console.log("languageAndRatingForm", x);
      setApplyForm(x);
      clearLanguageAndRatingForm();
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
    }
  };
  const removeLanguageHandler = (e: number) => {
    let x = { ...applyForm };
    x.languages.splice(e, 1);
    console.log("x", x);
    setApplyForm(x);
  };
  const markMainSkillHandler = (e: string, isChecked: boolean) => {
    let x = { ...applyForm };
    const updatedSkills: any = [];
    x.skills.map((item) => {
      if (item.skillName === e) {
        let data;
        if (item.type.includes("ADDITIONAL")) {
          data = {
            ...item,
            type: isChecked ? "MAIN/ADDITIONAL" : "OTHER/ADDITIONAL",
          };
        } else {
          data = { ...item, type: isChecked ? "MAIN" : "OTHER" };
        }
        updatedSkills.push(data);
      } else {
        updatedSkills.push(item);
      }
    });

    x.skills = updatedSkills;

    setApplyForm(x);
  };
  console.log("applyform", applyForm);
  const applyFormSubmitHandler = async () => {
    setIsLoading(true);
    try {
      const resp = await postApplyAsDeveloperForm();
      console.log("apply form resp", resp);
      setIsLoading(false);
      notifySuccess("Your application successfully submitted");
      clearApplyForm();
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
      setIsLoading(false);
    }
  };

  const mainSkills = [];
  applyForm.skills.map((item) => {
    item.type === "MAIN" && mainSkills.push(item);
  });

  return (
    <Fragment>
      <p id="pageText" className="text-xs font-semibold text-black mb-5">
        Update Candidate
      </p>

      <div className="mt-5">
        <HeadingPrimary heading="Candidate Information" className="mb-5" />
        <div className="bg-gray6 rounded p-7.5 mb-7.5">
          <div className="mb-7.5">
            <label className="inline-block font-bold text-sm mb-3">
              Your Title
            </label>

            <Input
              disabled={isLoading}
              placeholder="Enter"
              width="w-full"
              containerClassName="bg-white mr-5"
              name="title"
              value={applyForm.title.value}
              error={applyForm.title.error}
              handleForm={handleApplyForm}
            />
          </div>

          <div>
            <h1 className="font-bold mb-3">Add skills</h1>
            {/* skill form */}
            <form
              onSubmit={addSkillHandler}
              className={`flex transition100 ${
                candidateSkillForm.experience.error
                  ? "mb-8"
                  : candidateSkillForm.skillName.error
                  ? "mb-8"
                  : "mb-3"
              }`}
            >
              <Input
                disabled={isLoading}
                placeholder="Skills."
                width="w-full"
                containerClassName="bg-white mr-5"
                name="skillName"
                value={candidateSkillForm.skillName.value}
                error={candidateSkillForm.skillName.error}
                handleForm={handleCandidateSkillForm}
              />

              <Input
                disabled={isLoading}
                placeholder="Experience."
                // icon={<Search />}
                width="w-full"
                containerClassName="bg-white mr-5"
                name="experience"
                value={candidateSkillForm.experience.value}
                error={candidateSkillForm.experience.error}
                handleForm={handleCandidateSkillForm}
              />

              <ButtonSecondary className="px-12 h-10">Add</ButtonSecondary>
            </form>

            <div className="bg-white rounded px-5 py-6">
              {/* heading */}
              <div className="text-gray3 text-xs font-bold grid grid-cols-3 mb-4">
                <p>Skill Name.</p>
                <p className="justify-self-center">
                  No. of Years of Experience
                </p>
                <p className="justify-self-end mr-5">
                  Main Skill({mainSkills.length})
                </p>
              </div>

              <div className="w-full border border-blue-400" />

              {/* candidate info container */}
              <div className="font-medium text-sm text-black">
                {applyForm.skills.length > 0 &&
                applyForm.skills[0].skillName.length > 0 ? (
                  applyForm.skills.map((item, i) => {
                    return (
                      <CandidateInfoCard
                        onMarkMain={(e) => {
                          markMainSkillHandler(item.skillName, e);
                        }}
                        onDelete={() => {
                          removeSkillHandler(applyForm.skills.indexOf(item));
                        }}
                        key={i}
                        checked={item.type === "MAIN" ? true : false}
                        experience={item.experience}
                        skillName={item.skillName}
                      />
                    );
                  })
                ) : (
                  <p className="text-center mt-5 font-bold">
                    No Skill and Experience Added!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-7.5">
          <HeadingPrimary heading="ABOUT EMPLOYEE" className="mb-5" />

          <div className="bg-gray6 rounded  p-5">
            <h3 className="font-bold text-sm mb-3">Describe Yourself</h3>

            <TextArea
              disabled={isLoading}
              placeholder="Type your text here..."
              name="aboutInfo"
              className="w-full rounded-lg p-5"
              containerClassName="mb-7.5"
              border="border border-gray-300 hover:border-gray-400 focus:border-gray-400 "
              row={5}
              value={applyForm.aboutInfo.value}
              error={applyForm.aboutInfo.error}
              handleForm={handleApplyForm}
            />

            <h3 className="font-bold text-sm mb-3">Additional Information</h3>

            <TextArea
              disabled={isLoading}
              placeholder="Type your text here..."
              name="additionalInfo"
              className="w-full rounded-lg p-5"
              border="border border-gray-300 hover:border-gray-400 focus:border-gray-400 "
              row={5}
              value={applyForm.additionalInfo.value}
              error={applyForm.additionalInfo.error}
              handleForm={handleApplyForm}
            />
          </div>
        </div>

        <div className="mb-7.5">
          <HeadingPrimary heading="Basic Information" className="mb-5" />
          <div className="bg-gray6 rounded p-5">
            {/* language and rating form */}
            <form
              className={`flex gap-x-5 justify-evenly items-end mb-3 transition100 ${
                languageAndRatingForm.language.error
                  ? "mb-9"
                  : languageAndRatingForm.rating.error
                  ? "mb-9"
                  : "mb-3"
              }`}
              onSubmit={addLanguageAndRating}
            >
              <div className="w-full">
                <label className="inline-block font-bold text-sm mb-3">
                  Languages known
                </label>
                <Input
                  disabled={isLoading}
                  placeholder="English"
                  width="w-full"
                  containerClassName="bg-white capitalize"
                  className="capitalize"
                  name="language"
                  value={languageAndRatingForm.language.value}
                  error={languageAndRatingForm.language.error}
                  handleForm={handlelanguageAndRatingForm}
                />
              </div>
              <div className="w-full">
                <label className="inline-block font-bold text-sm mb-3">
                  How good are you?
                </label>
                <Input
                  disabled={isLoading}
                  placeholder="A2"
                  width="w-full"
                  containerClassName="bg-white"
                  className="capitalize"
                  name="rating"
                  value={languageAndRatingForm.rating.value}
                  error={languageAndRatingForm.rating.error}
                  handleForm={handlelanguageAndRatingForm}
                />
              </div>

              <ButtonSecondary className="px-12 h-10">Add</ButtonSecondary>
            </form>

            {/* language and rating list container */}
            <div className="py-4 grid grid-cols-4 gap-5 px-5 rounded bg-white mb-7.5">
              {applyForm.languages.length > 0 &&
              applyForm.languages[0].language.length > 0 ? (
                applyForm.languages.map(
                  (item: { language: string; rating: string }, i) => {
                    return (
                      <LanguageItemContainer
                        key={i}
                        language={item.language}
                        rating={item.rating}
                        onRemove={() => {
                          removeLanguageHandler(
                            applyForm.languages.indexOf(item)
                          );
                        }}
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

            <label className="inline-block font-bold text-sm mb-3">
              Overall experiance in years
            </label>

            <Input
              disabled={isLoading}
              placeholder="Enter"
              containerClassName="w-full bg-white mb-7.5"
              className="px-5"
              name="overallExperience"
              value={applyForm.overallExperience.value}
              error={applyForm.overallExperience.error}
              handleForm={handleApplyForm}
            />

            <label className="inline-block font-bold text-sm mb-3">
              Notice Period / When Avaliable
            </label>
            <Input
              disabled={isLoading}
              placeholder="Notice Period In Days (eg: 15)"
              containerClassName="w-full bg-white mb-7.5"
              className="px-5"
              name="noticePeriod"
              value={applyForm.noticePeriod.value}
              error={applyForm.noticePeriod.error}
              handleForm={handleApplyForm}
            />
          </div>
        </div>

        {/* few more questions */}
        <FewMoreQuestionsForm
          quesData={applyForm}
          onChange={(e) => {
            handleApplyForm(e);
          }}
        />

        <div className="flex gap-5 justify-end mt-10">
          <ButtonSecondary
            className="px-7 h-10"
            type="button"
            disabled={isLoading}
          >
            Upload your CV
          </ButtonSecondary>
          <ButtonSecondary
            className="h-10 w-40"
            type="submit"
            onClick={applyFormSubmitHandler}
            disabled={isLoading}
          >
            {isLoading ? (
              <LoadingSpinner spinnerClassName="w-8 h-8 m-auto" />
            ) : (
              "Submit"
            )}
          </ButtonSecondary>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </Fragment>
  );
};

export default Candinfo;
