import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "../../api/apiServices";
import Delete from "../../components/icons/Delete";
import Edit from "../../components/icons/Edit";
import HeadingPrimary from "../../components/partials/HeadingPrimary";
import LoadingSpinner from "../../components/partials/Loading/LoadingSpinner";
import OnOffBtn from "../../components/partials/OnOffBtn";
import RoundedButton from "../../components/partials/RoundedButton";
import toast, { Toaster } from "react-hot-toast";
import LoadingComponent from "../../components/partials/Loading/LoadingComponent";
import Image from "next/image";
import noImgFound from "../../assets/img/no-img-found.jpg";

const SkillCard: React.FC<{
  skillName: string;
  candidatesHired: number;
  icon: any;
  id: string;
  onDelete: () => void;
  activeStatus: string;
  onChangeActiveStatus: () => void;
  loading: boolean;
  type: string;
  statusLoading: string;
}> = ({
  skillName,
  candidatesHired,
  icon,
  id,
  onDelete,
  activeStatus,
  onChangeActiveStatus,
  loading,
  type,
  statusLoading,
}) => {
  const router = useRouter();

  const changeStatusHandler = () => {
    if (loading) return;
    onChangeActiveStatus();
  };

  return (
    <div className="grid grid-cols-4 h-20 items-center justify-between text-black font-medium">
      <p className="font-medium">{skillName}</p>
      <p className="justify-self-center font-medium">{candidatesHired}</p>
      <div className="justify-self-center w-[50px] h-[50px] rounded overflow-hidden">
        <Image
          loader={() => icon}
          unoptimized
          width={225}
          height={225}
          src={icon}
          alt="skill-img"
        />
      </div>

      <div className="flex items-center justify-between ">
        <p className="ml-10 font-medium capitalize">
          {type.toLocaleLowerCase()}
        </p>
        <div className="flex items-center">
          {statusLoading !== id ? (
            <OnOffBtn
              className={`mr-[18px] ${
                statusLoading ? "pointer-events-none" : ""
              }`}
              status={!loading ? activeStatus : "DISABLED"}
              onChangeActiveStatus={changeStatusHandler}
            />
          ) : (
            <div className="w-10 mr-[18px]">
              <LoadingSpinner spinnerClassName="h-4 w-4 m-auto" />
            </div>
          )}
          <span className="mr-[18px] icon pointer" onClick={onDelete}>
            {!loading ? (
              <Delete />
            ) : (
              <LoadingSpinner spinnerClassName="h-4 w-4" />
            )}
          </span>
          <span
            className="icon"
            onClick={() => {
              router.push(`/admin/createSkill?skillId=${id}`);
            }}
          >
            <Edit />
          </span>
        </div>
      </div>
    </div>
  );
};

