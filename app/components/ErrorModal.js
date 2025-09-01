"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function ErrorModal({ error, onClose }) {
  return (
    <Transition appear show={!!error} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white max-w-md w-full rounded-lg shadow-lg p-6">
              <Dialog.Title className="text-lg font-bold text-gray-900">
                Error
              </Dialog.Title>
              <p className="text-red-600 mt-3">{error}</p>
              <div className="mt-5 flex justify-end">
                <button
                  onClick={onClose}
                  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
