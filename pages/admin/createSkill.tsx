import React, { Fragment, useEffect, useState } from "react";
import Edit from "../../components/icons/Edit";
import HeadingPrimary from "../../components/partials/HeadingPrimary";
import LoadingSpinner from "../../components/partials/Loading/LoadingSpinner";
import Image from "next/image";
import Input from "../../components/partials/Input";
import ButtonPrimary from "../../components/partials/ButtonPrimary";
import useAuthState from "../../hooks/useAuthState";
import { useRouter } from "next/router";
import ButtonSecondary from "../../components/partials/ButtonSecondary";
import toast, { Toaster } from "react-hot-toast";
import NextLink from "next/link";
import { User } from "../../api/apiServices";

const CreateSkill = () => {
  const router = useRouter();
  const skillId = router.query.skillId;
  const {
    skillForm,
    handleSkillForm,
    postSkillForm,
    getSkill,
    clearSkillForm,
  } = useAuthState();
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);
  const [imgUrl, setImgUrl] = useState("");
  // const [skillData, setSkillData] = useState({
  //   id: "",
  //   name: "",
  //   type: "",
  //   status: "",
  //   iconUrl: "",
  // });

  useEffect(() => {
    if (!skillId) return;
    const getSpecificSkill = async () => {
      setIsLoading(true);
      try {
        const resp: any = await getSkill(`${skillId}`);
        console.log("resp specific skill data", resp);
        // setSkillData(resp.data);
        setImgUrl(resp.data.iconUrl);
        setIsLoading(false);
      } catch (err: any) {
        notifyError(err.message);
        setIsLoading(false);
      }
    };
    getSpecificSkill();
  }, [skillId]);

  const skillStatusChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const event: any = { target: { name: "type", value: "MAIN" } };
      handleSkillForm(event);
    } else {
      const event: any = { target: { name: "type", value: "OTHER" } };
      handleSkillForm(event);
    }
  };

  const skillFormSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      /// if skill id is true it will update skill otherwise create new skill
      const resp = await postSkillForm(skillId ? `${skillId}` : "");
      if (resp && resp.status === 200) {
        console.log("resp signIn", resp);
        setIsLoading(false);
        notifySuccess(
          skillId ? "Skill Updated successfully" : "Skill created successfully"
        );
        if (skillId) {
          router.push("/admin/allSkills");
        }
        clearSkillForm();
        setImgUrl("");
      }
    } catch (err: any) {
      console.log(err);
      setIsLoading(false);
      notifyError(err.message);
    }
  };

  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        setImgUrl(e.target.result);
        console.log(e.target.result);
        resolve(reader.result);
      };
      reader.onerror = (error) => reject(error);
    });

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("file", e);
    if (e.target.files) {
      const file: any = e.target.files[0];

      toBase64(file).then((res) => {
        console.log("res", res);
        const imgData: any = { target: { name: "iconUrl", value: res } };
        handleSkillForm(imgData);
      });
    }
  };

  return (
    <section className="h-full p-7.5">
      <div className="w-full max-w-[2000px] m-auto">
        <p className="text-xs text-black font-semibold mb-5">
          {skillId ? "Update Skill" : "Add a new Skill"}
        </p>
        <HeadingPrimary heading="Skill Information" className="mb-5" />

        <form onSubmit={skillFormSubmitHandler}>
          <div className="bg-gray6 p-7.5 mb-10">
            {/* skill icon and add as a min skill container */}
            <div className="flex justify-between mb-7.5">
              {/* icon of the skill */}
              <div>
                <p className="mb-3 font-bold">Icon of the Skill</p>
                <div className="relative m-auto flex w-40 h-40 items-center justify-center rounded border-2 border-white bg-white md:m-0 imageContainer p-3">
                  {imageLoading ? (
                    <div>
                      <LoadingSpinner spinnerClassName="h-5 w-5" />
                    </div>
                  ) : (
                    <Fragment>
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt="img"
                          loader={() => `${imgUrl}`}
                          width={"100%"}
                          height={"100%"}
                          className="overflow-hidden rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full" />
                      )}

                      <div className="absolute bottom-1 right-1 h-7.5 w-7.5 cursor-pointer rounded-full border bg-white p-1.5 shadow-md">
                        <Edit />

                        <input
                          type="file"
                          className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
                          onChange={onImageChange}
                          name="iconUrl"
                          accept="image/*"
                          disabled={isLoading}
                        />
                      </div>
                    </Fragment>
                  )}
                </div>
              </div>
              {/* add as a main skill */}
              <div className="flex h-max items-center">
                <input
                  id="mainSkillCheckbox"
                  type="checkbox"
                  className="w-5 h-5 rounded mr-4"
                  onChange={skillStatusChangeHandler}
                  disabled={isLoading}
                  checked={skillForm.type.value === "MAIN" ? true : false}
                />
                <label
                  htmlFor="mainSkillCheckbox"
                  className="text-gray3 font-bold text-sm"
                >
                  Add as a Main Skill
                </label>
              </div>
            </div>
            {/* name of the skill */}
            <div>
              <p className="font-bold text-sm mb-3">Name of the Skill</p>
              <Input
                autoFocus={true}
                placeholder="Enter"
                width="w-auto"
                rounded="rounded-lg"
                containerClassName="px-5 bg-white"
                name="skillName"
                error={skillForm.skillName.error}
                value={skillForm.skillName.value}
                handleForm={handleSkillForm}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="text-right flex justify-end">
            {skillId && (
              <NextLink href="/admin/allSkills">
                <ButtonSecondary className="px-10 h-10 mr-5">
                  Cancel
                </ButtonSecondary>
              </NextLink>
            )}
            <ButtonPrimary
              disabled={isLoading}
              className="h-10 w-32"
              type="submit"
            >
              {isLoading ? (
                <LoadingSpinner spinnerClassName="h-8 w-8 m-auto" />
              ) : (
                "Submit"
              )}
            </ButtonPrimary>
          </div>
        </form>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default CreateSkill;

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
