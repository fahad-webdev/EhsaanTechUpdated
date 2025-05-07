import {createAction, createCharacter, createLocation, getAction, getCharacter, getLocation,} from "@/services/scene";
import {
  deleteAction,
  deleteCharacter,
  deleteEnvironment,
  deleteImage,
  getFrameBySequenceId,
  getSingleFrameById,
} from "@/services/frame";
import {getMidJourneyImageByFrameId, regenerate, variationByImageId,} from "@/services/ai-image";
import {createSequence, getSequencesBySceneId} from "@/services/sequence";
import {toast} from "react-hot-toast";
import {Action, Character, Location, Sequence} from "@/types/sequence";

export const handleCharacterDeleteOption =
  (setCharacterId, setCharacterDeleteModalVisible) => (e, id) => {
    setCharacterId(id);
    setCharacterDeleteModalVisible(true);
  };

export const confirmCharacterDelete =
  (
    characterId: number | null,
    setCharacters: React.Dispatch<React.SetStateAction<Character[]>>,
    setCharacterDeleteModalVisible: React.Dispatch<
      React.SetStateAction<boolean>
    >,
  ) =>
  async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteCharacter(characterId);
    setCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character.id !== characterId),
    );
    setCharacterDeleteModalVisible(false);
  };

export const cancelCharacterDelete = (setCharacterDeleteModalVisible) => {
  setCharacterDeleteModalVisible(false);
};

export const handleActionDeleteOption =
  (setActionId, setActionDeleteModalVisible) => (e, id) => {
    setActionId(id);
    setActionDeleteModalVisible(true);
  };

export const confirmActionDelete =
  (
    actionId: number | null,
    setActions: React.Dispatch<React.SetStateAction<Action[]>>,
    setActionDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>,
  ) =>
  async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteAction(actionId);
    setActions((prev) => prev.filter((action) => action.id !== actionId));
    setActionDeleteModalVisible(false);
  };
export const cancelActionDelete = (setActionDeleteModalVisible) => {
  setActionDeleteModalVisible(false);
};

export const handleLocationDeleteOption =
  (setLocationId, setLocationDeleteModalVisible) => (e, id) => {
    setLocationId(id);
    setLocationDeleteModalVisible(true);
  };

export const confirmLocationDelete =
  (
    locationId: number | null,
    setLocations: React.Dispatch<React.SetStateAction<Location[]>>,
    setLocationDeleteModalVisible: React.Dispatch<
        React.SetStateAction<boolean>
    >,
  ) =>
  async (e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteEnvironment(locationId);
    setLocations((prev) =>
        prev.filter((location) => location.id !== locationId),
    );
    setLocationDeleteModalVisible(false);
  };

export const cancelLocationDelete = (setLocationDeleteModalVisible) => {
  setLocationDeleteModalVisible(false);
};

export const onSubmitCharacter = async (
  data,
  setIsLoadingCharacter,
  setCharacters,
  setShowCharacterDialog,
) => {
  setIsLoadingCharacter(true);
  await createCharacter(data);
  const response = await getCharacter();
  setCharacters(response.data);
  setShowCharacterDialog(false);
  setIsLoadingCharacter(false);
};

export const onSubmitAction = async (
  data,
  setIsLoadingAction,
  setActions,
  setShowActionDialog,
) => {
  setIsLoadingAction(true);
  await createAction(data);
  const response = await getAction();
  setActions(response.data);
  setShowActionDialog(false);
  setIsLoadingAction(false);
};

export const onSubmitLocation = async (
  data,
  setIsLoadingLocation,
  setLocations,
  setShowLocationDialog,
) => {
  setIsLoadingLocation(true);
  await createLocation(data);
  const response = await getLocation();
  setLocations(response.data);
  setShowLocationDialog(false);
  setIsLoadingLocation(false);
};

export const fetchSequences = async (
  id,
  currentIndex,
  setIsLoadingSequences,
  setSequences,
) => {
  setIsLoadingSequences(true);
  try {
    const sequences = await getSequencesBySceneId(parseInt(id!));
    const activeSequence = sequences[currentIndex];
    const frame = await getFrameBySequenceId(activeSequence.id!);
    const updatedSequences = sequences.map((seq, index) =>
        index === currentIndex ? {...seq, prompts: frame} : seq,
    );
    setSequences(updatedSequences);
  } catch (error) {
    console.error("Failed to fetch sequences:", error);
  } finally {
    setIsLoadingSequences(false);
  }
};

