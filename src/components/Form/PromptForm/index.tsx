/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {Control, Controller, FieldErrors} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {Dropdown} from "primereact/dropdown";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import {Tooltip} from "primereact/tooltip";
import {ProgressSpinner} from "primereact/progressspinner";

interface PromptFormProps {
  control: Control<any>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => void;
  errors: FieldErrors<{
    exteriorShort: string;
    character: { id: number; name: string; attributes: string };
    action: { id: number; name: string };
    location: { id: number; name: string };
    combinedText: string;
  }>;
  characterOptions: any[];
  actionOptions: any[];
  locationOptions: any[];
  itemCharacterTemplate: (option: any) => React.ReactNode;
  itemActionTemplate: (option: any) => React.ReactNode;
  itemLocationTemplate: (option: any) => React.ReactNode;
  showCharacterDialog: boolean;
  setShowCharacterDialog: (visible: boolean) => void;
  showActionDialog: boolean;
  setShowActionDialog: (visible: boolean) => void;
  showLocationDialog: boolean;
  setShowLocationDialog: (visible: boolean) => void;
  characterDeleteModalVisible: boolean;
  setCharacterDeleteModalVisible: (visible: boolean) => void;
  actionDeleteModalVisible: boolean;
  setActionDeleteModalVisible: (visible: boolean) => void;
  locationDeleteModalVisible: boolean;
  setLocationDeleteModalVisible: (visible: boolean) => void;
  handleCharacterDeleteOption: (e, id: number) => void;
  handleActionDeleteOption: (e, id: number) => void;
  handleLocationDeleteOption: (e, id: number) => void;
  confirmCharacterDelete: (e: React.MouseEvent) => Promise<void>;
  confirmActionDelete: (e: React.MouseEvent) => Promise<void>;
  confirmLocationDelete: (e: React.MouseEvent) => Promise<void>;
  cancelCharacterDelete: (e: React.MouseEvent) => void;
  cancelActionDelete: (e: React.MouseEvent) => void;
  cancelLocationDelete: (e: React.MouseEvent) => void;
  updatePrompt: boolean;
  isCreatePrompt: boolean;
  isLoading: boolean;
  buttonStyle: React.CSSProperties;
  handleCharacterClick: () => void;
  handleActionClick: () => void;
  handleLocationClick: () => void;
  resetPromptForm: () => void;
  setUpdatePrompt: React.Dispatch<React.SetStateAction<boolean>>;
}

