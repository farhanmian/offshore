import React from "react";

const SkillsPanel: React.FC<{ data: any; setSelected: () => void }> = ({ data, setSelected }) => {
  return (
    <div className="w-full order-3 my-4">
      <ul className="flex items-center gap-x-14 gap-y-4 flex-wrap mbTab:order-5 mbTab:w-full mbTab:flex-wrap mbTab:justify-between">
        {data.value &&
          data.value.map((item: any) => {
            return (
              <li
                key={item.id}
                className="text-gray3 w-1/6 text-center rounded flex justify-between items-center bg-white py-2 pl-4 pr-2 mbTab:w-[48%] mbTab:mr-0 mbTab:mb-2"
              >
                <button
                  type="submit"
                  className="font-bold px-2 w-50"
                  onClick={() => setSelected(item)}
                >
                  {item.name}
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default SkillsPanel;
