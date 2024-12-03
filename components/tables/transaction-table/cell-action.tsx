"use client";
import { AlertModal } from "@/components/modal/alert-modal";
import { Swap } from "@/types/data";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CellActionProps {
  data: Swap;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirm = async () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
    </>
  );
};
