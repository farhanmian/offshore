import { getCookie, setCookies } from "cookies-next";
import React, { FormEvent, useEffect, useState } from "react";
import { Client } from "../api/apiServices";
import { CandidateDataType } from "../store/types/types";
import Close from "../components/icons/Close";
import ButtonPrimary from "../components/partials/ButtonPrimary";
import Card from "../components/partials/Card";
import HeadingPrimary from "../components/partials/HeadingPrimary";
import Input from "../components/partials/Input";
import TextArea from "../components/partials/TextArea";
import useAuthState from "../hooks/useAuthState";
import NextLink from "next/link";
import toast, { Toaster } from "react-hot-toast";
import LoadingSpinner from "../components/partials/Loading/LoadingSpinner";
import LoadingComponent from "../components/partials/Loading/LoadingComponent";
import { useAppContext } from "../store/context/AppContext";

const FilterItemContainer: React.FC<{
  text: string;
  onRemoveCandidate: () => void;
}> = ({ text, onRemoveCandidate }) => {
  return (
    <Card className="bg-primaryBlue h-10 px-2 md:px-4 rounded flex items-center justify-between text-white">
      <p className="text-sm font-medium md:font-bold mr-4">{text}</p>
      <span onClick={onRemoveCandidate} className="cursor-pointer">
        <Close />
      </span>
    </Card>
  );
};

