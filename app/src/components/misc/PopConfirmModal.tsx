import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Modal } from "flowbite-react";
import { ReactNode } from "react";

interface Props {
  isOpen: any;
  setIsOpen: (v: any) => void;
  message: string;
  buttons: ReactNode[];
}

export function PopConfirmModal({
  isOpen,
  setIsOpen,
  message,
  buttons,
}: Props) {
  return (
    <Modal show={!!isOpen} size="md" popup onClose={() => setIsOpen(null)}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <ExclamationCircleIcon className="mx-auto mb-4 h-14 w-14 text-gray-400" />
          <h3 className="mb-5 text-lg font-normal text-gray-500">{message}</h3>
          <div className="flex justify-center gap-4">{buttons}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
