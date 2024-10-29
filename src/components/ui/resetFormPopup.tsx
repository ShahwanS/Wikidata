import { Button } from './button';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-8 shadow-xl">
        <h3 className="text-center text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-center text-gray-600">{description}</p>
        <div className="flex justify-around space-x-4">
          <Button
            onClick={() => setShowResetModal(false)}
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 transition duration-200 hover:bg-gray-300"
          >
            {cancel}
          </Button>
          <Button
            onClick={confirmReset}
            className="rounded-md bg-red-500 px-4 py-2 text-white transition duration-200 hover:bg-red-600"
          >
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  );
};
