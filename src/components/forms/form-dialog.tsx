'use client';

import { useState, cloneElement } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FormDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  form: React.ReactElement;
}

export function FormDialog({
  trigger,
  title,
  description,
  form,
}: FormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
  };
  
  const formWithOnSuccess = cloneElement(form as React.ReactElement<{ onSuccess?: () => void }>, { onSuccess: handleSuccess });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">{formWithOnSuccess}</div>
      </DialogContent>
    </Dialog>
  );
}
