/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {useEffect, useMemo, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "primereact/button";
import {Carousel} from "primereact/carousel";
import {Action, Character, Location, Sequence} from "@/types/sequence";
import {sceneSchema, sequenceSchema} from "@/schema/create-scene";
import {getAction, getCharacter, getLocation, getSingleScene,} from "@/services/scene";
import {buttonStyle} from "@/ui/buttonStyle";
import {SingleScenes} from "@/types/scene";
import {useRouter, useSearchParams} from "next/navigation";
import {createFrame, getFrameBySequenceId, updateFrameByFrameId,} from "@/services/frame";
import SkeletonForm from "@/ui/skeleton";
import toast from "react-hot-toast";
import "./style.css";
import "../../app/globals.css";
import SequenceTemplate from "../Sequence";
import CharacterDialog from "../Dialogs/CharacterDialog";
import ActionDialog from "../Dialogs/ActionDialog";
import LocationDialog from "../Dialogs/LocationDialog";
import SequenceTitleDialog from "../Dialogs/SequenceDialog";
import PromptForm from "../Form/PromptForm";
import {
  cancelActionDelete,
  cancelCharacterDelete,
  cancelLocationDelete,
  confirmActionDelete,
  confirmCharacterDelete,
  confirmLocationDelete,
  fetchSequences,
  getActionOptions,
  getCharacterOptions,
  getLocationOptions,
  handleActionDeleteOption,
  handleCharacterDeleteOption,
  handleCreateMidJourneyImages,
  handleDeleteImage,
  handleImageVariation,
  handleLocationDeleteOption,
  handleReGenerateMidJourneyImages,
  handleUpdatePromptForm,
  onCreateSequence,
  onSubmitAction,
  onSubmitCharacter,
  onSubmitLocation,
} from "@/utils/scenehandlers";

const CreateSceneForm = () => {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSequenceDialog, setShowSequenceDialog] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showCharacterDialog, setShowCharacterDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSequence, setIsLoadingSequence] = useState(false);
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(false);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [scene, setScene] = useState<SingleScenes>();
  const [selectedImages, setSelectedImages] = useState({});
  const [loadingPromptId, setLoadingPromptId] = useState(null);
  const [isLoadingSequences, setIsLoadingSequences] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | number[] | null>(
      null,
  );
  const [loadingVariation, setLoadingVariation] = useState(null);
  const [updatePrompt, setUpdatePrompt] = useState(false);
  const [isCreatePrompt, setIsCreatePrompt] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [characterDeleteModalVisible, setCharacterDeleteModalVisible] =
      useState<boolean>(false);
  const [actionDeleteModalVisible, setActionDeleteModalVisible] =
      useState(false);
  const [locationDeleteModalVisible, setLocationDeleteModalVisible] =
      useState(false);
  const [characterId, setCharacterId] = useState<number | null>(null);
  const [actionId, setActionId] = useState<number | null>(null);
  const [locationId, setLocationId] = useState<number | null>(null);
  const [promptIds, setPromptIds] = useState<number | null>(null);
  const [updateCharacter, setUpdateCharacter] = useState(false);
  const [updateAction, setUpdateAction] = useState(false);
  const [updateLocation, setUpdateLocation] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const sceneIdParam = searchParams.get("sceneId") || null;
  const id =
      sceneIdParam && !isNaN(Number(sceneIdParam)) ? Number(sceneIdParam) : null;

  const {
    control: sequenceControl,
    handleSubmit: handleSequenceSubmit,
    reset: resetSequenceForm,
  } = useForm({
    resolver: zodResolver(sequenceSchema),
    defaultValues: {
      title: "",
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset: resetPromptForm,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sceneSchema),
    defaultValues: {
      exteriorShort: "",
      character: { id: null, name: "", attributes: "" },
      action: { id: null, name: "" },
      location: { id: null, name: "" },
      combinedText: "",
    },
  });

  const exteriorShort = watch("exteriorShort");
  const character = watch("character");
  const action = watch("action");
  const location = watch("location");

  const characterOptions = useMemo(
    () => getCharacterOptions(characters),
      [characters],
  );

  const actionOptions = useMemo(() => getActionOptions(actions), [actions]);
  const locationOptions = useMemo(
      () => getLocationOptions(locations),
      [locations],
  );

  const itemCharacterTemplate = (option) => {
    return (
      <div className="flex align-items-center justify-content-between w-full">
        <span>{option.label}</span>
        {option.value !== "create_new" && (
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCharacterDeleteOption(
                  setCharacterId,
                  setCharacterDeleteModalVisible,
              )(e, option.value.id);
            }}
            onClick={(e) => e.preventDefault()}
          />
        )}
      </div>
    );
  };

  const itemActionTemplate = (option) => {
    return (
      <div className="flex align-items-center w-full">
        <span>{option.label}</span>
        {option.value !== "create_new" && (
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleActionDeleteOption(
                  setActionId,
                  setActionDeleteModalVisible,
              )(e, option.value.id);
            }}
            onClick={(e) => e.preventDefault()}
          />
        )}
      </div>
    );
  };

  const itemLocationTemplate = (option) => {
    return (
      <div className="flex align-items-center w-full">
        <span>{option.label}</span>
        {option.value !== "create_new" && (
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLocationDeleteOption(
                  setLocationId,
                  setLocationDeleteModalVisible,
              )(e, option.value.id);
            }}
            onClick={(e) => e.preventDefault()}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!id) return;
    const loadSceneData = async () => {
      const response = await getSingleScene(id);
      setScene(response.data);
    };
    loadSceneData();
  }, [id]);

  useEffect(() => {
    if (!updatePrompt || updateCharacter || updateAction || updateLocation) {
      const combined = `${exteriorShort} ${character.attributes} ${action.name} ${location.name}`;
      setValue("combinedText", combined, { shouldValidate: true });
      setUpdateCharacter(false);
      setUpdateAction(false);
      setUpdateLocation(false);
    }
  }, [
    exteriorShort,
    character,
    action,
    location,
    setValue,
    updatePrompt,
    updateCharacter,
    updateAction,
    updateLocation,
  ]);

  const handleCharacterClick = () => {
    setUpdateCharacter(true);
  };

  const handleActionClick = () => {
    setUpdateAction(true);
  };

  const handleLocationClick = () => {
    setUpdateLocation(true);
  };

  useEffect(() => {
    const loadData = async () => {
      const characterResponse = await getCharacter();
      setCharacters(characterResponse.data);

      const actionResponse = await getAction();
      setActions(actionResponse.data);

      const locationResponse = await getLocation();
      setLocations(locationResponse.data);
    };
    fetchSequences(id, currentIndex, setIsLoadingSequences, setSequences);
    loadData();
  }, [currentIndex, id]);

  useEffect(() => {
    const frames =
        (sequences[currentIndex]?.prompts as any)?.data?.frames || [];
    const pendingFrames =
        (sequences[currentIndex]?.prompts as any)?.data?.pendingFrames || [];

    if (sequences.length > 0 && frames.length > 0) {
      const firstPromptIds =
          pendingFrames.length > 0
              ? pendingFrames.map((frame: any) => frame.id).join(",")
          : `${frames[0].id}`;

      setActiveIndex(0);
      handleCreateMidJourneyImages(
          firstPromptIds,
          setSelectedImages,
          setLoadingPromptId,
          setIsCreatePrompt,
          setPromptIds,
      );
    }
  }, [sequences, currentIndex]);

  const onSubmit = async (data) => {
    if (!sequences || sequences.length === 0) {
      toast.error("No sequences available.");
      return;
    }
    const activeSequence = sequences[currentIndex];
    const payload = {
      sequenceId: activeSequence?.id,
      characterId: data?.character.id,
      environmentId: data?.location.id,
      actionId: data?.action.id,
      shot: data?.exteriorShort,
      prompt: data?.combinedText,
    };
    setIsLoading(true);
    try {
      if (selectedPromptId) {
        await updateFrameByFrameId(selectedPromptId, payload);
        await handleCreateMidJourneyImages(
          selectedPromptId,
          setSelectedImages,
          setLoadingPromptId,
          setIsCreatePrompt,
            setPromptIds,
        );
        setActiveIndex(activeIndex);
        setUpdatePrompt(false);
      } else {
        await createFrame(payload);
      }
      resetPromptForm();
      const frame = await getFrameBySequenceId(activeSequence.id!);
      const updatedSequences = sequences.map((seq, index) =>
          index === currentIndex ? {...seq, prompts: frame} : seq,
      );
      setSequences(updatedSequences);
      setSelectedPromptId(null);
    } catch (error) {
      console.error("Error in onSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container border-round-xl">
      <h1 className="text-center flex align-items-center justify-content-center">
        {scene?.title}
      </h1>
      <div className="mt-6 m-8 border-round-xl ">
        {isLoadingSequences ? (
          <SkeletonForm />
        ) : sequences.length === 0 ? (
          <>
            <div className="flex justify-content-center">
              <div className="text-center flex justify-content-center sm:justify-content-between flex-wrap gap-2 p-4 shadow-2 border-round w-full lg:w-10">
                <div>
                  <Button
                    label="Back"
                    icon="pi pi-chevron-left"
                    iconPos="left"
                    className="p-button-lg"
                    onClick={() => router.back()}
                    style={buttonStyle}
                  />
                </div>
                <Button
                  label="Add Sequence"
                  icon="pi pi-plus-circle"
                  iconPos="right"
                  className="p-button-lg"
                  onClick={() => setShowSequenceDialog(true)}
                  style={buttonStyle}
                  disabled
                />
              </div>
            </div>
            <div className="col-12 text-center text-gray-700 text-xl my-8">
              No Sequence Created Yet.
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-content-center">
              <div className="text-center flex justify-content-center sm:justify-content-between flex-wrap gap-2 p-4 shadow-2 border-round w-full lg:w-10">
                <div>
                  <Button
                    label="Back"
                    icon="pi pi-chevron-left"
                    iconPos="left"
                    className="p-button-lg"
                    onClick={() => router.back()}
                    style={buttonStyle}
                  />
                </div>
                {sequences.length > 0 && (
                  <Button
                    label="Add Sequence"
                    icon="pi pi-plus-circle"
                    iconPos="right"
                    className="p-button-lg"
                    onClick={() => setShowSequenceDialog(true)}
                    style={buttonStyle}
                  />
                )}
              </div>
            </div>
            <div className="flex align-items-center justify-content-center my-6 border-round">
              <div className="surface-card p-4 shadow-2 border-round w-full lg:w-10">
                <div className="text-center mb-5">
                  <h1 className="text-black font-medium">
                    {updatePrompt ? "Edit Prompt" : "Add a New Prompt"}
                  </h1>
                </div>
                <PromptForm
                  control={control}
                  handleSubmit={handleSubmit(onSubmit)}
                  errors={errors}
                  characterOptions={characterOptions}
                  actionOptions={actionOptions}
                  locationOptions={locationOptions}
                  itemCharacterTemplate={itemCharacterTemplate}
                  itemActionTemplate={itemActionTemplate}
                  itemLocationTemplate={itemLocationTemplate}
                  showCharacterDialog={showCharacterDialog}
                  setShowCharacterDialog={setShowCharacterDialog}
                  showActionDialog={showActionDialog}
                  setShowActionDialog={setShowActionDialog}
                  showLocationDialog={showLocationDialog}
                  setShowLocationDialog={setShowLocationDialog}
                  characterDeleteModalVisible={characterDeleteModalVisible}
                  setCharacterDeleteModalVisible={
                    setCharacterDeleteModalVisible
                  }
                  actionDeleteModalVisible={actionDeleteModalVisible}
                  setActionDeleteModalVisible={setActionDeleteModalVisible}
                  locationDeleteModalVisible={locationDeleteModalVisible}
                  setLocationDeleteModalVisible={setLocationDeleteModalVisible}
                  handleCharacterDeleteOption={(e, id) =>
                      handleCharacterDeleteOption(
                          setCharacterId,
                          setCharacterDeleteModalVisible,
                      )(e, id)
                  }
                  handleActionDeleteOption={(e, id) =>
                      handleActionDeleteOption(
                          setActionId,
                          setActionDeleteModalVisible,
                      )(e, id)
                  }
                  handleLocationDeleteOption={(e, id) =>
                      handleLocationDeleteOption(
                          setLocationId,
                          setLocationDeleteModalVisible,
                      )(e, id)
                  }
                  confirmCharacterDelete={(e) =>
                      confirmCharacterDelete(
                          characterId,
                          setCharacters,
                          setCharacterDeleteModalVisible,
                      )(e)
                  }
                  confirmActionDelete={(e) =>
                      confirmActionDelete(
                          actionId,
                          setActions,
                          setActionDeleteModalVisible,
                      )(e)
                  }
                  confirmLocationDelete={(e) =>
                      confirmLocationDelete(
                          locationId,
                          setLocations,
                          setLocationDeleteModalVisible,
                      )(e)
                  }
                  cancelCharacterDelete={() =>
                      cancelCharacterDelete(setCharacterDeleteModalVisible)
                  }
                  cancelActionDelete={() =>
                      cancelActionDelete(setActionDeleteModalVisible)
                  }
                  cancelLocationDelete={() =>
                      cancelLocationDelete(setLocationDeleteModalVisible)
                  }
                  updatePrompt={updatePrompt}
                  isCreatePrompt={isCreatePrompt}
                  isLoading={isLoading}
                  buttonStyle={buttonStyle}
                  handleCharacterClick={handleCharacterClick}
                  handleActionClick={handleActionClick}
                  handleLocationClick={handleLocationClick}
                  resetPromptForm={resetPromptForm}
                  setUpdatePrompt={setUpdatePrompt}
                />
                <CharacterDialog
                  visible={showCharacterDialog}
                  onHide={() => setShowCharacterDialog(false)}
                  onSubmit={(data) =>
                      onSubmitCharacter(
                          data,
                          setIsLoadingCharacter,
                          setCharacters,
                          setShowCharacterDialog,
                      )
                  }
                  isLoadingCharacter={isLoadingCharacter}
                />
                <ActionDialog
                  visible={showActionDialog}
                  onHide={() => setShowActionDialog(false)}
                  onSubmit={(data) =>
                      onSubmitAction(
                          data,
                          setIsLoadingAction,
                          setActions,
                          setShowActionDialog,
                      )
                  }
                  isLoadingAction={isLoadingAction}
                />
                <LocationDialog
                  visible={showLocationDialog}
                  onHide={() => setShowLocationDialog(false)}
                  onSubmit={(data) =>
                      onSubmitLocation(
                          data,
                          setIsLoadingLocation,
                          setLocations,
                          setShowLocationDialog,
                      )
                  }
                  isLoadingLocation={isLoadingLocation}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {!isLoadingSequences && sequences.length === 0 && (
        <div className="text-center">
          <Button
            label="Create Sequence"
            icon="pi pi-plus-circle"
            iconPos="right"
            className="p-button-lg"
            onClick={() => setShowSequenceDialog(true)}
            style={buttonStyle}
          />
        </div>
      )}

      {!isLoadingSequences && sequences?.length > 0 && (
        <div className="p-4 border-round my-8 w-full lg:w-10 sm:w-8 mx-auto">
          <Carousel
            value={sequences}
            numVisible={1}
            numScroll={1}
            page={currentIndex}
            onPageChange={(e) => setCurrentIndex(e.page)}
            className="custom-carousel"
            itemTemplate={(sequence) => (
              <SequenceTemplate
                sequence={sequence}
                setSequences={setSequences}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                loadingPromptId={loadingPromptId}
                selectedImages={selectedImages}
                loadingVariation={loadingVariation}
                handleCreateMidJourneyImages={(promptId) =>
                    handleCreateMidJourneyImages(
                        promptId,
                        setSelectedImages,
                        setLoadingPromptId,
                        setIsCreatePrompt,
                        setPromptIds,
                    )
                }
                handleReGenerateMidJourneyImages={(promptId) =>
                    handleReGenerateMidJourneyImages(
                    promptId,
                    setSelectedImages,
                    setLoadingPromptId,
                    setIsCreatePrompt,
                        setPromptIds,
                    )
                }
                handleUpdatePromptForm={(id, index) =>
                    handleUpdatePromptForm(
                        id,
                        index,
                        setActiveIndex,
                        setUpdatePrompt,
                        setSelectedPromptId,
                        setValue,
                        characterOptions,
                        actionOptions,
                        locationOptions,
                    )
                }
                handleDeleteImage={(id, promptId) =>
                    handleDeleteImage(id, promptId, setSelectedImages)
                }
                handleImageVariation={(id) =>
                    handleImageVariation(
                        id,
                        promptIds,
                        setLoadingVariation,
                        (promptId) =>
                            handleCreateMidJourneyImages(
                                promptId,
                                setSelectedImages,
                                setLoadingPromptId,
                                setIsCreatePrompt,
                                setPromptIds,
                            ),
                  )
                }
              />
            )}
            showNavigators
            showIndicators
          />
        </div>
      )}

      <SequenceTitleDialog
        visible={showSequenceDialog}
        onHide={() => setShowSequenceDialog(false)}
        header="Create New Sequence"
        className="w-[90vw] md:w-3"
        handleSubmit={handleSequenceSubmit}
        control={sequenceControl}
        onSubmit={(data) =>
            onCreateSequence(
                data,
                id,
                setIsLoadingSequence,
                setSequences,
                setCurrentIndex,
                resetSequenceForm,
                setShowSequenceDialog,
            )
        }
        buttonStyle={buttonStyle}
        isLoadingSequence={isLoadingSequence}
      />
    </div>
  );
};

export default CreateSceneForm;
