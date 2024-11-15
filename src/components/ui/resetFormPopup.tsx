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
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={() => setShowResetModal(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
        <p className="text-base text-gray-600 mb-5">{description}</p>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={() => setShowResetModal(false)}
            className="rounded-md px-5 py-2 text-sm font-medium bg-gray-100 text-gray-900 hover:bg-gray-200"
          >
            {cancel}
          </Button>
          <Button
            onClick={confirmReset}
            className="rounded-md bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  );
};