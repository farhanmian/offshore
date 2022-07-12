import React from "react";
import Delete from "./icons/Delete";

const Skills: React.FC<{
  id: string;
  skillname: string;
  experience: string;
  setSkills: any;
  skills: any;
}> = ({ id, skillname, experience, setSkills, skills }) => {
  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    let newSkills = [...skills];
    newSkills = newSkills.filter((el) => el.id !== id);
    setSkills(newSkills);
  };
  return (
    <div className="flex w-full justify-between">
      <div className="py-3 pl-4">{skillname}</div>
      <div className="py-4">{experience}</div>
      <input type="checkbox" className="my-5" />
      <span className="w-5 mr-3 hover:cursor-pointer " onClick={handleDelete}>
        <Delete />
      </span>
    </div>
  );
};

export default Skills;
