import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
// Define an enum for the transaction states
enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  PAUSED = 'PAUSED',
}

interface TransactionAlertDialogProps {
  status: TransactionStatus;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionAlertDialog: React.FC<TransactionAlertDialogProps> = ({ status, isOpen, onClose }) => {
  const getAlertDetails = () => {
    switch (status) {
      case TransactionStatus.SUCCESS:
        return {
          title: 'Transaction Confirmed',
          description: 'The swap was completed successfully.',
          buttonText: 'Continue',
        };
      case TransactionStatus.ERROR:
        return {
          title: 'Transaction Failed',
          description: 'An error occurred while executing the transaction.',
          buttonText: 'Continue',
        };
      case TransactionStatus.PAUSED:
        return {
          title: 'Transaction Paused',
          description: 'The transaction was paused for a while.',
          buttonText: 'Continue',
        };
      default:
        return {
          title: '',
          description: '',
          buttonText: '',
        };
    }
  };

  const { title, description, buttonText } = getAlertDetails();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent onCloseAutoFocus={onClose}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClose}>{buttonText}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TransactionAlertDialog;
