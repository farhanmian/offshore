import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import ExperienceList from './ExperienceList';
import SettingsIcon from './icons/SettingsIcon';

export default function ExperienceDialog({
  selectedExperience,
  setSelectedExperience,
  experiences,
  state,
  data,
  stateData,
}: any) {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    const newFilter: any = {
      skill: data.skill,
      experience: selectedExperience,
    };

    const isExist: any = stateData.findIndex((data: any) => data.skill.id === newFilter.skill.id);

    if (isExist >= 0) {
      state.updateAt(isExist, newFilter);
    } else {
      state.insertAt(0, newFilter);
    }

    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button type="button" onClick={openModal}>
        <SettingsIcon />
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                    Skill Name
                  </Dialog.Title>
                  <span className="block w-full h-[1px] bg-black my-2"></span>
                  <Dialog.Description as="p" className="font-bold text-sm my-5">
                    Years of Experience
                  </Dialog.Description>
                  <div className="mt-2">
                    <ExperienceList
                      experiences={experiences}
                      selectedExperience={selectedExperience}
                      setSelectedExperience={setSelectedExperience}
                    />
                  </div>

                  <div className="mt-10 flex justify-end items-center">
                    <button
                      type="button"
                      className="text-sm font-bold py-2 mr-4 min-w-[8rem] rounded-sm tracking-wider bg-white text-secondary-main shadow-full hover:bg-secondary-main hover:bg-opacity-10"
                      onClick={closeModal}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="text-sm min-w-[8rem] font-bold py-2 rounded-sm tracking-wider bg-secondary-main text-white hover:bg-secondary-dark"
                      onClick={closeModal}
                    >
                      Submit
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
