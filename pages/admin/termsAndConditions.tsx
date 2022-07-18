import React, { Fragment, useState } from "react";
import { URLS } from "../../api/config";
import Add from "../../components/icons/Add";
import Edit from "../../components/icons/Edit";
import ButtonSecondary from "../../components/partials/ButtonSecondary";
import HeadingPrimary from "../../components/partials/HeadingPrimary";
import Input from "../../components/partials/Input";
import LoadingSpinner from "../../components/partials/Loading/LoadingSpinner";
import useAuthState from "../../hooks/useAuthState";
import Delete from "../../components/icons/Delete";
import toast, { Toaster } from "react-hot-toast";
import { User } from "../../api/apiServices";

const TermsContainer: React.FC<{
  data: {
    id: number;
    name: string;
    heading: string;
    text: string;
  };
  onDeleteTerm: () => void;
}> = ({ data, onDeleteTerm }) => {
  const { updateTermsAndCondition, postTermsAndConditionForm } = useAuthState();
  const [edit, setEdit] = useState(false);
  // const [form, setForm] = useState({ ...data });
  const [form, setForm] = useState({ ...data });
  const [error, setError] = useState({ heading: "", text: "" });
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);

  const handleForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let x = { ...form };
    let y = { ...error };
    const name = e.target.name;
    const value = e.target.value;
    if (name !== "heading" && name !== "text") return;
    x[name] = value;

    if (value.trim().length === 0) {
      y[name] = "Field must not be empty!";
    } else if (name === "heading" && value.trim().length < 5) {
      y.heading = "Minimum character limit is 5";
    } else if (name === "text" && value.trim().length < 10) {
      y.text = "Minimum character limit is 10";
    } else {
      y[name] = "";
    }

    setForm(x);
    setError(y);
  };

  const saveChangesHandler = async () => {
    if (error.heading || error.text) return;
    setEdit(!edit);

    if (!edit) return;

    if (form.heading === data.heading && form.text === data.text) {
      setEdit(false);
      return;
    }
    const updatedData = { heading: form.heading, text: form.text };
    console.log("updatedData", updatedData);

    try {
      // const resp: any = await postTermsAndConditionForm(dataObj);
      const resp: any = await updateTermsAndCondition(
        updatedData,
        `${data.id}`
      );
      if (resp.status !== 200) {
        throw Error(resp);
      }
      console.log("resp update", resp);
      notifySuccess("Terms successfully updated");
    } catch (err: any) {
      console.log(err);
      notifyError(err);
    }
  };

  return (
    <div key={form.id} className={`transition100 ${error ? "mb-10" : "mb-6"}`}>
      <div
        className={`flex items-center transition100 justify-between ${
          error.heading ? "mb-8" : "mb-3"
        }`}
      >
        {!edit ? (
          <h6 className="text-sm font-bold text-black">{form.heading}</h6>
        ) : (
          <Input
            placeholder="Type here..."
            width="w-1/3"
            shadow
            containerClassName="bg-white"
            name="heading"
            value={form.heading}
            handleForm={handleForm}
            error={error.heading}
          />
        )}

        {!edit && (
          <div className="ml-auto flex items-center">
            <span className="mr-3 cursor-pointer" onClick={onDeleteTerm}>
              <Delete />
            </span>
            <span
              className="cursor-pointer"
              onClick={() => {
                setEdit(true);
              }}
            >
              <Edit />
            </span>
          </div>
        )}
        <span className="cursor-pointer p-1" onClick={saveChangesHandler}>
          {edit &&
            (form.heading !== data.heading || form.text !== data.text ? (
              <a className="text-secondary-main text-sm font-bold">Save</a>
            ) : (
              <p className="text-sm font-bold text-red-500">Cancel</p>
            ))}
        </span>
      </div>

      <div className="relative">
        {!edit && (
          <div className="bg-white p-7.5 rounded-lg border border-gray3 leading-7">
            {form.text}
          </div>
        )}
        {edit && (
          <Fragment>
            <textarea
              value={form.text}
              rows={8}
              name="text"
              onChange={handleForm}
              className={`w-full p-7.5 shadow-md rounded-lg border focus:outline-none ${
                error.text
                  ? "border-red-500 focus:border-red-600"
                  : "border-gray3"
              } leading-7`}
            />
            {error.text.length > 0 && (
              <p className="pl-2 pt-2 text-red-700 mt-0.5 text-sm font-medium absolute -bottom-6 left-0">
                {error.text}
              </p>
            )}
          </Fragment>
        )}
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

const TermsAndConditions: React.FC<{
  allTermsData: { data: any[]; id: string };
  data: any;
}> = ({ allTermsData, data }) => {
  const {
    termsAndConditionForm,
    handleTermsAndConditionForm,
    extractTermsAndConditionData,
    postTermsAndConditionForm,
    clearTermsAndConditionForm,
    updateTermsAndCondition,
  } = useAuthState();

  const [termsData, setTermsData] = useState([...allTermsData.data]);
  const [addNewTerms, setAddNewTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);

  const addNewTermsHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = extractTermsAndConditionData();
      setAddNewTerms(false);

      // const dataObj = { terms: [data] };
      // console.log("dataobj", dataObj);

      const resp: any = await postTermsAndConditionForm(data);
      if (resp.status !== 200) {
        throw Error(resp);
      }
      console.log("terms rseponse", resp);
      const id = resp.data.id;

      const updatedTermsData =
        termsData.length > 0
          ? [...termsData, { ...data, id }]
          : [{ ...data, id }];
      setTermsData(updatedTermsData);
      setIsLoading(false);
      notifySuccess("Terms Successfully added");
      clearTermsAndConditionForm();
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      notifyError(err.message);
    }
  };

  const cancelAddNewTerms = () => {
    setAddNewTerms(false);
    clearTermsAndConditionForm();
  };

  const deleteTermHandler = async (id: string) => {
    console.log("delete id", id);
    try {
      const resp: any = await User.deleteTerm(id);
      if (resp.status !== 200) {
        throw Error(resp);
      }
      console.log("resp", resp);
      // const updatedData = termsData.filter((item) => item.id !== id);
      const updatedData = termsData.filter((item) => item.id !== id);

      setTermsData(updatedData);
      notifySuccess("Terms successfully deleted");
    } catch (err: any) {
      console.log(err);
      notifyError(err);
    }
  };

  return (
    <section className="h-full p-7.5">
      <div className="w-full max-w-[2000px] m-auto">
        <p className="text-xs font-semibold text-black mb-5">
          Terms and Conditions
        </p>

        <HeadingPrimary
          heading="Terms and Conditions for Website"
          className="mb-5"
        />

        <div className="px-7.5 py-6 bg-gray6">
          {!isLoading ? (
            <Fragment>
              {termsData.length > 0
                ? termsData.map((item: any, i) => {
                    return (
                      <TermsContainer
                        key={item.id}
                        onDeleteTerm={() => deleteTermHandler(item.id)}
                        data={item}
                      />
                    );
                  })
                : !addNewTerms && (
                    <p className="text-sm text-center font-semibold">
                      No Terms & Condition Found!{" "}
                      <a
                        className="text-secondary-main underline"
                        onClick={() => {
                          setAddNewTerms(true);
                        }}
                      >
                        Add Terms
                      </a>
                    </p>
                  )}

              {/*// add new terms btn */}
              {!addNewTerms && termsData.length > 0 && (
                <button
                  className="mt-10 p-1 rounded shadow-sm border bordergray-300 bg-white cursor-pointer icon w-max ml-auto"
                  onClick={() => {
                    setAddNewTerms(true);
                  }}
                >
                  <Add />
                </button>
              )}

              {/*// add new terms */}
              {addNewTerms && (
                <form
                  className={`transition100 mt-10 flex flex-col ${
                    termsAndConditionForm.text.error ? "mb-6" : ""
                  }`}
                  onSubmit={addNewTermsHandler}
                >
                  <div
                    className={`flex items-center transition100 justify-between ${
                      termsAndConditionForm.heading.error ? "mb-8" : "mb-3"
                    }`}
                  >
                    <Input
                      placeholder="Heading..."
                      width="w-1/3"
                      shadow
                      containerClassName="bg-white"
                      name="heading"
                      border="border-gray-400 hover:border-gray3 focus:border-gray3"
                      autoFocus
                      value={termsAndConditionForm.heading.value}
                      handleForm={handleTermsAndConditionForm}
                      error={termsAndConditionForm.heading.error}
                    />
                  </div>

                  <div className="relative">
                    <textarea
                      value={termsAndConditionForm.text.value}
                      rows={6}
                      placeholder="Type here..."
                      name="text"
                      onChange={handleTermsAndConditionForm}
                      className={`w-full p-7.5 shadow-md rounded-lg border focus:outline-none ${
                        termsAndConditionForm.text.error
                          ? "border-red-500 focus:border-red-600"
                          : "border-gray3"
                      } leading-7`}
                    />
                    {termsAndConditionForm.text.error.length > 0 && (
                      <p className="pl-2 pt-2 text-red-700 mt-0.5 text-sm font-medium absolute -bottom-6 left-0">
                        {termsAndConditionForm.text.error}
                      </p>
                    )}
                  </div>

                  <div className="ml-auto">
                    <ButtonSecondary
                      className="h-10 px-12 mr-5 mt-3"
                      type="button"
                      onClick={cancelAddNewTerms}
                    >
                      cancel
                    </ButtonSecondary>
                    <ButtonSecondary className="h-10 px-12 mt-3">
                      Add
                    </ButtonSecondary>
                  </div>
                </form>
              )}
            </Fragment>
          ) : (
            <div className="flex justify-center p-5">
              <LoadingSpinner spinnerClassName="w-8 h-8" />
            </div>
          )}
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default TermsAndConditions;

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

  const res = await fetch(URLS.GET_TERMS, {
    method: "GET",
    headers: header,
  });

  if (res.status !== 200) {
    return {
      props: {
        allTermsData: { data: [], status: 401 },
      },
    };
  }

  const data = await res.json();
  console.log("data----------", data);

  return {
    props: {
      data,
      // allTermsData: { data: data.terms, id: data.id, status: res.status },
      allTermsData: { data },
    },
  };
};