const PromptForm: React.FC<PromptFormProps> = ({
  control,
  handleSubmit,
  errors,
  characterOptions,
  actionOptions,
  locationOptions,
  itemCharacterTemplate,
  itemActionTemplate,
  itemLocationTemplate,
  setShowCharacterDialog,
  setShowActionDialog,
  setShowLocationDialog,
  characterDeleteModalVisible,
  setCharacterDeleteModalVisible,
  actionDeleteModalVisible,
  setActionDeleteModalVisible,
  locationDeleteModalVisible,
  setLocationDeleteModalVisible,
  confirmCharacterDelete,
  cancelCharacterDelete,
  confirmActionDelete,
  cancelActionDelete,
  confirmLocationDelete,
  cancelLocationDelete,
  updatePrompt,
  isLoading,
  buttonStyle,
  handleCharacterClick,
  handleActionClick,
  handleLocationClick,
                                                   resetPromptForm,
                                                   setUpdatePrompt,
}) => {
  return (
      <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-testid="create-form"
      >
      {/* Exterior Short Input */}
      <div className="w-full">
        <Controller
          name="exteriorShort"
          control={control}
          render={({ field }) => (
            <InputText
              {...field}
              placeholder="Write a shot description"
              className="w-full border-round-lg"
            />
          )}
        />
        {errors.exteriorShort && (
          <small className="text-red-500">{errors.exteriorShort.message}</small>
        )}
      </div>

      {/* Dropdowns */}
      <div className="flex flex-wrap gap-4 mt-5">
        {/* Character Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <Controller
            name="character"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={characterOptions}
                placeholder="Character"
                className="w-full border-round-lg"
                itemTemplate={itemCharacterTemplate}
                onClick={() => handleCharacterClick()}
                onChange={(e) => {
                  if (e.value === "create_new") {
                    setShowCharacterDialog(true);
                  } else {
                    field.onChange(e.value);
                  }
                }}
              />
            )}
          />
          {errors.character?.name && (
            <small className="text-red-500">
              {errors.character.name.message}
            </small>
          )}
        </div>

        {/* Action Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <Controller
            name="action"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={actionOptions}
                placeholder="Action"
                className="w-full border-round-lg"
                itemTemplate={itemActionTemplate}
                onClick={() => handleActionClick()}
                onChange={(e) => {
                  if (e.value === "create_new") {
                    setShowActionDialog(true);
                  } else {
                    field.onChange(e.value);
                  }
                }}
              />
            )}
          />
          {errors.action?.name && (
            <small className="text-red-500">{errors.action.name.message}</small>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="flex-1 min-w-[200px]">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={locationOptions}
                placeholder="Environment"
                className="w-full border-round-lg"
                itemTemplate={itemLocationTemplate}
                onClick={() => handleLocationClick()}
                onChange={(e) => {
                  if (e.value === "create_new") {
                    setShowLocationDialog(true);
                  } else {
                    field.onChange(e.value);
                  }
                }}
              />
            )}
          />
          {errors.location?.name && (
            <small className="text-red-500">
              {errors.location.name.message}
            </small>
          )}
        </div>
      </div>

      {/* Combined Text Input */}
      <div className="w-full mt-5">
        <Controller
          name="combinedText"
          control={control}
          render={({ field }) => (
            <div className="flex items-center">
              <div
                id="combinedTextTooltip"
                data-pr-tooltip={field.value}
                data-pr-position="top"
                className="w-full relative"
              >
                <InputText
                  {...field}
                  placeholder="Combined scene description"
                  className="w-full border-round-lg"
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              </div>
              <Tooltip target="#combinedTextTooltip" />
            </div>
          )}
        />
      </div>

      {/* Submit Button */}
          <div className="flex justify-content-center align-items-center gap-4 mt-5">
        <Button
          type="submit"
          label={
            isLoading
                ? updatePrompt
                    ? "Updating..."
                    : "Creating..."
                : updatePrompt
                    ? "Update Prompt"
                : "Create Prompt"
          }
          icon="pi pi-plus-circle"
          iconPos="right"
          className="border-round-lg py-2 px-4 text-lg"
          disabled={isLoading}
          style={buttonStyle}
        >
          {isLoading && (
            <ProgressSpinner
              style={{ width: "20px", height: "20px" }}
              strokeWidth="4"
              animationDuration=".5s"
            />
          )}
        </Button>

              {updatePrompt && (
                  <Button
                      type="button"
                      label="Cancel"
                      icon="pi pi-times"
                      iconPos="right"
                      className="border-round-lg py-2 px-4 text-lg p-button-danger"
                      onClick={() => {
                          resetPromptForm();
                          setUpdatePrompt(false);
                      }}
                  />
              )}
      </div>

      {/* Delete Dialogs */}
      <Dialog
        visible={characterDeleteModalVisible}
        onHide={() => setCharacterDeleteModalVisible(false)}
        header="Confirm Delete"
        footer={
          <div className="flex align-items-center justify-content-center space-x-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={cancelCharacterDelete}
              className="p-button-text"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              onClick={confirmCharacterDelete}
              className="p-button-danger"
              autoFocus
            />
          </div>
        }
      >
        <p>Are you sure you want to delete this character?</p>
      </Dialog>

      <Dialog
        visible={actionDeleteModalVisible}
        onHide={() => setActionDeleteModalVisible(false)}
        header="Confirm Delete"
        footer={
          <div className="flex align-items-center justify-content-center space-x-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={cancelActionDelete}
              className="p-button-text"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              onClick={confirmActionDelete}
              className="p-button-danger"
              autoFocus
            />
          </div>
        }
      >
        <p>Are you sure you want to delete this action?</p>
      </Dialog>

      <Dialog
        visible={locationDeleteModalVisible}
        onHide={() => setLocationDeleteModalVisible(false)}
        header="Confirm Delete"
        footer={
          <div className="flex align-items-center justify-content-center space-x-2">
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={cancelLocationDelete}
              className="p-button-text"
            />
            <Button
              label="Delete"
              icon="pi pi-trash"
              onClick={confirmLocationDelete}
              className="p-button-danger"
              autoFocus
            />
          </div>
        }
      >
        <p>Are you sure you want to delete this environment?</p>
      </Dialog>
    </form>
  );
};

export default PromptForm;
