import React, { useEffect, useState } from "react";
import { User } from "../../api/apiServices";
import ArrowDown from "../../components/icons/ArrowDown";
import Delete from "../../components/icons/Delete";
import ButtonPrimary from "../../components/partials/ButtonPrimary";
import ButtonSecondary from "../../components/partials/ButtonSecondary";
import HeadingPrimary from "../../components/partials/HeadingPrimary";
import Input from "../../components/partials/Input";
import OnOffBtn from "../../components/partials/OnOffBtn";
import Dropdown from "../../components/partials/Dropdown";
import useAuthState from "../../hooks/useAuthState";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import LoadingComponent from "../../components/partials/Loading/LoadingComponent";
import FewMoreQuestionsForm from "../../components/partials/FewMoreQuestionsForm";
import { useAppContext } from "../../store/context/AppContext";
import { stringify } from "querystring";
import TextArea from "../../components/partials/TextArea";

const CandidateInfoCard: React.FC<{
  skillName: string;
  experience: string | number;
  type: string;
  onDelete: () => void;
  onChangeSkillType: () => void;
}> = ({ skillName, experience, onDelete, type, onChangeSkillType }) => {
  const { candidateForm, handleCandidateForm, setCandidateForm } =
    useAuthState();

  return (
    <div className="grid grid-cols-3 h-20 items-center justify-between">
      <p>{skillName}</p>
      <p className="justify-self-center">{experience} Years</p>
      <div className="flex w-full justify-end -ml-3">
        <input
          onChange={onChangeSkillType}
          checked={type === "MAIN" ? true : false}
          type="checkbox"
          className="mr-12 w-5 h-5 cursor-pointer"
        />
        <span className="icon" onClick={onDelete}>
          <Delete />
        </span>
      </div>
    </div>
  );
};

const PropertyCard: React.FC<{
  property: string;
  value: string;
  onDelete: () => void;
}> = ({ property, value, onDelete }) => {
  return (
    <div className="grid grid-cols-6 h-20 items-center justify-between text-black font-medium">
      <p className="col-span-3">{property}</p>
      <p className="col-span-1">{value}</p>

      <div className="flex items-center justify-self-end col-end-7">
        {/* <OnOffBtn className="mr-[18px]" /> */}
        <span className="mr-[18px] icon" onClick={onDelete}>
          <Delete />
        </span>
      </div>
    </div>
  );
};

