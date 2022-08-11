export type SkillFormType = {
  skillName: string;
  type: string;
  iconUrl: string;
  candidatesHired: string;
};
export type CreateSkillType = {
  name: string;
  type: string;
  iconUrl: string;
  candidatesHired: string;
};

export type SkillType = {
  id: string;
  name: string;
  type: string;
  iconUrl: string;
  createdAt: string;
  updatedAt: string;
};
export type ContactUsFormType = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type CandidateDataType = {
  title: string;
  employeeNumber: string;
  aboutInfo: string;
  additionalInfo: string;
  terms: string;
  skills: {
    skillName: string;
    iconUrl: string;
    experience: string;
    type: string;
    skillsId?: string;
  }[];
  properties: { name: string; value: string; propertiesId?: string }[];
  fullTimeJob: string;
  partTimeJob: string;
  havePc: string;
  okWithWorking8To1: string;
  id: string;
  status: string;
};

export type CandidateSkillDataType = {
  name: string;
  id: string;
  experience: string;
  type: string;
};

export type ApplyAsDeveloperFormType = {
  title: string;
  aboutInfo: string;
  additionalInfo: string;
  overallExperience: string;
  noticePeriod: string;

  languages: { language: string; rating: string; id?: string }[];
  skills: {
    skillName: string;
    iconUrl: string;
    experience: string;
    type: string;
    id?: string;
  }[];

  /// extra question
  fullTimeJob: string;
  partTimeJob: string;
  havePc: string;
  okWithWorking8To1: string;
  id?: string;
  CV: string;
};
