import { Button } from "./button";

type ResetFormPopupProps = {
  setShowResetModal: (value: boolean) => void;
  confirmReset: () => void;
  title: string;
  description: string;
  cancel: string;
  confirm: string;
};

export const ResetFormPopup: React.FC<ResetFormPopupProps> = ({
  setShowResetModal,
  confirmReset,
  title,
  description,
  cancel,
  confirm,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full space-y-6">
        <h3 className="text-xl font-semibold text-gray-800 text-center">
          {title}
        </h3>
        <p className="text-gray-600 text-center">{description}</p>
        <div className="flex justify-around space-x-4">
          <Button
            onClick={() => setShowResetModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-200"
          >
            {cancel}
          </Button>
          <Button
            onClick={confirmReset}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
          >
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  );
};