const Enquiry = () => {
  const { handleEnquiryForm, postEnquiryForm, enquiryForm, clearEnquiryForm } =
    useAuthState();
  const { setHiringListCount } = useAppContext();
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);
  const [isChecked, setIsChecked] = useState({
    checkbox1: false,
    checkbox2: false,
  });
  const [candidatesListData, setCandidatesListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataFetchingLoading, setDataFetchingLoading] = useState(false);
  const [hiringList, setHiringList] = useState<string[]>([]);

  useEffect(() => {
    setDataFetchingLoading(true);
    const fetchHiringCandidatesList = async () => {
      try {
        const hiringList: any = getCookie("hiringList");
        const data = hiringList ? JSON.parse(hiringList) : [];
        setHiringList(data);

        console.log(data);
        const resp = await Client.getMultipleCandidates(data);
        console.log("resp", resp);
        setDataFetchingLoading(false);

        if (resp.status !== 200 && resp.status !== 201) {
          throw new Error(resp);
        }

        setCandidatesListData(resp.data);

        const enquiryFormCandidateDetail: any = [];
        resp.data.map((item: CandidateDataType) => {
          enquiryFormCandidateDetail.push({
            id: item.id,
            employeeNumber: item.employeeNumber,
          });
        });

        const detailData: any = {
          target: {
            name: "candidateDetails",
            value: enquiryFormCandidateDetail,
          },
        };

        handleEnquiryForm(detailData);
      } catch (err: any) {
        console.log(err);
        notifyError(err.message);
        setCandidatesListData([]);
        setDataFetchingLoading(false);
      }
    };
    fetchHiringCandidatesList();
  }, []);

  const condition =
    !isLoading &&
    isChecked.checkbox1 &&
    isChecked.checkbox2 &&
    candidatesListData.length > 0;

  const checkboxChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let x = { ...isChecked };
    const name = e.target.name;
    if (name !== "checkbox1" && name !== "checkbox2") return;
    x[name] = e.target.checked;
    setIsChecked(x);
  };

  const submitFormHandler = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resp: any = await postEnquiryForm();
      console.log(resp);
      setIsLoading(false);
      notifySuccess(
        "your Form is successfully submitted, We will contact you ASAP"
      );
      clearEnquiryForm();
    } catch (err: any) {
      setIsLoading(false);
      console.log(err);
      notifyError(err.message);
    }
  };

  const removeCandidateHandler = (id: string) => {
    const updatedHiringList: any = hiringList.filter((item) => item !== id);
    const updatedCandidateList = candidatesListData.filter(
      (item: { id: string }) => item.id !== id
    );

    setHiringList(updatedHiringList);
    setCookies("hiringList", updatedHiringList);
    setHiringListCount(updatedHiringList.length);
    setCandidatesListData(updatedCandidateList);
  };

  return (
    <section className="h-full px-4 py-7.5 md:p-7.5">
      <div className="max-w-screen-2xl m-auto">
        <p className="text-xs font-semibold text-black mb-5">
          <span className="text-gray3">{`Home > `}</span> Enquiry Form
        </p>

        {!dataFetchingLoading && (
          <div className="border border-gray-300 rounded-lg p-2 py-4 sm:p-5 lg:p-7.5">
            <div className="grid grid-cols-4 justify-between items-center gap-x-5 mb-7.5">
              {candidatesListData.length > 0 ? (
                candidatesListData.map((item: CandidateDataType) => {
                  return (
                    <FilterItemContainer
                      onRemoveCandidate={() => {
                        removeCandidateHandler(item.id);
                      }}
                      key={item.id}
                      text={`${item.employeeNumber} : ${item.title}`}
                    />
                  );
                })
              ) : (
                <p className="min-w-max font-bold text-sm text-red-600">
                  No Candidates Found, Please add{" "}
                  <NextLink href={"/allCandidates"}>
                    <a className="underline underline-offset-1">Candidates</a>
                  </NextLink>{" "}
                  To Hiring List
                </p>
              )}
            </div>
            <hr className="border border-gray-300 mb-7.5" />
            <HeadingPrimary
              heading="Add your information for us to contact"
              className="mb-7.5"
            />

            <form onSubmit={submitFormHandler}>
              {/* message container */}
              <div className="mb-7.5 w-full">
                <p className="text-sm text-black font-bold mb-3">Message</p>

                <TextArea
                  placeholder="Predefined text inside (Hint-I want to enquire...)"
                  className="py-5 px-7.5 w-full resize-none rounded bg-gray6"
                  row={5}
                  name="message"
                  value={enquiryForm.message.value}
                  error={enquiryForm.message.error}
                  handleForm={handleEnquiryForm}
                />
              </div>

              {/* contact info */}
              <div className="mb-7.5">
                <p className="text-sm text-black font-bold mb-3">
                  Contact Info
                </p>
                <div className="rounded-lg border border-gray-300 p-7.5">
                  <span
                    className={`${
                      enquiryForm.email.error ? "mb-8" : "mb-5"
                    } grid grid-cols-12 items-center transition100`}
                  >
                    <label className="text-sm text-gray3 mb-1 sm:mb-0 col-span-2 lg:col-span-1 font-bold min-w-max">
                      Email ID
                    </label>
                    <Input
                      placeholder=""
                      containerClassName="w-full bg-gray6 col-span-12 sm:col-span-10 lg:col-span-11"
                      className="px-3"
                      name="email"
                      value={enquiryForm.email.value}
                      error={enquiryForm.email.error}
                      handleForm={handleEnquiryForm}
                    />
                  </span>
                  <span className="mb-5 grid grid-cols-12 items-center">
                    <label className="text-sm text-gray3 mb-1 sm:mb-0 col-span-2 lg:col-span-1 font-bold min-w-max">
                      Phone No.
                    </label>
                    <Input
                      placeholder=""
                      containerClassName="w-full bg-gray6 col-span-12 sm:col-span-10 lg:col-span-11"
                      className="px-3"
                      name="phone"
                      value={enquiryForm.phone.value}
                      error={enquiryForm.phone.error}
                      handleForm={handleEnquiryForm}
                    />
                  </span>
                </div>
              </div>

              {/* terms and condition */}
              <div className="mb-7.5">
                <p className="text-sm text-black font-bold mb-3">
                  Terms and Conditions
                </p>

                <div className="border border-gray-300 rounded-lg p-7.5">
                  <div>
                    <ul className="pl-5 mb-5">
                      <li className="list-disc">
                        Lorem ipsum dolor sit amet, consectetur{" "}
                        <a className="underline">adipiscing elit</a>, sed do
                        eiusmodr incididunt.
                      </li>
                      <li className="list-disc">
                        Damet, consectetur adipiscing elit,{" "}
                        <a className="underline">sedut labore</a> et dolore
                        magn. Susmodr incididunt ut.
                      </li>
                      <li className="list-disc">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod ut labore et dolore magn{" "}
                        <a className="underline">Susmodr incididunt ut.</a>
                      </li>
                    </ul>

                    {/* checkbox */}
                    <div className="mb-5 flex w-full items-center">
                      <input
                        id="checkbox1"
                        type="checkbox"
                        className="mr-3 min-h-[20px] min-w-[20px] h-5 w-5 input"
                        required
                        name="checkbox1"
                        onChange={checkboxChangeHandler}
                      />
                      <label
                        htmlFor="checkbox1"
                        className="cursor-pointer text-sm font-normal outline-none capitalize text-active"
                      >
                        If sum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod ut labore et dolore magn. Susmodr incididunt
                        ut.
                      </label>
                    </div>
                    <div className="mb-5 flex w-full items-center">
                      <input
                        id="checkbox2"
                        type="checkbox"
                        required
                        name="checkbox2"
                        onChange={checkboxChangeHandler}
                        className="mr-3 min-h-[20px] min-w-[20px] h-5 w-5 input"
                      />
                      <label
                        htmlFor="checkbox2"
                        className="cursor-pointer text-sm font-normal outline-none capitalize text-active"
                      >
                        If sum dolor sit amet, consectetur adipiscing elit, sed
                        do eiusmod ut labore et dolore magn. Susmodr incididunt
                        ut.
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-max ml-auto">
                <ButtonPrimary
                  disabled={!condition}
                  type="submit"
                  className="h-10 w-32 flex items-center justify-center"
                >
                  {isLoading ? (
                    <LoadingSpinner spinnerClassName="h-7 w-7" />
                  ) : (
                    "Submit"
                  )}
                </ButtonPrimary>
              </div>
            </form>
          </div>
        )}

        {dataFetchingLoading && (
          <div className="mt-40">
            <LoadingComponent
              message="Fetching..."
              loadingSpinnerClassName="h-10 w-10"
            />
          </div>
        )}
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default Enquiry;
