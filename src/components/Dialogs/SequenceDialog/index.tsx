/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Dialog } from "primereact/dialog";
import { Controller, Control, FieldError } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

interface SequenceTitleDialogProps {
  visible: boolean;
  onHide: () => void;
  header: string;
  className?: string;
  handleSubmit: (
    onSubmit: (data: any) => void
  ) => (e?: React.BaseSyntheticEvent) => void;
  control: Control<any>;
  onSubmit: (data: any) => void;
  buttonStyle?: React.CSSProperties;
  isLoadingSequence: boolean;
}

const SequenceTitleDialog: React.FC<SequenceTitleDialogProps> = ({
  visible,
  onHide,
  header,
  className,
  handleSubmit,
  control,
  onSubmit,
  buttonStyle,
  isLoadingSequence
}) => {
  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={header}
      className={className}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <div className="mb-4">
              <InputText
                {...field}
                className="w-full p-3"
                placeholder="Enter sequence title"
              />
              {fieldState.error && (
                <small className="text-red-500">
                  {(fieldState.error as FieldError).message}
                </small>
              )}
            </div>
          )}
        />
        <Button
          label={isLoadingSequence ? "Creating..." : "Create"}
          icon="pi pi-plus-circle"
          iconPos="right"
          type="submit"
          className="w-full"
          style={buttonStyle}
          disabled={isLoadingSequence}
        >
          {isLoadingSequence && (
            <ProgressSpinner
              style={{ width: "20px", height: "20px" }}
              strokeWidth="4"
              animationDuration=".5s"
            />
          )}
        </Button>
      </form>
    </Dialog>
  );
};

export default SequenceTitleDialog;
