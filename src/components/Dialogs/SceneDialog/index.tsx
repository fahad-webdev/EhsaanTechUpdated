/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Dialog } from "primereact/dialog";
import { Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { buttonStyle } from "@/ui/buttonStyle";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputText } from "primereact/inputtext";

interface SceneDialogProps {
  visibleSceneDialog: boolean;
  setVisibleSceneDialog: (visible: boolean) => void;
  handleSceneSubmit: any;
  onCreateScene: (data: any) => void;
  sceneControl: any;
  loadingCreate: boolean;
}

const SceneDialog: React.FC<SceneDialogProps> = ({
  visibleSceneDialog,
  setVisibleSceneDialog,
  handleSceneSubmit,
  onCreateScene,
  sceneControl,
  loadingCreate,
}) => {
  return (
    <Dialog
      visible={visibleSceneDialog}
      onHide={() => setVisibleSceneDialog(false)}
      header="Create New Scene"
      className="w-[90vw] md:w-3"
    >
      <form onSubmit={handleSceneSubmit(onCreateScene)} className="p-4">
        <Controller
          name="title"
          control={sceneControl}
          render={({ field, fieldState }) => (
            <div className="mb-4">
              <InputText
                {...field}
                className="w-full p-3"
                placeholder="Enter Scene title"
              />
              {fieldState.error && (
                <small className="text-red-500">
                  {fieldState.error.message}
                </small>
              )}
            </div>
          )}
        />
        <Button
          label={loadingCreate ? "Creating..." : "Create"}
          icon="pi pi-plus-circle"
          iconPos="right"
          type="submit"
          className="w-full"
          style={buttonStyle}
          disabled={loadingCreate}
        >
          {loadingCreate && (
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

export default SceneDialog;
