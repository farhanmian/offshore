export const BASE_URL = "http://localhost:3000/api";
// export const BASE_URL = "https://offshoreserver.herokuapp.com/api";

export const URLS = {
  SIGN_IN: BASE_URL + "/user/login",

  //// candidate admin
  CREATE_CANDIDATE: BASE_URL + "/user/create/candidate",

  GET_ENABLED_CANDIDATES: BASE_URL + "/user/get/enabled/candidate",
  GET_DISABLED_CANDIDATES: BASE_URL + "/user/get/disabled/candidate",

  GET_CANDIDATE: BASE_URL + "/user/get/candidate",
  GET_CANDIDATE_BY_SKILL: BASE_URL + "/client/get/particular/skill", // /:query
  UPDATE_CANDIDATE: BASE_URL + "/user/update/candidate",
  UPDATE_CANDIDATE_STATUS: BASE_URL + "/user/updatestatus/candidate",
  GET_ALL_APPLIED_CANDIDATES: BASE_URL + "/user/get/applied",
  GET_APPLIED_CANDIDATE: BASE_URL + "/user/get/applied",
  DELETE_CANDIDATE: BASE_URL + "/user/delete/candidate",
  DELETE_APPLIED_CANDIDATE: BASE_URL + "/user/delete/applied",
  REJECT_MULTIPLE_APPLIED_CANDIDATES: BASE_URL + "/user/reject/applied",
  FORGOT_PASSWORD: BASE_URL + "/user/forgot",
  RESET_PASSWORD: BASE_URL + "/reset",

  APPLIED_CANDIDATE_STATUS: BASE_URL + "/client/status",

  //// candidate user
  GET_MULTIPLE_CANDIDATES: BASE_URL + "/client/get/multiple",
  GET_ALL_CANDIDATES_CLIENT: BASE_URL + "/client/get/all/candidate",
  SEARCH_CANDIDATE_BY_SKILL_NAME: BASE_URL + "/client/candidates",
  GET_CANDIDATE_CLIENT: BASE_URL + "/client/get/candidate",
  APPLY_AS_DEVELOPER: BASE_URL + "/client/apply",

  //// skill
  CREATE_SKILL: BASE_URL + "/user/create/skill",
  GET_SKILL: BASE_URL + "/user/get/skill",
  GET_ALL_SKILLS: BASE_URL + "/user/get/skill",
  DELETE_SKILL: BASE_URL + "/user/delete/skill",
  UPDATE_SKILL_STATUS: BASE_URL + "/user/updatestatus/skill",

  GET_CANDIDATE_BY_EMPLOYEE_NUMBER: BASE_URL + "/client",

  //// skill client
  GET_ALL_SKILLS_CLIENT: BASE_URL + "/client/get/all/skill",

  //// properties
  CREATE_PROPERTY: BASE_URL + "/user/create/property",
  UPDATE_SKILL: BASE_URL + "/user/update/skill",
  GET_ALL_PROPERTIES: BASE_URL + "/user/get/property",
  DELETE_PROPERTY: BASE_URL + "/user/delete/property",
  UPDATE_PROPERTY_STATUS: BASE_URL + "/user/updatestatus/property",

  //// terms and condition
  CREATE_TERMS: BASE_URL + "/user/create/terms",
  GET_TERMS: BASE_URL + "/user/get/terms",
  UPDATE_TERMS: BASE_URL + "/user/update/terms",
  DELETE_TERM: BASE_URL + "/user/terms",

  GET_CLIENT_TERMS: BASE_URL + "/client/get/terms",

  //// other
  CONTACT_US: BASE_URL + "/client/contact",
  ENQUIRY_FORM: BASE_URL + "/client/enquiry",
  CLIENT_FEEDBACK: BASE_URL + "/client/feedback",
};
