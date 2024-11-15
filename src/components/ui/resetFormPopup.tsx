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
    <div className="bg-primary-dark/50 fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-lg bg-accent p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-primary-dark text-lg font-medium">{title}</h3>
          <button
            onClick={() => setShowResetModal(false)}
            className="text-primary-medium hover:text-primary-dark transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
        <p className="text-primary-medium mb-5 text-base">{description}</p>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={() => setShowResetModal(false)}
            variant="outline"
            className="border-primary-light/30 text-primary-dark hover:bg-primary-light/10 bg-accent transition-colors"
          >
            {cancel}
          </Button>
          <Button
            onClick={confirmReset}
            className="bg-destructive text-accent transition-colors hover:bg-destructive/90"
          >
            {confirm}
          </Button>
        </div>
      </div>
    </div>
  );
};
