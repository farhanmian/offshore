import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import ArrowDown from "../icons/ArrowDown";
import Input from "./Input";

const Dropdown: React.FC<{
  dataList: { name: string; id: string; type: string }[];
  onChange: (e: { name: string; id: string }, type?: string) => void;
  linkText: string;
  link: string;
  placeholder: string;
  error?: string;
  inputName?: string;
  value: string;
  disabled?: boolean;
  handleForm: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}> = ({
  dataList,
  onChange,
  linkText,
  link,
  placeholder,
  error,
  inputName,
  handleForm,
  value,
  disabled,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selectOptionHandler = (name: string, id: string, type: string) => {
    if (inputName === "skillName" && handleForm) {
      const skill: any = { target: { name: "skillName", value: name } };
      const typeData: any = { target: { name: "type", value: type } };

      handleForm(skill);
      handleForm(typeData);
      return;
    } else if (inputName === "name" && handleForm) {
      const data: any = { target: { name: "name", value: name } };
      handleForm(data);
      return;
    }

    const data = { name: name, id: id };
    onChange(data, type);
    setSearchValue(name);
    setShowModal(false);
  };

  const searchHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    // if (name === "skillName" && handleForm) {
    handleForm(e);
    // return;
    // }

    // setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (!showModal) return;
    document.addEventListener("click", (e: any) => {
      if (e.target.id === "dropdown") return;
      setShowModal(false);
    });
  }, [showModal]);

  return (
    <div id="dropdown" className="relative w-full mr-5">
      <Input
        id="dropdown"
        placeholder={placeholder}
        error={error}
        value={value}
        handleForm={searchHandler}
        containerClassName="bg-white"
        name={inputName}
        disabled={disabled}
        onFocus={() => {
          setShowModal(true);
        }}
        icon={
          <span
            onClick={() => {
              setShowModal(!showModal);
            }}
            className={`transition100 cursor-pointer inline-block ${
              showModal ? "rotate-180" : ""
            }`}
          >
            <ArrowDown />
          </span>
        }
      />

      {/* dropdown */}
      {showModal && (
        <div
          id="dropdown"
          className="absolute w-full min-h-[80px] max-h-56 overflow-auto border border-t-0 border-gray-300 bg-white shadow-md rounded-b-md p-3 z-30"
        >
          {dataList && dataList.length > 0 ? (
            dataList.map(
              (item: { name: string; id: string; type: string }, i) => {
                return (
                  item.name
                    .toLowerCase()
                    .includes(value.toLocaleLowerCase()) && (
                    <p
                      id="dropdown"
                      key={item.id}
                      className={`${
                        dataList.length === i + 1 ? "" : "mb-2"
                      } cursor-pointer hover:bg-gray-200 px-1 rounded py-1`}
                      onClick={() => {
                        selectOptionHandler(
                          item.name,
                          item.id,
                          item.type ? item.type : ""
                        );
                      }}
                    >
                      {item.name}
                    </p>
                  )
                );
              }
            )
          ) : (
            <p className="text-center text-sm mt-5 font-bold">
              No Skill Found,{" "}
              <NextLink href={link}>
                <a className="text-secondary-main">{linkText}</a>
              </NextLink>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