const CreateCandidate = () => {
  const {
    candidateForm,
    setCandidateForm,
    handleCandidateForm,
    candidateSkillForm,
    candidatePropertyForm,
    handleCandidateSkillForm,
    handleCandidatePropertyForm,
    extractCandidateSkillForm,
    extractCandidatePropertyForm,
    postCandidateForm,
    getCandidate,
    clearCreateCandidateForm,
    clearCandidateSkillForm,
    clearCandidatePropertyForm,
  } = useAuthState();

  const { appliedCandidateData, setAppliedCandidateCount } = useAppContext();

  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);
  const router = useRouter();
  const candidateId = router.query.id;

  const [isLoading, setIsLoading] = useState(false);

  const [skillListData, setSkillListData] = useState<any>([]);

  const [propertyListData, setPropertyListData] = useState<{
    properties: [];
    count: number;
  }>({ properties: [], count: 0 });

  // fetching skill and properties data and updating state
  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        const resp: any = await User.getAllSkills();
        setSkillListData(resp.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchAllPropertyData = async () => {
      try {
        const resp: any = await User.getAllProperties();

        setPropertyListData(resp.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllPropertyData();
    fetchSkillData();
  }, []);

  // fetching candidate info and updating it
  useEffect(() => {
    if (!candidateId) return;

    const fetchCandidateData = async () => {
      setIsLoading(true);
      try {
        // this fn is in authState
        getCandidate(`${candidateId}`);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };

    fetchCandidateData();
  }, [candidateId]);

  //// updating applied candidate data
  useEffect(() => {
    let x = { ...candidateForm };
    Object.keys(appliedCandidateData).map((key) => {
      if (
        key !== "title" &&
        key !== "employeeNumber" &&
        key !== "aboutInfo" &&
        key !== "additionalInfo" &&
        key !== "terms" &&
        key !== "fullTimeJob" &&
        key !== "partTimeJob" &&
        key !== "havePc" &&
        key !== "okWithWorking8To1" &&
        key !== "skills" &&
        key !== "properties" &&
        key !== "id"
      )
        return;

      if (key !== "skills" && key !== "properties" && key !== "id") {
        // does not include skill and property
        if (appliedCandidateData[key].trim().length === 0) return;
        x[key].value = appliedCandidateData[key];
      } else {
        if (appliedCandidateData[key].length === 0) return;
        x.skills = appliedCandidateData.skills;
        x.properties = appliedCandidateData.properties;
      }
    });

    setCandidateForm(x);
  }, [appliedCandidateData]);

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
    handleCandidateSkillForm(data);
    handleCandidateSkillForm(typeData);
  };
  const propertyChangeHandler = (e: { name: string; id: string }) => {
    const data: any = {
      target: { name: "name", value: e.name, id: e.id },
    };

    handleCandidatePropertyForm(data);
  };

  const addSkillHandler = (e: React.FormEvent) => {
    console.log("skill handler");
    let x = { ...candidateForm };
    e.preventDefault();
    try {
      const data: {
        skillName: string;
        experience: string;
        type: string;
        iconUrl: string;
      } = extractCandidateSkillForm();
      console.log(data);
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

      setCandidateForm(x);
      clearCandidateSkillForm();
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
    }
  };
  const removeSkillHandler = (e: number) => {
    let x = { ...candidateForm };
    x.skills.splice(e, 1);
    setCandidateForm(x);
  };

  const removePropertyHandler = (e: number) => {
    let x = { ...candidateForm };
    x.properties.splice(e, 1);
    setCandidateForm(x);
  };

  const addCandidatePropertyHandler = (e: React.FormEvent) => {
    let x = { ...candidateForm };
    e.preventDefault();
    try {
      const data: { name: string; value: string } =
        extractCandidatePropertyForm();
      console.log(data);

      const doesInclude = propertyListData.properties
        .filter((item: { name: string }) => item.name === data.name)
        .pop();

      if (!doesInclude) {
        throw new Error("Select a valid Property!");
      }

      if (x.properties.length === 0 || x.properties[0].name.length === 0) {
        x.properties = [data];
      } else {
        const error = x.properties
          .filter((item) => item.name.toLowerCase() === data.name.toLowerCase())
          .pop();

        if (error) {
          alert("Property already exist");
          return;
        }
        x.properties.push(data);
      }

      console.log("x", x);
      setCandidateForm(x);
      clearCandidatePropertyForm();
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
    }
  };

  const changeSkillTypeHandler = (skillName: string) => {
    console.log("change skill");
    let x = { ...candidateForm };
    const updatedSkills: any = [];
    x.skills.map((item) => {
      if (item.skillName === skillName) {
        const data = { ...item, type: item.type === "MAIN" ? "OTHER" : "MAIN" };

        updatedSkills.push(data);
      } else {
        updatedSkills.push(item);
      }
    });
    x.skills = updatedSkills;
    console.log("x update skillType-----", x);
    setCandidateForm(x);
  };

  const postCandidateFormHandler = async () => {
    try {
      setIsLoading(true);
      const resp: any = await postCandidateForm(
        candidateId ? `${candidateId}` : ""
      );
      if (resp && resp.status === 200) {
        console.log("resp signIn", resp);

        if (appliedCandidateData.id) {
          const deleteAppliedCandidateResp = await User.deleteAppliedCandidate(
            appliedCandidateData.id
          );
          setAppliedCandidateCount((prev) => prev - 1);

          console.log("deleteAppliedCandidateResp", deleteAppliedCandidateResp);
        }

        setIsLoading(false);
        notifySuccess(
          candidateId
            ? "Candidate updated successfully"
            : "Candidate created successfully"
        );
        document
          .getElementById("pageText")
          ?.scrollIntoView({ behavior: "smooth" });
        if (!candidateId) {
          clearCreateCandidateForm();
          return;
        }
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      notifyError(err.message);
    }
  };

  const mainSkills = candidateForm.skills.filter(
    (item) => item.type === "MAIN"
  );

  return (
    <section className="h-full p-7.5">
      <div className="w-full max-w-[2000px] m-auto">
        <p
          id="pageText"
          className="text-xs text-black font-semibold mb-5 leading-5"
        >
          Add a new Candidate
        </p>

        {/* candidate info */}
        <div className="mb-7.5">
          <div className="flex items-center justify-between mb-5">
            <HeadingPrimary heading="Candidate Information" />

            <a className="text-secondary-main text-sm font-bold">
              Go to Properties Page
            </a>
          </div>

          {/* candidate info and form container */}
          <div className="bg-gray6 p-7.5">
            <div>
              {/* employee no and candidate title */}
              <div className="bg-white p-5 rounded-lg mb-7.5 text-black text-sm font-bold border border-gray-300">
                <div
                  className={`grid grid-cols-[150px_minmax(10px,_1fr)] items-center transition100 ${
                    candidateForm.employeeNumber.error ? "mb-8" : "mb-5"
                  }`}
                >
                  <label htmlFor="employeeNo" className="col-span-1">
                    Employee No.
                  </label>
                  <Input
                    disabled={isLoading}
                    id="employeeNo"
                    placeholder=""
                    width="w-full"
                    containerClassName="bg-gray6"
                    name="employeeNumber"
                    value={candidateForm.employeeNumber.value}
                    error={candidateForm.employeeNumber.error}
                    handleForm={handleCandidateForm}
                  />
                </div>
                <div
                  className={`grid grid-cols-[150px_minmax(10px,_1fr)] transition100 items-center ${
                    candidateForm.title.error ? "mb-4" : ""
                  }`}
                >
                  <label htmlFor="candidateTitle" className="col-span-1">
                    Candidate Title
                  </label>
                  <Input
                    disabled={isLoading}
                    id="candidateTitle"
                    placeholder=""
                    width="w-full"
                    containerClassName="bg-gray6"
                    name="title"
                    value={candidateForm.title.value}
                    error={candidateForm.title.error}
                    handleForm={handleCandidateForm}
                  />
                </div>
              </div>

              {/* add skill */}
              <form
                className={`flex transition100 ${
                  candidateSkillForm.experience.error
                    ? "mb-8"
                    : candidateSkillForm.skillName.error
                    ? "mb-8"
                    : "mb-3"
                }`}
              >
                <div className="relative w-full mr-5">
                  <Dropdown
                    error={candidateSkillForm.skillName.error}
                    placeholder="Skills"
                    disabled={isLoading}
                    linkText="Create Skill"
                    link={"/admin/createSkill"}
                    dataList={skillListData}
                    onChange={skillChangeHandler}
                    value={candidateSkillForm.skillName.value}
                    handleForm={handleCandidateSkillForm}
                    inputName="skillName"
                  />
                </div>

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

                <ButtonSecondary
                  className="px-12 h-10"
                  onClick={addSkillHandler}
                >
                  Add
                </ButtonSecondary>
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
                  {candidateForm.skills.length > 0 &&
                  candidateForm.skills[0].skillName.length > 0 ? (
                    candidateForm.skills.map((item, i) => {
                      return (
                        <CandidateInfoCard
                          onChangeSkillType={() => {
                            changeSkillTypeHandler(item.skillName);
                          }}
                          type={item.type}
                          onDelete={() => {
                            removeSkillHandler(
                              candidateForm.skills.indexOf(item)
                            );
                          }}
                          key={i}
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
        </div>

        {/* about employee */}
        <div className="mb-7.5">
          <HeadingPrimary heading="about employee" className="mb-5" />
          <div className="bg-gray6 p-7.5 text-black">
            <div className="relative transition100 mb-7.5">
              <p className="font-bold mb-3">Basic Information</p>
              <TextArea
                disabled={isLoading}
                placeholder="Type your text here..."
                className="w-full p-5 rounded-lg"
                row={6}
                name="aboutInfo"
                value={candidateForm.aboutInfo.value}
                error={candidateForm.aboutInfo.error}
                handleForm={handleCandidateForm}
              />
            </div>
            <div
              className={`relative transition100 ${
                candidateForm.aboutInfo.error ? "mb-5" : ""
              }`}
            >
              <p className="font-bold mb-3">Additional Information</p>
              <TextArea
                disabled={isLoading}
                placeholder="Type your text here..."
                className="w-full p-5 rounded-lg"
                row={6}
                name="additionalInfo"
                value={candidateForm.additionalInfo.value}
                error={candidateForm.additionalInfo.error}
                handleForm={handleCandidateForm}
              />
            </div>
          </div>
        </div>

        {/* additional properties */}
        <div className="mb-7">
          <HeadingPrimary heading="additional properties" className="mb-5" />
          <div className="bg-gray6 p-7.5">
            {/* add properties */}
            <form
              className={`flex transition100 ${
                candidatePropertyForm.name.error
                  ? "mb-8"
                  : candidatePropertyForm.value.error
                  ? "mb-8"
                  : "mb-3"
              }`}
            >
              <div className="relative w-full mr-5">
                <Dropdown
                  placeholder="Property"
                  error={candidatePropertyForm.name.error}
                  linkText="Create Property"
                  disabled={isLoading}
                  link={"/admin/createProperty"}
                  dataList={propertyListData && propertyListData.properties}
                  onChange={propertyChangeHandler}
                  value={candidatePropertyForm.name.value}
                  handleForm={handleCandidatePropertyForm}
                  inputName="name"
                />
              </div>

              <Input
                disabled={isLoading}
                placeholder="Enter Value."
                width="w-full"
                containerClassName="bg-white mr-5"
                name="value"
                value={candidatePropertyForm.value.value}
                error={candidatePropertyForm.value.error}
                handleForm={handleCandidatePropertyForm}
              />

              <ButtonSecondary
                className="px-12 h-10"
                onClick={addCandidatePropertyHandler}
              >
                Add
              </ButtonSecondary>
            </form>

            <div className="bg-white py-6 px-5 rounded-lg border border-gray-300">
              {/* headings */}
              <div className="text-gray3 text-xs font-bold grid grid-cols-6 mb-4">
                <p className="col-span-3">Property Type Name</p>
                <p className="col-span-1">Value</p>
              </div>

              <div className="w-full border border-blue-400" />

              {/* properties container */}
              <div className="font-medium text-sm text-black">
                {candidateForm.properties.length > 0 &&
                candidateForm.properties[0].name.length ? (
                  candidateForm.properties.map(
                    (
                      item: {
                        name: string;
                        value: string;
                      },
                      i
                    ) => {
                      return (
                        <PropertyCard
                          onDelete={() => {
                            removePropertyHandler(
                              candidateForm.properties.indexOf(item)
                            );
                          }}
                          key={i}
                          property={item.name}
                          value={item.value}
                        />
                      );
                    }
                  )
                ) : (
                  <p className="text-center mt-5 font-bold">
                    No Property Added!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* terms and conditions */}
        <div className="mb-10">
          <HeadingPrimary heading="terms & conditions" className="mb-5" />

          <div className="bg-gray6 p-7.5 text-black">
            <p className="text-sm font-bold mb-3">
              Terms & Conditions for the Employee
            </p>
            <div
              className={`relative transition100 ${
                candidateForm.terms.error ? "mb-3  " : ""
              }`}
            >
              <TextArea
                row={6}
                className="w-full rounded-lg p-5"
                placeholder="Type your text here..."
                name="terms"
                value={candidateForm.terms.value}
                handleForm={handleCandidateForm}
                error={candidateForm.terms.error}
              />
            </div>
          </div>
        </div>

        {/* few more question */}
        <FewMoreQuestionsForm
          showAddBtn={false}
          quesData={candidateForm}
          onChange={handleCandidateForm}
        />

        <div className="flex items-center ml-auto w-max mb-10 mt-10">
          {candidateId && (
            <ButtonSecondary
              className="px-14 h-10 w-40 mr-5"
              onClick={() => {
                router.push("/admin/dashboard");
              }}
            >
              Cancel
            </ButtonSecondary>
          )}
          <ButtonPrimary
            className="px-14 h-10 w-40"
            onClick={postCandidateFormHandler}
          >
            {candidateId ? "Update" : "Submit"}
          </ButtonPrimary>
        </div>
      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default CreateCandidate;

export const getServerSideProps = async (context: any) => {
  const { token } = context.req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: "/admin/signIn",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
