/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { locationSchema } from "@/schema/create-scene";
import { ProgressSpinner } from "primereact/progressspinner";
import { buttonStyle } from "@/ui/buttonStyle";

interface LocationDialogProps {
  visible: boolean;
  onHide: () => void;
  onSubmit: (data: any) => void;
  isLoadingLocation: boolean;
}

const LocationDialog: React.FC<LocationDialogProps> = ({
  visible,
  onHide,
  onSubmit,
  isLoadingLocation,
}) => {
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
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
      header="Create an Environment"
      className="w-[90vw] md:w-3 border-round-xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-4">
        <div className="space-y-4 p-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <InputText
                  {...field}
                  placeholder="Environment name"
                  className="w-full border-round-lg"
                />
                {fieldState.error && (
                  <small className="text-red-500">
                    {fieldState.error.message}
                  </small>
                )}
              </>
            )}
          />
          <div className="flex justify-content-center">
            <Button
              type="submit"
              label={isLoadingLocation ? "Creating..." : "Create Environment"}
              icon="pi pi-plus-circle"
              iconPos="right"
              className="border-round-lg text-lg mt-5"
              disabled={isLoadingLocation}
              style={buttonStyle}
            >
              {isLoadingLocation && (
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

export default LocationDialog;
