import { Switch } from "@headlessui/react";

export default function ToggleButton({
  toggleEnabled,
  setToggleEnabled,
}: {
  toggleEnabled: boolean;
  setToggleEnabled: any;
}) {
  return (
    <div className="bg-white py-2 mt-4 rounded-full flex justify-between items-center pl-2 pr-4 font-bold w-40">
      <Switch
        checked={toggleEnabled}
        onChange={setToggleEnabled}
        className={`${toggleEnabled ? "bg-lightGreen" : "bg-gray4"}
          relative inline-flex h-6 w-[3.25rem] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${toggleEnabled ? "translate-x-7 bg-white" : "translate-x-0 bg-gray3"}
            pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
      <p className="text-sm text-black ml-12">{toggleEnabled ? "Or" : "And"}</p>
    </div>
  );
}