export const handleCreateMidJourneyImages = async (
  promptId,
  setSelectedImages,
  setLoadingPromptId,
  setIsCreatePrompt,
  setPromptIds,
) => {
  setIsCreatePrompt(true);
  setPromptIds(promptId);

  try {
    setLoadingPromptId(promptId);
    const fetchImages = async () => {
      try {
        const response = await getMidJourneyImageByFrameId(promptId);

        if (response.success) {
          setSelectedImages((prev) => ({
            ...prev,
            [promptId]: Array.isArray(response.data) ? response.data : [],
          }));
          setLoadingPromptId(null);
          setIsCreatePrompt(false);
          return true;
        } else {
          console.error("Task still pending, will retry...");
          return false;
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        setSelectedImages((prev) => ({ ...prev, [promptId]: [] }));
        return false;
      }
    };

    const isSuccess = await fetchImages();

    if (!isSuccess) {
      const pollInterval = setInterval(async () => {
        const isSuccess = await fetchImages();
        if (isSuccess) {
          clearInterval(pollInterval);
        }
      }, 10000);
    }
  } catch (error) {
    console.error("Error in handleCreateMidJourneyImages:", error);
  }
};

export const handleReGenerateMidJourneyImages = async (
    promptId,
    setSelectedImages,
    setLoadingPromptId,
    setIsCreatePrompt,
    setPromptIds,
) => {
  try {
    setIsCreatePrompt(true);
    setPromptIds(promptId);
    setLoadingPromptId(promptId);

    const response = await regenerate(promptId);

    if (response.success) {
      // Call handleCreateMidJourneyImages with the same props
      await handleCreateMidJourneyImages(
          promptId,
          setSelectedImages,
          setLoadingPromptId,
          setIsCreatePrompt,
          setPromptIds,
      );
    } else {
      console.error("Image Re-Generation is still processing, will retry...");
    }
  } catch (error) {
    console.error("Error during image regeneration:", error);
  }
};

export const handleUpdatePromptForm = async (
  id,
  index,
  setActiveIndex,
  setUpdatePrompt,
  setSelectedPromptId,
  setValue,
  characterOptions,
  actionOptions,
  locationOptions,
) => {
  setActiveIndex(index);
  setUpdatePrompt(true);
  setSelectedPromptId(id);
  const response = await getSingleFrameById(id);
  const data = response.data;
  setValue("exteriorShort", data.shot);

  const selectedCharacter = characterOptions.find(
      (option) => (option.value as Character).id === data.characterId,
  )?.value;

  const selectedAction = actionOptions.find(
      (option) => (option.value as Action).id === data.actionId,
  )?.value;

  const selectedLocation = locationOptions.find(
      (option) => (option.value as Location).id === data.environmentId,
  )?.value;

  setValue("character", selectedCharacter as Character);
  setValue("action", selectedAction as Action);
  setValue("location", selectedLocation as Location);

  setValue("combinedText", data.prompt);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

export const onCreateSequence = async (
  data,
  id,
  setIsLoadingSequence,
  setSequences,
  setCurrentIndex,
  resetSequenceForm,
  setShowSequenceDialog,
) => {
  setIsLoadingSequence(true);
  const newSequence: Sequence = {
    sceneId: parseInt(id!),
    title: data.title,
  };
  await createSequence(newSequence);
  const updatedSequences = await getSequencesBySceneId(parseInt(id!));
  setSequences(updatedSequences);
  setCurrentIndex(0);
  resetSequenceForm();
  setShowSequenceDialog(false);
  setIsLoadingSequence(false);
};

export const handleImageVariation = async (
  id,
  promptIds,
  setLoadingVariation,
  handleCreateMidJourneyImages,
) => {
  setLoadingVariation(id);

  const fetchVariations = async () => {
    try {
      const response = await variationByImageId(id);

      if (response.success) {
        handleCreateMidJourneyImages(promptIds);
        setLoadingVariation(null);
        return true;
      } else {
        console.error("Task still pending, will retry...");
        return false;
      }
    } catch (error) {
      const errorMessage = error;

      if (errorMessage === "Failed to generate the variation image") {
        toast.error(errorMessage);
        setLoadingVariation(null);
        return true;
      }

      if (
        errorMessage ===
        "MidJourney image is still processing, please try again later."
      ) {
        toast.success("MidJourney image is still processing, please wait.");
        return false;
      }

      return false;
    }
  };

  const isSuccess = await fetchVariations();

  if (!isSuccess) {
    const pollInterval = setInterval(async () => {
      const isSuccess = await fetchVariations();
      if (isSuccess) {
        clearInterval(pollInterval);
      }
    }, 15000);
  }
};

export const handleDeleteImage = async (
  id: string,
  promptId: string,
  setSelectedImages,
) => {
  await deleteImage(id);
  setSelectedImages((prev) => ({
    ...prev,
    [promptId]: prev[promptId]?.filter((image) => image.id !== id),
  }));
};

export const getCharacterOptions = (characters: Character[]) => [
  { label: "➕ Create New Character", value: "create_new" },
  ...characters.map((c) => ({ label: c.name, value: c })),
];

export const getActionOptions = (actions: Action[]) => [
  { label: "➕ Create New Action", value: "create_new" },
  ...actions.map((action) => ({
    label: action.name,
    value: action,
  })),
];

export const getLocationOptions = (locations: Location[]) => [
  { label: "➕ Create New Environment", value: "create_new" },
  ...locations.map((location) => ({
    label: location.name,
    value: location,
  })),
];
