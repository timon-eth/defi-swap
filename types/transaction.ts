enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  PAUSED = 'PAUSED',
}

export interface TransactionAlertDialogProps {
  status: TransactionStatus;
  isOpen: boolean;
  onClose: () => void;
}