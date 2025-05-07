/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { characterSchema } from "@/schema/create-scene";
import { ProgressSpinner } from "primereact/progressspinner";
import { buttonStyle } from "@/ui/buttonStyle";

interface CharacterDialogProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  isLoadingCharacter: boolean;
}

const CharacterDialog: React.FC<CharacterDialogProps> = ({
  visible,
  onHide,
  onSubmit,
  isLoadingCharacter,
}) => {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(characterSchema),
    defaultValues: {
      name: "",
      attributes: "",
    },
  });

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header="Create a Character"
      className="w-[90vw] md:w-3"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-4">
        <div className="space-y-4 p-4 w-full">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-column">
                <InputText
                  {...field}
                  placeholder="Character name"
                  className="w-full border-round-lg"
                />
                {fieldState.error && (
                  <small className="text-red-500 mt-1">
                    {fieldState.error.message}
                  </small>
                )}
              </div>
            )}
          />
          <Controller
            name="attributes"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-column mt-5">
                <InputText
                  {...field}
                  placeholder="Character description"
                  className="w-full border-round-lg"
                />
                {fieldState.error && (
                  <small className="text-red-500 mt-1">
                    {fieldState.error.message}
                  </small>
                )}
              </div>
            )}
          />
          <div className="flex justify-content-center">
            <Button
              type="submit"
              label={isLoadingCharacter ? "Creating..." : "Create Character"}             icon="pi pi-plus-circle"
              iconPos="right"
              className="border-round-lg text-lg mt-5"
              disabled={isLoadingCharacter}
              style={buttonStyle}
            >
              {isLoadingCharacter && (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="4"
                  animationDuration=".5s"
                />
              )}
            </Button>
          </div>
        </div>
      </form>
    </Dialog>
  );
};

export default CharacterDialog;
