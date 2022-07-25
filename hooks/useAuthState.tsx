import React, { useState } from "react";
import { Client, User } from "../api/apiServices";
import { noImgFoundBase64 } from "../assets/img/no-img-found-base64";
import {
  applyFormInfo,
  candidateFormInfo,
  candidatePropertyFormInfo,
  candidateSkillInfo,
  contactUsInfo,
  enquiryFormInfo,
  languageAndRatingInfo,
  propertyFormInfo,
  signInInfo,
  skillFormInfo,
  termsAndConditionInfo,
} from "../constant/constant";
import {
  ApplyAsDeveloperFormType,
  ContactUsFormType,
  SkillFormType,
} from "../store/types/types";

const useAuthState = () => {
  const [signInForm, setSignInForm] = useState({ ...signInInfo });
  const [skillForm, setSkillForm] = useState({ ...skillFormInfo });
  const [propertyForm, setPropertyForm] = useState({ ...propertyFormInfo });
  const [candidateForm, setCandidateForm] = useState({ ...candidateFormInfo });
  const [candidateSkillForm, setCandidateSkillForm] = useState({
    ...candidateSkillInfo,
  });
  const [candidatePropertyForm, setCandidatePropertyForm] = useState({
    ...candidatePropertyFormInfo,
  });
  const [termsAndConditionForm, setTermsAndConditionForm] = useState({
    ...termsAndConditionInfo,
  });
  const [contactUsForm, setContactUsForm] = useState({ ...contactUsInfo });
  const [enquiryForm, setEnquiryForm] = useState({ ...enquiryFormInfo });
  const [applyForm, setApplyForm] = useState({ ...applyFormInfo });
  const [languageAndRatingForm, setLanguageAndRatingForm] = useState({
    ...languageAndRatingInfo,
  });

  //// validation function
  const handleInputValidation = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let error = "";
    const name = e.target.name;
    const value = e.target.value;

    if (
      name !== "email" &&
      name !== "skillName" &&
      name !== "cv" &&
      /[^a-zA-Z0-9 ]/.test(value)
    ) {
      error = "Entered value must not be a special character!";
    }
    if (name === "email") {
      if (value.trim().length === 0) {
        error = "Email must not be empty!";
      }
    } else if (name === "password") {
      if (value.trim().length === 0) {
        error = "Password must not be empty!";
      } else if (value.trim().length < 8) {
        error = "Minimum character limit is 8";
      } else if (value.trim().length > 20) {
        error = "Maximum character limit is 20";
      }
    } else if (name === "name") {
      if (value.trim().length === 0) {
        error = "Name must not be empty!";
      } else if (/[^a-zA-Z0-9 ]/.test(value)) {
        error = "cannot use special characters!";
      } else if (value.trim().length > 30) {
        error = "Maximum character limit is 30";
      }
    } else if (name === "experience" || name === "employeeNumber") {
      if (value.trim().length === 0) {
        error = "Field must not be empty!";
      } else if (isNaN(+value)) {
        error = "Must be a number";
      } else if (name === "experience" && +value >= 70) {
        error = "Enter a valid Experience";
      } else if (+value < 0) {
        error = "Entered value cannot be less than 0!";
      } else if (name === "employeeNumber" && +value === 0) {
        error = "Employee number must be greater than 0!";
      } else if (name === "employeeNumber" && !/^[1-9]\d*$/.test(value)) {
        error = "Employee number cannot be a desimal number!";
      }
    } else if (name === "title") {
      if (value.trim().length === 0) {
        error = "Title must not be empty!";
      } else if (/[^a-zA-Z0-9 ]/.test(value)) {
        error = "Title must not contain special characters!";
      } else if (value.trim().length < 2) {
        error = "Minimum character limit is 2";
      }
    } else if (name === "terms" || name === "aboutInfo") {
      if (value.trim().length === 0) {
        error = `${
          name === "aboutInfo" ? "Description" : "Terms"
        } must not be empty!`;
      } else if (value.trim().length < 10) {
        error = "Minimum character limit is 10";
      } else if (value.trim().length > 300) {
        error = "Maximum character limit is 300";
      }
    } else if (name === "value") {
      if (value.trim().length === 0) {
        error = "This field must not be empty!";
      } else if (/[^a-zA-Z0-9 ]/.test(value)) {
        error = "value cannot be a special character!";
      }
    } else if (name === "heading") {
      if (value.trim().length === 0) {
        error = "This Field must not be empty!";
      } else if (value.trim().length < 5) {
        error = "Minimum character limit is 5";
      } else if (value.trim().length > 50) {
        error = "Maximum character limit is 50";
      }
    } else if (name === "text") {
      if (value.trim().length === 0) {
        error = "This Field must not be empty!";
      } else if (value.trim().length < 15) {
        error = "Minimum character limit is 5";
      }
    } else if (name === "skillName") {
      if (value.trim().length === 0) {
        error = "Skill name must not be empty!";
      } else if (/[^a-zA-Z0-9. ]/.test(value)) {
        error = "Skill name must not contain special characters!";
      } else if (value.trim().length > 30) {
        error = "Maximum character limit is 30";
      }
    } else if (name === "message") {
      if (value.trim().length === 0) {
        error = "Message must not be empty!";
      } else if (value.trim().length < 15) {
        error = "Minimum character limit is 15";
      }
    } else if (name === "phone") {
      if (value.trim().length === 0) {
        error = "Phone must not be empty!";
      } else if (isNaN(+value)) {
        error = "Must be a number";
      } else if (value.trim().length < 10) {
        error = "Enter a valid Number!";
      } else if (value.trim().length > 14) {
        error = "Enter a valid Number!";
      }
    } else if (name === "language") {
      if (value.trim().length === 0) {
        error = "This field must not be empty!";
      } else if (value.trim().length < 2) {
        error = "Minimum character limit is 2";
      } else if (!isNaN(+value)) {
        error = "This field must not be a number!";
      }
    } else if (name === "rating") {
      if (value.trim().length === 0) {
        error = "This field must not be empty!";
      }
    } else if (name === "noticePeriod") {
      if (value.trim().length === 0) {
        error = "Field must not be empty!";
      }
    } else if (name === "overallExperience") {
      if (value.trim().length === 0) {
        error = "Field must not be empty!";
      } else if (+value > 70) {
        error = "Enter a valid Experience";
      } else if (+value < 0) {
        error = "Experience cannot be negative";
      } else if (isNaN(+value)) {
        error = "This field must be a number!";
      }
    } else if (name === "cv") {
      if (value.trim().length === 0) {
        error = "Please select your CV";
      }
    }
    return error;
  };
  //// final validation function
  const formEmptyAndErrorValidation = (form: any, key: string) => {
    let error = "";
    if (form.value.length === 0 && form.error.length === 0) {
      // error = `${key === "skillName" ? "Skill name" : key} should not be empty`;
      error =
        key === "skillName"
          ? "Select a Skill!"
          : key === "cv"
          ? "Please select your CV"
          : `${key} must not be empty`;
    } else if (form.value.length === 0 && form.error.length !== 0) {
      error = form.error;
    } else if (form.value.length !== 0 && form.error.length !== 0) {
      error = `${key === "skillName" ? "Skill name" : key} is not valid`;
    } else {
      error = "";
    }
    return error;
  };
  //// handle form functions
  const handleSignInForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...signInForm };
    const name = e.target.name;
    console.log(name);

    if (name !== "email" && name !== "password") return;

    x[name]["value"] = e.target.value;
    x[name]["error"] = handleInputValidation(e);

    setSignInForm(x);
  };
  const handleSkillForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...skillForm };
    const name = e.target.name;

    if (name !== "name" && name !== "iconUrl" && name !== "type") return;

    x[name]["value"] = e.target.value;
    x[name]["error"] = handleInputValidation(e);

    setSkillForm(x);
  };
  const handlePropertyForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...propertyForm };
    const name = e.target.name;

    if (name !== "name") return;

    x[name]["value"] = e.target.value;
    x[name]["error"] = handleInputValidation(e);

    setPropertyForm(x);
  };
  const handleCandidateSkillForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...candidateSkillForm };
    const name = e.target.name;
    if (
      name !== "skillName" &&
      name !== "experience" &&
      name !== "type" &&
      name !== "iconUrl"
    )
      return;

    x[name].value = e.target.value;
    x[name].error = handleInputValidation(e);

    setCandidateSkillForm(x);
  };
  const handleCandidatePropertyForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...candidatePropertyForm };
    const name = e.target.name;
    if (name !== "name" && name !== "value") return;
    x[name].value = e.target.value;
    x[name].error = handleInputValidation(e);
    setCandidatePropertyForm(x);
  };
  const handleCandidateForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...candidateForm };
    const name = e.target.name;

    if (
      name === "title" ||
      name === "employeeNumber" ||
      name === "aboutInfo" ||
      name === "additionalInfo" ||
      name === "terms" ||
      name === "fullTimeJob" ||
      name === "partTimeJob" ||
      name === "havePc" ||
      name === "okWithWorking8To1"
    ) {
      x[name]["value"] = e.target.value;
      x[name]["error"] = handleInputValidation(e);
    }

    setCandidateForm(x);
  };
  const handleTermsAndConditionForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...termsAndConditionForm };
    const name = e.target.name;
    console.log(name);

    if (name !== "heading" && name !== "text") return;

    x[name]["value"] = e.target.value;
    x[name]["error"] = handleInputValidation(e);

    setTermsAndConditionForm(x);
  };
  const handleContactUsForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...contactUsForm };
    const name = e.target.name;
    console.log(name);

    if (
      name !== "name" &&
      name !== "email" &&
      name !== "message" &&
      name !== "phone"
    )
      return;

    x[name]["value"] = e.target.value;
    x[name]["error"] = handleInputValidation(e);

    if (
      name == "email" &&
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(e.target.value)
    ) {
      x.email.error = "Enter a valid email";
    }
    setContactUsForm(x);
  };
  const handleEnquiryForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...enquiryForm };

    const name = e.target.name;

    if (name === "email" || name === "message" || name === "phone") {
      x[name]["value"] = e.target.value;
      x[name]["error"] = handleInputValidation(e);
    } else if (name === "candidateDetails") {
      const data: any = e.target.value;
      x.candidateDetails = data;
    }
    setEnquiryForm(x);
  };
  const handleApplyForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...applyForm };
    const name = e.target.name as keyof typeof applyForm;
    const value = e.target.value;
    if (name !== "skills" && name !== "languages") {
      x[name].value = value;
      x[name].error = handleInputValidation(e);
    }

    setApplyForm(x);
  };
  const handlelanguageAndRatingForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...languageAndRatingForm };
    const name = e.target.name;
    if (name !== "language" && name !== "rating") return;

    x[name].value = e.target.value;
    x[name].error = handleInputValidation(e);
    setLanguageAndRatingForm(x);
  };

  //// extract data functions
  const extractSignInFormData = () => {
    let data: any = { email: "", password: "" };
    for (const [mainKey, mainValue] of Object.entries(signInForm)) {
      let mainVal = mainValue;
      if (mainKey !== "email" && mainKey !== "password") return;
      data[mainKey] = mainVal.value;
    }
    return data;
  };
  const extractSkillFormData = () => {
    let data: any = {};

    for (const [mainKey, mainValue] of Object.entries(skillForm)) {
      let mainVal = mainValue;
      if (
        mainKey !== "name" &&
        mainKey !== "iconUrl" &&
        mainKey !== "type" &&
        mainKey !== "candidatesHired"
      )
        return;
      data[mainKey] = mainVal.value;
    }
    return data;
  };
  const extractPropertyFormData = () => {
    let data: any = {};
    for (const [mainKey, mainValue] of Object.entries(propertyForm)) {
      let mainVal = mainValue;
      if (mainKey !== "name") return;
      data[mainKey] = mainVal.value;
    }
    console.log("propertyExtractionFormData", data);
    return data;
  };
  const extractCandidateSkillForm = () => {
    let x = { ...candidateSkillForm };
    let error = false;

    /// if there is no type it will be additional type
    if (x.type.value.trim().length === 0) {
      x.type.value = "OTHER";
    }
    ///// final validation
    for (const [mainKey, mainValue] of Object.entries(x)) {
      let err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);

      if (
        mainKey !== "skillName" &&
        mainKey !== "experience" &&
        mainKey !== "type" &&
        mainKey !== "iconUrl"
      )
        return;
      x[mainKey]["error"] = err;

      if (err.length !== 0) {
        error = true;
      }
    }

    if (error) {
      setCandidateSkillForm(x);
      throw Error("Invalid or Incomplete Form Fields...");
    }

    let data: any = {};
    for (const [mainKey, mainValue] of Object.entries(candidateSkillForm)) {
      let mainVal = mainValue;
      if (
        mainKey !== "skillName" &&
        mainKey !== "experience" &&
        mainKey !== "type" &&
        mainKey !== "iconUrl"
      )
        return;
      data[mainKey] = mainVal.value;
    }
    console.log("extract candidateskillform data---", data);
    return data;
  };
  const extractCandidatePropertyForm = () => {
    let x = { ...candidatePropertyForm };
    let error = false;

    ///// final validation
    for (const [mainKey, mainValue] of Object.entries(x)) {
      let err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);

      if (mainKey !== "name" && mainKey !== "value") return;
      x[mainKey]["error"] = err;

      if (err.length !== 0) {
        error = true;
      }
    }
    if (error) {
      setCandidatePropertyForm(x);
      throw Error("Invalid or Incomplete Form Fields...");
    }

    let data: any = {};
    for (const [mainKey, mainValue] of Object.entries(candidatePropertyForm)) {
      let mainVal = mainValue;
      if (mainKey !== "name" && mainKey !== "value") return;
      data[mainKey] = mainVal.value;
    }
    return data;
  };
  const extractCandidateFormData = () => {
    let data: any = {
      aboutInfo: "",
      additionalInfo: "",
      employeeNumber: "",
      properties: [],
      skills: [],
      terms: "",
      title: "",
    };
    for (const [mainKey, mainValue] of Object.entries(candidateForm)) {
      let mainVal: any = mainValue;
      if (mainKey === "skills" || mainKey === "properties") {
        const skillData: any = [];
        candidateForm.skills.map((item) => {
          const data = {
            name: item.skillName,
            experience: item.experience,
            type: item.type,
            iconUrl: item.iconUrl ? item.iconUrl : "iconUrl",
          };
          skillData.push(data);
        });

        if (mainKey === "skills") {
          data[mainKey] = skillData;
        } else {
          const info = [...candidateForm[mainKey]];
          data[mainKey] = info;
        }
      } else {
        data[mainKey] = mainVal.value;
      }
    }
    return data;
  };
  const extractTermsAndConditionData = () => {
    let data: any = {};
    for (const [mainKey, mainValue] of Object.entries(termsAndConditionForm)) {
      let mainVal = mainValue;
      if (mainKey !== "heading" && mainKey !== "text" && mainKey !== "id")
        return;
      data[mainKey] = mainVal.value;
    }
    console.log("extractTermsAndCondition", data);
    return data;
  };
  const extractContactUsFormData = () => {
    let data: any = {};
    for (const [mainKey, mainValue] of Object.entries(contactUsForm)) {
      let mainVal: any = mainValue;
      if (
        mainKey !== "name" &&
        mainKey !== "email" &&
        mainKey !== "message" &&
        mainKey !== "phone"
      )
        return;
      data[mainKey] = mainVal.value;
    }
    console.log("extractContactUsFormData", data);
    return data;
  };
  const extractEnquiryFormData = () => {
    let data: any = {};
    for (const [mainKey, mainValue] of Object.entries(enquiryForm)) {
      let mainVal: any = mainValue;
      if (mainKey === "email" || mainKey === "message" || mainKey === "phone") {
        data[mainKey] = mainVal.value;
      } else if (mainKey === "candidateDetails") {
        data[mainKey] = mainVal;
      }
    }
    console.log("extractContactUsFormData", data);
    return data;
  };
  const extractApplyAsDeveloperFormData = () => {
    let data: any = {};

    for (const [mainKey, mainValue] of Object.entries(applyForm)) {
      let mainVal: any = mainValue;
      if (mainKey === "skills" || mainKey === "languages") {
        data[mainKey] = applyForm[mainKey];
      } else {
        data[mainKey] = mainVal.value;
      }
    }
    return data;
  };
  const extractlanguageAndRatingForm = () => {
    let x = { ...languageAndRatingForm };
    let error = false;

    console.log("languageAndRatingForm", languageAndRatingForm);

    ///// final validation
    for (const [mainKey, mainValue] of Object.entries(x)) {
      let err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);

      if (mainKey !== "language" && mainKey !== "rating") return;
      x[mainKey]["error"] = err;

      if (err.length !== 0) {
        error = true;
      }
    }

    if (error) {
      setLanguageAndRatingForm(x);
      throw Error("Invalid or Incomplete Form Fields...");
    }

    let data: any = {};

    for (const [mainKey, mainValue] of Object.entries(x)) {
      let mainVal = mainValue;
      if (mainKey !== "language" && mainKey !== "rating") return;

      data[mainKey] = mainVal.value;
    }

    return data;
  };

  //// post functions
  const postSignInForm = async () => {
    try {
      let x = { ...signInForm };
      let error = false;

      //end validation
      for (const [mainKey, mainValue] of Object.entries(x)) {
        let err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);

        if (mainKey !== "email" && mainKey !== "password") return;
        x[mainKey]["error"] = err;

        if (err.length !== 0) {
          error = true;
        }
      }

      if (error) {
        setSignInForm(x);
        console.log("error-false", error);
        throw Error("Invalid or Incomplete Form Fields...");
      }
      //extractData
      const data: { email: string; password: string } = extractSignInFormData();

      const resp: any = await User.signIn(data);

      if (resp.status !== 200) {
        throw new Error(resp);
      }
      return resp;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  const postSkillForm = async (skillId: string) => {
    try {
      let x = { ...skillForm };
      let error = false;
      console.log("skillform", x);
      //end validation

      for (const [mainKey, mainValue] of Object.entries(x)) {
        let err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);

        if (
          mainKey !== "name" &&
          mainKey !== "type" &&
          mainKey !== "iconUrl" &&
          mainKey !== "candidatesHired"
        ) {
          console.log(mainKey, " is missing in if() condition");
          return;
        }
        x[mainKey]["error"] = err;

        if (err.length !== 0) {
          error = true;
        }
      }
      console.log("error", error);
      if (error) {
        setSkillForm(x);
        console.log("error-false", error);
        throw Error("Invalid or Incomplete Form Fields...");
      }
      //extractData
      const data: SkillFormType = extractSkillFormData();
      console.log("post skill form data", data);
      console.log("skillId from authState", skillId);
      let resp: any;
      if (skillId) {
        resp = await User.updateSkill(data, skillId);
      } else {
        resp = await User.createSkill(data);
      }

      if (resp.status !== 200) {
        throw new Error(resp);
      }

      return resp;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  const postPropertyForm = async () => {
    try {
      let x = { ...propertyForm };
      let error = false;

      //end validation
      for (const [mainKey, mainValue] of Object.entries(x)) {
        let err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);

        if (mainKey !== "name") return;
        x[mainKey]["error"] = err;

        if (err.length !== 0) {
          error = true;
        }
      }

      console.log("hello");

      if (error) {
        setPropertyForm(x);
        throw Error("Invalid or Incomplete Form Fields...");
      }
      //extractData
      const data: { name: string } = extractPropertyFormData();
      console.log("post property form data", data);

      const resp: any = await User.createProperty(data);

      if (resp.status !== 200) {
        throw new Error(resp);
      }

      return resp;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  const postCandidateForm = async (candidateId: string) => {
    try {
      let x: any = { ...candidateForm };
      let error = false;

      // end validation
      for (const [mainKey, mainValue] of Object.entries(x)) {
        let err = "";

        if (
          mainKey !== "employeeNumber" &&
          mainKey !== "title" &&
          mainKey !== "aboutInfo" &&
          mainKey !== "additionalInfo" &&
          mainKey !== "terms" &&
          mainKey !== "skills" &&
          mainKey !== "properties" &&
          mainKey !== "fullTimeJob" &&
          mainKey !== "partTimeJob" &&
          mainKey !== "havePc" &&
          mainKey !== "okWithWorking8To1"
        )
          return;
        if (
          mainKey !== "skills" &&
          mainKey !== "properties" &&
          mainKey !== "additionalInfo"
        ) {
          err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);
        }

        x[mainKey]["error"] = err;

        if (err.length !== 0) {
          error = true;
        }
      }

      if (error) {
        setCandidateForm(x);
        console.log("error-false", error);
        throw Error("Invalid or Incomplete Form Fields...");
      }

      //extractData
      const data = extractCandidateFormData();

      if (
        (x.skills.length > 0 && x.skills[0].skillName.length === 0) ||
        x.skills.length === 0
      ) {
        throw new Error("Please add a Skill!");
      }

      console.log("candidate FOrm Data---", data);
      let resp: any;

      if (candidateId) {
        resp = await User.updateCandidate(candidateId, data);
      } else {
        resp = await User.createCandidates(data);
      }

      if (resp.status !== 200) {
        throw new Error(resp);
      }

      return resp;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  const postTermsAndConditionForm = async (terms: any) => {
    try {
      let x = { ...termsAndConditionForm };
      let error = false;

      //end validation
      for (const [mainKey, mainValue] of Object.entries(x)) {
        let err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);

        if (mainKey !== "heading" && mainKey !== "text") return;
        x[mainKey]["error"] = err;

        if (err.length !== 0) {
          error = true;
        }
      }

      if (error) {
        setTermsAndConditionForm(x);
        console.log("error-false", error);
        throw Error("Invalid or Incomplete Form Fields...");
      }
      //extractData
      const data = extractSignInFormData();

      const resp: any = await User.createTerms(terms);

      if (resp.status !== 200) {
        throw new Error(resp);
      }
      return resp;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  const postContactUsForm = async () => {
    try {
      let x = { ...contactUsForm };
      let error = false;

      //end validation
      for (const [mainKey, mainValue] of Object.entries(x)) {
        let err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);

        if (
          mainKey !== "name" &&
          mainKey !== "email" &&
          mainKey !== "message" &&
          mainKey !== "phone"
        )
          return;
        x[mainKey]["error"] = err;

        if (err.length !== 0) {
          error = true;
        }
      }

      if (error) {
        setContactUsForm(x);
        console.log("error-false", error);
        throw Error("Invalid or Incomplete Form Fields...");
      }
      //extractData
      const data: ContactUsFormType = extractContactUsFormData();
      console.log("postContactUsForm", data);
      const resp: any = await Client.contactUs(data);

      if (resp.status !== 200) {
        throw new Error(resp);
      }

      return resp;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  const postEnquiryForm = async () => {
    try {
      let x = { ...enquiryForm };
      let error = false;

      //end validation
      for (const [mainKey, mainValue] of Object.entries(x)) {
        let err: any = "";
        if (
          mainKey === "email" ||
          mainKey === "message" ||
          mainKey === "phone"
        ) {
          err = formEmptyAndErrorValidation(mainValue, `${mainKey}`);
          x[mainKey].error = err;
        }

        if (err.length !== 0) {
          error = true;
        }
      }

      if (error) {
        setEnquiryForm(x);
        console.log("error-false", error);
        throw Error("Invalid or Incomplete Form Fields...");
      }
      //extractData
      const data = extractEnquiryFormData();
      console.log("postEnquiryForm", data);

      const resp: any = await Client.postEnquiryForm(data);

      if (resp.status !== 200) {
        throw new Error(resp);
      }
      return resp;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  const postApplyAsDeveloperForm = async () => {
    try {
      let x = { ...applyForm };
      let error = false;

      //end validation
      for (const [mainKey, mainValue] of Object.entries(x)) {
        const key = mainKey as keyof typeof applyForm;
        let err: any = "";
        if (
          key !== "skills" &&
          key !== "languages" &&
          key !== "additionalInfo" &&
          key !== "cv"
        ) {
          err = formEmptyAndErrorValidation(
            mainValue,
            `${key === "aboutInfo" ? "description" : key}`
          );
          x[key].error = err;
        }
        if (err.length !== 0) {
          error = true;
        }
      }

      if (error) {
        setApplyForm(x);
        console.log("error-false", error);
        throw Error("Invalid or Incomplete Form Fields...");
      }

      if (
        (x.skills.length > 0 && x.skills[0].skillName.length === 0) ||
        x.skills.length === 0
      ) {
        throw new Error("Please add a Skill!");
      } else if (
        (x.languages.length > 0 && x.languages[0].language.length === 0) ||
        x.languages.length === 0
      ) {
        throw new Error("Please add a Language!");
      }

      //extractData
      const data: ApplyAsDeveloperFormType = extractApplyAsDeveloperFormData();
      console.log("postApplyAsDeveloperForm", data);
      const resp: any = await Client.applyAsDeveloper(data);

      if (resp.status !== 200) {
        throw new Error(resp);
      }
      document
        .getElementById("pageText")
        ?.scrollIntoView({ behavior: "smooth" });
      return resp;
    } catch (err: any) {
      throw new Error(err);
    }
  };

  //// get req functions
  const getSkill = async (id: string) => {
    try {
      const resp = await User.getSkill(id);
      if (resp.status !== 200) {
        throw new Error(resp);
      }
      let x = { ...skillForm };
      x.iconUrl.value = resp.data.iconUrl;
      x.name.value = resp.data.name;
      x.type.value = resp.data.type;
      setSkillForm(x);
      return resp;
    } catch (err: any) {
      throw new Error(err);
    }
  };
  const getCandidate = async (id: string) => {
    if (!id) return;
    try {
      const resp = await User.getCandidate(id);
      if (resp.status !== 200) {
        throw new Error(resp);
      }
      console.log("candidate data", resp);
      let x = { ...candidateForm };

      Object.keys(x).map((key) => {
        if (
          key === "employeeNumber" ||
          key === "title" ||
          key === "aboutInfo" ||
          key === "terms" ||
          key === "fullTimeJob" ||
          key === "partTimeJob" ||
          key === "havePc" ||
          key === "okWithWorking8To1"
        ) {
          x[key].value = resp.data[key];
        } else if (key === "skills" || key === "properties") {
          if (key === "skills") {
            const skillData: any = [];
            resp.data.skills.map((item: any) => {
              const data = {
                skillName: item.name,
                experience: item.experience,
                id: item.id,
                type: item.type,
                iconUrl: item.iconUrl,
              };
              skillData.push(data);
            });
            x[key] = skillData;
          } else {
            x[key] = resp.data[key];
          }
        }
      });

      setCandidateForm(x);
    } catch (err: any) {
      throw new Error(err);
    }
  };

  //// update req functions
  const updateTermsAndCondition = async (data: any, id: string) => {
    try {
      const resp: any = await User.updateTerms(data, id);
      if (resp.status !== 200) {
        throw new Error(resp);
      }
      return resp;
    } catch (err) {
      console.log(err);
    }
  };

  //// clear candidateSkillForm and candidatePropertyForm
  const clearCandidateSkillAndPropertyForm = () => {
    let y = { ...candidateSkillForm };
    let z = { ...candidatePropertyForm };

    // clearing candidate skill form
    Object.keys(y).map((key) => {
      if (key !== "skillName" && key !== "experience") return;
      y[key].value = "";
      y[key].error = "";
    });

    // clearing candidate property form
    Object.keys(z).map((key) => {
      if (key !== "name" && key !== "value") return;
      z[key].value = "";
      z[key].error = "";
    });

    setCandidateSkillForm(y);
    setCandidatePropertyForm(z);
  };
  //// clear form functions
  const clearCreateCandidateForm = () => {
    let x = { ...candidateForm };

    const uncommonKeys = ["skills", "properties"];

    // clearing candidate form
    Object.keys(x).map((key) => {
      if (uncommonKeys.includes(key)) {
        x.skills = [
          {
            skillName: "",
            experience: "",
            iconUrl: "",
            type: "",
          },
        ];
        x.properties = [
          {
            name: "",
            value: "",
          },
        ];
      } else {
        if (
          key === "employeeNumber" ||
          key === "title" ||
          key === "terms" ||
          key === "aboutInfo" ||
          key === "additionalInfo"
        ) {
          x[key].value = "";
        } else if (
          key === "fullTimeJob" ||
          key === "partTimeJob" ||
          key === "okWithWorking8To1"
        ) {
          x[key].value = "yes";
        } else if (key === "havePc") {
          x.havePc.value = "PC";
        }
      }
    });

    setCandidateForm(x);
    clearCandidateSkillAndPropertyForm();
  };
  const clearPropertyForm = () => {
    let x = { ...propertyForm };
    x.name.value = "";
    setPropertyForm(x);
  };
  const clearSkillForm = () => {
    let x = { ...skillForm };
    x.name.value = "";
    x.type.value = "OTHER";
    x.iconUrl.value = noImgFoundBase64;
    /// later we will clear image data too
    setSkillForm(x);
  };
  const clearTermsAndConditionForm = () => {
    let x = { ...termsAndConditionForm };
    x.heading.value = "";
    x.text.value = "";

    setTermsAndConditionForm(x);
  };
  const clearContactUsForm = () => {
    let x = { ...contactUsForm };
    Object.keys(x).map((key) => {
      if (
        key !== "name" &&
        key !== "email" &&
        key !== "message" &&
        key !== "phone"
      )
        return;
      x[key].value = "";
    });

    setContactUsForm(x);
  };
  const clearCandidateSkillForm = () => {
    let x = { ...candidateSkillForm };
    x.experience.value = "";
    x.skillName.value = "";
    x.type.value = "";
    setCandidateSkillForm(x);
  };
  const clearCandidatePropertyForm = () => {
    let x = { ...candidatePropertyForm };
    x.name.value = "";
    x.value.value = "";
    setCandidatePropertyForm(x);
  };
  const clearEnquiryForm = () => {
    let x = { ...enquiryForm };
    x.email.value = "";
    x.message.value = "";
    x.phone.value = "";
    x.candidateDetails = [
      {
        id: "",
        employeeNumber: "",
      },
    ];
    setEnquiryForm(x);
  };
  const clearApplyForm = () => {
    let x = { ...applyForm };
    let y = { ...languageAndRatingForm };

    const uncommonKeys = ["skills", "languages"];

    // clearing candidate form
    Object.keys(x).map((key) => {
      if (uncommonKeys.includes(key)) {
        x.skills = [
          {
            skillName: "",
            experience: "",
            iconUrl: "",
            type: "",
          },
        ];
        x.languages = [
          {
            language: "",
            rating: "",
          },
        ];
      } else {
        if (
          key === "title" ||
          key === "aboutInfo" ||
          key === "additionalInfo" ||
          key === "overallExperience" ||
          key === "cv" ||
          key === "noticePeriod"
        ) {
          x[key].value = "";
        } else if (
          key === "fullTimeJob" ||
          key === "partTimeJob" ||
          key === "okWithWorking8To1"
        ) {
          x[key].value = "yes";
        } else if (key === "havePc") {
          x.havePc.value = "PC";
        }
      }
    });

    y.language.value = "";
    y.rating.value = "";

    console.log("clear apply form", x);
    clearCandidateSkillAndPropertyForm();
    setApplyForm(x);
    setLanguageAndRatingForm(y);
  };
  const clearLanguageAndRatingForm = () => {
    let x = { ...languageAndRatingForm };

    x.language.value = "";
    x.rating.value = "";

    setLanguageAndRatingForm(x);
  };

  return {
    signInForm,
    skillForm,
    propertyForm,
    candidateForm,
    setCandidateForm,
    candidateSkillForm,
    candidatePropertyForm,
    termsAndConditionForm,
    contactUsForm,
    enquiryForm,
    applyForm,
    setApplyForm,
    languageAndRatingForm,

    handleSignInForm,
    handleSkillForm,
    handlePropertyForm,
    handleCandidateForm,
    handleCandidateSkillForm,
    handleCandidatePropertyForm,
    handleTermsAndConditionForm,
    handleContactUsForm,
    handleEnquiryForm,
    handleApplyForm,
    handlelanguageAndRatingForm,

    extractCandidateSkillForm,
    extractCandidatePropertyForm,
    extractlanguageAndRatingForm,
    extractTermsAndConditionData,

    postSignInForm,
    postSkillForm,
    postPropertyForm,
    postCandidateForm,
    postTermsAndConditionForm,
    postContactUsForm,
    postEnquiryForm,
    postApplyAsDeveloperForm,

    getSkill,
    getCandidate,

    updateTermsAndCondition,

    handleInputValidation,

    clearCreateCandidateForm,
    clearPropertyForm,
    clearSkillForm,
    clearTermsAndConditionForm,
    clearContactUsForm,
    clearCandidateSkillForm,
    clearCandidatePropertyForm,
    clearEnquiryForm,
    clearApplyForm,
    clearLanguageAndRatingForm,
  };
};

export default useAuthState;
