import { noImgFoundBase64 } from "../assets/img/no-img-found-base64";

export const basicInputTemplate = { value: "", error: "", type: "text" };

export const signInInfo = {
  email: { ...basicInputTemplate },
  password: { ...basicInputTemplate },
};

export const skillFormInfo = {
  skillName: { ...basicInputTemplate },
  iconUrl: { ...basicInputTemplate, value: noImgFoundBase64 },
  type: { ...basicInputTemplate, value: "OTHER" }, /// skill type (MAIN or OTHER)
  // candidatesHired: { ...basicInputTemplate, value: "hello" }, ///optional,
  candidatesHired: { ...basicInputTemplate, value: "0" },
};

export const propertyFormInfo = {
  name: { ...basicInputTemplate },
};

export const candidatePropertyFormInfo = {
  name: { ...basicInputTemplate },
  value: { ...basicInputTemplate },
};

export const candidateSkillInfo = {
  skillName: { ...basicInputTemplate },
  iconUrl: { ...basicInputTemplate, value: noImgFoundBase64 },
  experience: { ...basicInputTemplate },
  type: { ...basicInputTemplate },
};

export const candidateFormInfo = {
  employeeNumber: { ...basicInputTemplate },
  title: { ...basicInputTemplate },
  aboutInfo: { ...basicInputTemplate },
  additionalInfo: { ...basicInputTemplate },
  terms: { ...basicInputTemplate },
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
  fullTimeJob: { ...basicInputTemplate, value: "yes" },
  partTimeJob: { ...basicInputTemplate, value: "yes" },
  havePc: { ...basicInputTemplate, value: "PC" },
  okWithWorking8To1: { ...basicInputTemplate, value: "yes" },
};

export const termsAndConditionInfo = {
  heading: { ...basicInputTemplate },
  text: { ...basicInputTemplate },
};

export const contactUsInfo = {
  name: { ...basicInputTemplate },
  email: { ...basicInputTemplate },
  phone: { ...basicInputTemplate },
  message: { ...basicInputTemplate },
};

export const enquiryFormInfo = {
  message: { ...basicInputTemplate },
  email: { ...basicInputTemplate },
  phone: { ...basicInputTemplate },
  candidateDetails: [
    {
      id: "",
      employeeNumber: "",
    },
  ],
};

export const applyFormInfo = {
  title: { ...basicInputTemplate },
  aboutInfo: { ...basicInputTemplate },
  additionalInfo: { ...basicInputTemplate },
  overallExperience: { ...basicInputTemplate },
  noticePeriod: { ...basicInputTemplate },

  languages: [{ language: "", rating: "" }],
  skills: [
    {
      skillName: "",
      iconUrl: noImgFoundBase64,
      experience: "",
      type: "",
    },
  ],

  /// extra question
  fullTimeJob: { ...basicInputTemplate, value: "yes" },
  partTimeJob: { ...basicInputTemplate, value: "yes" },
  havePc: { ...basicInputTemplate, value: "PC" },
  okWithWorking8To1: { ...basicInputTemplate, value: "yes" },
  CV: { ...basicInputTemplate, type: "file" },
};

export const languageAndRatingInfo = {
  language: { ...basicInputTemplate },
  rating: { ...basicInputTemplate },
};

export const forgotPasswordInfo = {
  email: { ...basicInputTemplate },
};

export const resetPasswordInfo = {
  password: { ...basicInputTemplate },
  confirmPassword: { ...basicInputTemplate },
};
