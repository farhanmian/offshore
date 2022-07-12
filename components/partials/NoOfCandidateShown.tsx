import React from "react";

const NoOfCandidateShown: React.FC<{
  limit: number;
  onChange: (e: number) => void;
}> = ({ limit, onChange }) => {
  return (
    <div className="bg-primaryBlue pl-4 h-10 pr-1.5 flex items-center justify-between ml-auto rounded">
      <p className="text-white text-xs font-medium mr-5">
        No. of Candidates shown
      </p>

      <select
        id="noOfCandidate"
        name="noOfCandidate"
        className="w-30 h-7 rounded focus:outline-none px-3 font-bold"
        value={limit}
        onChange={(e) => {
          //   setLimit(+e.target.value);
          onChange(+e.target.value);
        }}
      >
        <option>10</option>
        <option>15</option>
        <option>20</option>
        <option>25</option>
      </select>
    </div>
  );
};

export default NoOfCandidateShown;
