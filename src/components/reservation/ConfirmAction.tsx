import type { ReactElement, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/common/Dialog";
import { Text } from "@/components/common/Text";

interface ConfirmActionProps {
  /** Touchable element that opens the dialog. */
  children: ReactElement<{ onPress?: () => void }>;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  isPending?: boolean;
  /** Renders the trigger without any dialog. */
  disabled?: boolean;
  details?: ReactNode;
}

export const ConfirmAction = ({
  children,
  title,
  description,
  confirmLabel,
  onConfirm,
  isPending,
  disabled,
  details,
}: ConfirmActionProps) => {
  const { t } = useTranslation();

  if (disabled) return children;

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        title={title}
        className="gap-3"
        cancelLabel={t("common.cancel")}
        confirmLabel={confirmLabel}
        onConfirm={onConfirm}
        isPending={isPending}
      >
        <Text>{description}</Text>
        {details}
      </DialogContent>
    </Dialog>
  );
};
