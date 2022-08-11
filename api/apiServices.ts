import axios, { AxiosError, AxiosResponse } from "axios";
import { getCookie } from "cookies-next";
import { url } from "inspector";
import https from "https";

import {
  ApplyAsDeveloperFormType,
  ContactUsFormType,
  CreateSkillType,
  SkillFormType,
} from "../store/types/types";
import { URLS } from "./config";

const headerData: () => any = () => {
  const token = getCookie("token");
  if (token) {
    return {
      "Access-Control-Allow-Origin": "*",
      Authorization: "Bearer " + getCookie("token"),
    };
  } else {
    return {
      "Access-Control-Allow-Origin": "*",
    };
  }
};

const instance = axios.create({
  timeout: 30000,
  headers: headerData(),
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const responseBody = (response: AxiosResponse) => response;

const errorBody = (err: any) => {
  if (err.response) {
    // Request made and server responded
    console.log("err.response", err.response);
    return JSON.stringify(err.response.data.message);
  } else if (err.request) {
    // The request was made but no response was received
    console.log("err.request", err.request);
    return "Network Failiure, Please Check your network connection!";
  } else {
    // Something happened in setting up the request that triggered an err
    console.log("err", err.message);
    return err.message;
  }
};

const requests = {
  get: (url: string, headers = { ...headerData() }) =>
    instance.get(url, { headers }).then(responseBody).catch(errorBody),

  post: (url: string, body: {}, headers = { ...headerData() }) =>
    instance.post(url, body, { headers }).then(responseBody).catch(errorBody),

  put: (url: string, body: {}, headers = { ...headerData() }) =>
    instance.put(url, body, { headers }).then(responseBody).catch(errorBody),

  delete: (url: string, headers = { ...headerData() }) =>
    instance.delete(url, { headers }).then(responseBody).catch(errorBody),
};

export const User = {
  //// auth
  signIn: (body: { email: string; password: string }) =>
    requests.post(`${URLS.SIGN_IN}`, body),

  //// candidate
  getEnabledCandidates: (limit: number, page: number) =>
    requests.get(`${URLS.GET_ENABLED_CANDIDATES}?limit=${limit}&page=${page}`),
  getDisabledCandidates: (limit: number, page: number) =>
    requests.get(`${URLS.GET_DISABLED_CANDIDATES}?limit=${limit}&page=${page}`),

  createCandidates: (data: any) =>
    requests.post(`${URLS.CREATE_CANDIDATE}`, data),
  getCandidate: (id: string) => requests.get(`${URLS.GET_CANDIDATE}/${id}`),
  updateCandidate: (id: string, data: any) =>
    requests.put(`${URLS.UPDATE_CANDIDATE}/${id}`, data),
  updateCandidateStatus: (id: string) =>
    requests.put(`${URLS.UPDATE_CANDIDATE_STATUS}/${id}`, {}),
  deleteCandidate: (id: string) =>
    requests.delete(`${URLS.DELETE_CANDIDATE}/${id}`),

  getAppliedCandidates: (
    limit: number,
    page: number,
    status: "draft" | "approved" | "rejected"
  ) =>
    requests.get(
      `${
        URLS.GET_APPLIED_CANDIDATE
      }?limit=${limit}&page=${page}&status=${status.toUpperCase()}`
    ),

  // deleteAppliedCandidate: (id: string) =>
  //   requests.delete(`${URLS.DELETE_APPLIED_CANDIDATE}/${id}`),
  rejectMultipleCandidates: (data: { ids: string[] }) =>
    requests.post(`${URLS.REJECT_MULTIPLE_APPLIED_CANDIDATES}`, data),
  changeAppliedCandidateStatus: (
    status: "APPROVED" | "DRAFT" | "REJECTED",
    id: string
  ) => requests.post(`${URLS.APPLIED_CANDIDATE_STATUS}/${status}/${id}`, {}),

  //// skill
  createSkill: (data: CreateSkillType) =>
    requests.post(`${URLS.CREATE_SKILL}`, data),

  getAllSkills: (status?: string) =>
    requests.get(
      `${URLS.GET_ALL_SKILLS}?status=${status ? status : "enabled"}`
    ),
  getSkill: (skillId: string) => requests.get(`${URLS.GET_SKILL}/${skillId}`),
  updateSkill: (data: CreateSkillType, id: string) =>
    requests.put(`${URLS.UPDATE_SKILL}/${id}`, data),
  deleteSkill: (id: string) => requests.delete(`${URLS.DELETE_SKILL}/${id}`),
  updateSkillStatus: (id: string) =>
    requests.put(`${URLS.UPDATE_SKILL_STATUS}/${id}`, {}),

  //// property
  getAllProperties: () => requests.get(`${URLS.GET_ALL_PROPERTIES}`),
  createProperty: (data: { name: string }) =>
    requests.post(`${URLS.CREATE_PROPERTY}`, data),
  deleteProperty: (id: string) =>
    requests.delete(`${URLS.DELETE_PROPERTY}/${id}`),
  updatePropertyStatus: (id: string) =>
    requests.put(`${URLS.UPDATE_PROPERTY_STATUS}/${id}`, {}),

  //// terms and condition
  createTerms: (data: any) => requests.post(`${URLS.CREATE_TERMS}`, data),
  getTerms: () => requests.get(`${URLS.GET_TERMS}`),
  updateTerms: (data: any, id: string) =>
    requests.put(`${URLS.UPDATE_TERMS}/${id}`, data),
  deleteTerm: (id: string) => requests.delete(`${URLS.DELETE_TERM}/${id}`),
  forgotPassword: (data: { email: string }) =>
    requests.post(`${URLS.FORGOT_PASSWORD}`, data),
  resetPassword: (data: { password: string }, token: string) =>
    requests.post(`${URLS.RESET_PASSWORD}/${token}`, data),
};

export const Client = {
  getAllCandidatesClient: (limit: number, page: number) =>
    requests.get(
      `${URLS.GET_ALL_CANDIDATES_CLIENT}?limit=${limit}&page=${page}`
    ),
  getCandidate: (id: string) =>
    requests.get(`${URLS.GET_CANDIDATE_CLIENT}/${id}`),
  getAllSkills: () => requests.get(`${URLS.GET_ALL_SKILLS_CLIENT}`),
  getCandidateBySkill: (skill: string) =>
    requests.get(`${URLS.GET_CANDIDATE_BY_SKILL}/${skill}`),

  getMultipleCandidates: (data: string[]) =>
    requests.post(`${URLS.GET_MULTIPLE_CANDIDATES}`, { ids: data }),

  contactUs: (data: ContactUsFormType) =>
    requests.post(`${URLS.CONTACT_US}`, data),

  searchCandidateBySkillName: (skillName: string) =>
    requests.get(`${URLS.SEARCH_CANDIDATE_BY_SKILL_NAME}/${skillName}`),
  postEnquiryForm: (data: any) => requests.post(`${URLS.ENQUIRY_FORM}`, data),

  // skill user
  getAllSkillsClient: () => requests.get(`${URLS.GET_ALL_SKILLS_CLIENT}`),

  /// apply as developer
  applyAsDeveloper: (data: ApplyAsDeveloperFormType) =>
    requests.post(`${URLS.APPLY_AS_DEVELOPER}`, data),

  postClientFeedback: (data: { email: string; message: string }) =>
    requests.post(`${URLS.CLIENT_FEEDBACK}`, data),

  getCandidateByEmployeeNumber: (employeeNumber: string) =>
    requests.get(`${URLS.GET_CANDIDATE_BY_EMPLOYEE_NUMBER}/${employeeNumber}`),
};
