import React, { useEffect, useState } from "react";
import useAuthState from "../../hooks/useAuthState";
import HeadingPrimary from "./HeadingPrimary";
import IncludesText from "./IncludesText";

const data = [
  {
    heading: "Would you like to have a full time job?",
    options: ["yes", "no"],
    name: "fullTimeJob",
  },
  {
    heading: "Are you open to part-time jobs?",
    options: ["yes", "no"],
    name: "partTimeJob",
  },
  {
    heading:
      "Do you have your own PC/MAC computer, good enough to work on remotely?",
    options: ["PC", "MAC", "no"],
    name: "havePc",
  },
  {
    heading: "Are you ok with working 8AM-1(or 2)PM CET?",
    options: ["yes", "no"],
    name: "okWithWorking8To1",
  },
];

const RadioButton: React.FC<{
  inputName: string;
  text: string;
  className?: string;
  value: string;
  checked: boolean;
}> = ({ inputName, text, className, value, checked }) => {
  return (
    <div
      className={`text-black px-2.5 h-10 rounded-lg border border-gray-300 bg-white flex items-center w-30 gap-2.5 ${className}`}
    >
      <input
        defaultChecked={checked}
        // defaultChecked={value === "yes" || value === "PC"}
        id={`${inputName}${value}`}
        className="w-5 h-5"
        type="radio"
        value={value}
        name={inputName}
      />
      <label
        htmlFor={`${inputName}${value}`}
        className="text-sm font-normal capitalize w-full"
      >
        {text}
      </label>
    </div>
  );
};

const FewMoreQuestionsForm: React.FC<{
  onChange: (e: any) => void;
  className?: string;
  quesData: any;
  onAddQuestion?: () => void;
  showAddBtn?: boolean;
  doesInclude?: boolean;
}> = ({
  onChange,
  className,
  quesData,
  onAddQuestion,
  showAddBtn,
  doesInclude,
}) => {
  const handleChangeFn = (e: any) => {
    const data = { target: { name: e.target.name, value: e.target.value } };
    onChange(data);
  };
  const [quesDataState, setQuesDataState] = useState<any>();

  useEffect(() => {
    setQuesDataState(quesData);
  }, [quesData]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <HeadingPrimary
          heading="Few more Questions"
          className="mb-5 text-black"
        />
        {showAddBtn &&
          (!doesInclude ? (
            <a
              onClick={onAddQuestion}
              className="text-sm font-bold text-secondary-main justify-self-end"
            >
              + Add Questions
            </a>
          ) : (
            <IncludesText />
          ))}
      </div>
      <div
        className="p-7.5 bg-gray6 flex flex-col gap-5 rounded"
        onChange={handleChangeFn}
      >
        {data.map((item, i) => {
          return (
            <div key={i}>
              <p className="text-sm font-bold mb-3">{item.heading}</p>
              <div className="flex gap-5">
                {item.options.map((btn, i) => {
                  return (
                    <RadioButton
                      checked={
                        quesDataState && quesDataState[item.name].value === btn
                      }
                      key={i}
                      value={btn}
                      inputName={item.name}
                      text={btn}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FewMoreQuestionsForm;
