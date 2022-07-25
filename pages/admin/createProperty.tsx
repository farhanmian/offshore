import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { User } from "../../api/apiServices";
import Delete from "../../components/icons/Delete";
import Edit from "../../components/icons/Edit";
import ButtonSecondary from "../../components/partials/ButtonSecondary";
import HeadingPrimary from "../../components/partials/HeadingPrimary";
import Input from "../../components/partials/Input";
import LoadingComponent from "../../components/partials/Loading/LoadingComponent";
import LoadingSpinner from "../../components/partials/Loading/LoadingSpinner";
import OnOffBtn from "../../components/partials/OnOffBtn";
import { basicInputTemplate } from "../../constant/constant";
import useAuthState from "../../hooks/useAuthState";

const PropertyCard: React.FC<{
  propertyName: string;
  onDelete: () => void;
  onChangeActiveStatus: () => void;
  activeStatus: string;
  deleteLoading: boolean;
}> = ({
  propertyName,

  onDelete,
  onChangeActiveStatus,
  activeStatus,
  deleteLoading,
}) => {
  const changeStatusHandler = () => {
    if (deleteLoading) return;
    onChangeActiveStatus();
  };

  return (
    <div className="flex h-20 items-center justify-between text-black font-medium">
      <p>{propertyName}</p>

      <div className="flex items-center">
        <OnOffBtn
          status={deleteLoading ? "DISABLED" : activeStatus}
          className="mr-[18px]"
          onChangeActiveStatus={changeStatusHandler}
        />
        <span className="mr-[18px] icon" onClick={onDelete}>
          {!deleteLoading ? (
            <Delete />
          ) : (
            <LoadingSpinner spinnerClassName="h-4 w-4" />
          )}
        </span>
      </div>
    </div>
  );
};

const CreateProperty = () => {
  const {
    propertyForm,
    handlePropertyForm,
    postPropertyForm,
    clearPropertyForm,
  } = useAuthState();
  const notifySuccess = (message: string) => toast.success(message);
  const notifyError = (err: string) => toast.error(err);

  const [isLoading, setIsLoading] = useState(false);
  const [createPropertyLoading, setCreatePropertyLoading] = useState(false);
  const [deletePropertyLoading, setDeletePropertyLoading] = useState("");
  const [propertyList, setPropertyList] = useState<{
    properties: [];
    count: number;
  }>({ properties: [], count: 0 });

  useEffect(() => {
    const fetchAllPropertyData = async () => {
      setIsLoading(true);
      try {
        const resp: any = await User.getAllProperties();
        console.log("resp ---", resp);
        if (resp.status !== 200) {
          throw new Error(resp);
        }
        setPropertyList(resp.data);
        setIsLoading(false);
      } catch (err: any) {
        console.log(err);
        notifyError(err.message);
        setIsLoading(false);
      }
    };
    fetchAllPropertyData();
  }, []);

  const propertyFormSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let x: any = { ...propertyList };
      setCreatePropertyLoading(true);
      const resp = await postPropertyForm();
      if (resp && resp.status === 200) {
        console.log("resp property", resp);
        if (resp) {
          x.properties.unshift(resp.data);
          setPropertyList(x);
          clearPropertyForm();
        }
        setCreatePropertyLoading(false);
        notifySuccess("Property created successfully");
      }
    } catch (err: any) {
      console.log(err);
      setCreatePropertyLoading(false);
      notifyError(err.message);
    }
  };

  const deletePropertyHandler = async (id: string) => {
    console.log(id);
    setDeletePropertyLoading(id);
    try {
      const resp = await User.deleteProperty(id);

      if (resp.status !== 200) {
        throw new Error(resp);
      }
      console.log(resp);
      // updating propertyList state
      let x: any = { ...propertyList };
      x.properties = x.properties.filter(
        (item: { id: string }) => item.id !== id
      );
      setPropertyList(x);
      setDeletePropertyLoading("");
      notifySuccess("property deleted successfully");
    } catch (err: any) {
      console.log(err);
      setDeletePropertyLoading("");
      notifyError(err.message);
    }
  };

  const changeActiveStatusHandler = async (id: string) => {
    try {
      const resp: any = await User.updatePropertyStatus(id);
      console.log("updates property status", resp);
      if (resp.status !== 200) return;
      let x = { ...propertyList };
      const data: any = [];
      let updateMessage = "";

      propertyList.properties.map((item: { id: string; status: string }) => {
        if (item.id === id) {
          /// update status and push item
          const updatedData = { ...item };
          updatedData.status =
            item.status === "ENABLED" ? "DISABLED" : "ENABLED";
          data.push(updatedData);

          updateMessage = updatedData.status;
        } else {
          //// push item
          data.push(item);
        }
      });
      x.properties = data;
      setPropertyList(x);
      notifySuccess(
        updateMessage === "ENABLED"
          ? "property successfully enabled"
          : "property successfully disabled"
      );
    } catch (err: any) {
      console.log(err);
      notifyError(err.message);
    }
  };

  return (
    <section className="h-full p-7.5">
      <div className="w-full max-w-[2000px] m-auto text-black">
        <p className="text-xs font-semibold mb-5">All Properties</p>
        <HeadingPrimary heading="Property Type" className="mb-5" />

        <div className="bg-gray6 py-5 px-7.5">
          {/* input container */}
          <form
            className={`${propertyForm.name.error ? "mb-8" : "mb-5"} flex`}
            onSubmit={propertyFormSubmitHandler}
          >
            <Input
              autoFocus
              placeholder="Add a new Skill"
              width="w-full"
              containerClassName="mr-5 px-3 bg-white"
              name="name"
              error={propertyForm.name.error}
              value={propertyForm.name.value}
              handleForm={handlePropertyForm}
              disabled={createPropertyLoading}
            />
            <ButtonSecondary
              className="px-12 h-10"
              type="submit"
              disabled={createPropertyLoading}
            >
              {createPropertyLoading ? (
                <LoadingSpinner spinnerClassName="w-7 h-7" />
              ) : (
                "Add"
              )}
            </ButtonSecondary>
          </form>

          {/* property container */}
          <div className="bg-white py-6 px-5 rounded-lg border border-gray-300">
            {/* headings */}
            <div className="text-gray3 text-xs font-bold mb-4">
              <p>Property Type Name</p>
            </div>

            <div className="w-full border border-blue-400" />

            {/* candidates container */}
            <div className="font-medium text-sm text-black">
              {!isLoading ? (
                propertyList.properties.length > 0 &&
                propertyList.properties.map(
                  (item: { name: string; id: string; status: string }, i) => {
                    return (
                      <PropertyCard
                        deleteLoading={deletePropertyLoading === item.id}
                        activeStatus={
                          item.status === "ENABLED" ? "ENABLED" : "DISABLED"
                        }
                        onChangeActiveStatus={() =>
                          changeActiveStatusHandler(item.id)
                        }
                        onDelete={() => {
                          deletePropertyHandler(item.id);
                        }}
                        key={i}
                        propertyName={item.name}
                      />
                    );
                  }
                )
              ) : (
                <div className="m-auto mt-10">
                  <LoadingComponent
                    message="Fetching..."
                    loadingSpinnerClassName="w-8 h-8"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </section>
  );
};

export default CreateProperty;

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
