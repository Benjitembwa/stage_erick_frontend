import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/30" />
        <div className="flex min-h-full items-center justify-center p-4">
          <Transition.Child
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
              <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-gray-600 dark:text-gray-300">
                {message}
              </Dialog.Description>
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Annuler
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded"
                >
                  Confirmer
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;