const AllSkills = () => {
  const router = useRouter();
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);
  const [skillDataList, setSkillDataList] = useState<
    {
      name: string;
      candidatesHired: number;
      iconUrl: string;
      id: string;
      status: string;
      type: string;
    }[]
  >([]);
  const [showActiveSkills, setShowActiveSkills] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteSkillLoading, setDeleteSkillLoading] = useState("");
  const [activeStatusLoading, setActiveStatusLoading] = useState("");

  useEffect(() => {
    const fetchSkillData = async () => {
      try {
        setIsLoading(true);
        const resp: any = await User.getAllSkills(
          !showActiveSkills ? "disabled" : ""
        );
        if (resp.status !== 200) {
          throw Error(resp);
        }
        console.log("sillData", resp);

        const alphabetically = [...resp.data].sort((a: any, b: any) =>
          a.name > b.name ? 1 : -1
        );

        setSkillDataList(alphabetically);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    fetchSkillData();
  }, [showActiveSkills]);

  const deleteSkillHandler = async (id: string) => {
    console.log(id);
    setDeleteSkillLoading(id);
    try {
      const resp = await User.deleteSkill(id);

      if (resp.status !== 200) {
        throw new Error(resp);
      }
      console.log(resp);
      // updating SkillList state
      const updatedSkillData = skillDataList.filter(
        (item: { id: string }) => item.id !== id
      );
      setSkillDataList(updatedSkillData);
      setDeleteSkillLoading("");
      notifySuccess("skill delete successfully");
    } catch (err: any) {
      console.log(err);
      setDeleteSkillLoading("");
      notifyError(err.message);
    }
  };

  const changeActiveStatusHandler = async (id: string) => {
    if (activeStatusLoading) return;
    setActiveStatusLoading(id);
    try {
      const resp: any = await User.updateSkillStatus(id);
      console.log("updates skill status", resp);
      if (resp.status !== 200) return;
      const data: any = [];
      skillDataList.map((item: { id: string; status: string }) => {
        if (item.id === id) {
          /// update status and push item
          const updatedData = { ...item };
          updatedData.status =
            item.status === "ENABLED" ? "DISABLED" : "ENABLED";
          data.push(updatedData);
        } else {
          //// push item
          data.push(item);
        }
      });

      setSkillDataList(data);
      notifySuccess("Skill update Successfully");

      setActiveStatusLoading("");
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
      setActiveStatusLoading("");
    }
  };

  return (
    <section className="h-full p-7.5">
      <div className="w-full max-w-[2000px] m-auto text-black">
        <p className="text-xs font-semibold mb-5">All Skills</p>
        <div className="flex items-center justify-between mb-2.5">
          <HeadingPrimary heading="All Skills" />

          <div className="flex items-center">
            <p className="text-gray-3 mr-3 uppercase text-sm font-semibold">
              Show Only
            </p>

            <div className="bg-gray5 flex rounded-full">
              <RoundedButton
                active={showActiveSkills}
                className="w-37.5"
                onClick={() => {
                  setShowActiveSkills(true);
                }}
              >
                Enabled
              </RoundedButton>
              <RoundedButton
                active={!showActiveSkills}
                className="w-37.5"
                onClick={() => {
                  setShowActiveSkills(false);
                }}
              >
                Disabled
              </RoundedButton>
            </div>
          </div>
        </div>

        <div className="bg-white py-6 px-5 rounded-lg border border-gray-300">
          {/* headings */}
          <div className="text-gray3 text-xs font-bold grid grid-cols-4 mb-4">
            <p>Name of the skill</p>
            <p className="justify-self-center">Candidates Hired</p>
            <p className="justify-self-center">Icon Alloted</p>
            <p className="justify-self-start ml-10">Type</p>
          </div>

          <div className="w-full border border-blue-400" />

          {/* skill container */}
          <div className="font-medium text-sm text-black">
            {!isLoading ? (
              skillDataList.length > 0 ? (
                skillDataList.map((item, i) => {
                  return (
                    item.status.includes(
                      `${showActiveSkills ? "ENABLED" : "DISABLED"}`
                    ) && (
                      <SkillCard
                        loading={deleteSkillLoading === item.id}
                        onChangeActiveStatus={() =>
                          changeActiveStatusHandler(item.id)
                        }
                        activeStatus={item.status}
                        onDelete={() => {
                          deleteSkillHandler(item.id);
                        }}
                        key={i}
                        id={item.id}
                        skillName={item.name}
                        candidatesHired={item.candidatesHired}
                        icon={item.iconUrl ? item.iconUrl : noImgFound}
                        type={item.type}
                        statusLoading={activeStatusLoading}
                      />
                    )
                  );
                })
              ) : (
                <div className="flex mt-8 justify-center text-sm">
                  <p className="font-medium">No Skills Found,</p>{" "}
                  <a
                    onClick={() => {
                      router.push("/admin/createSkill");
                    }}
                    className="text-secondary-main ml-1 font-semibold underline"
                  >
                    Create Skills
                  </a>
                </div>
              )
            ) : (
              <div className="m-auto mt-10">
                <LoadingComponent
                  message="Fetching..."
                  loadingSpinnerClassName="h-8 w-8"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default AllSkills;

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
