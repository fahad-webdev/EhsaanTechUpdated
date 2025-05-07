import api from "@/utils/fetchClient";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errorHandling";

export const getFrameBySequenceId = async (sequenceId: number) => {
  try {
    const response = await api.get(`/sequences/${sequenceId}/frames`);
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error fetching frame."));
  }
};

export const getSingleFrameById = async (frameId: number) => {
  try {
    const response = await api.get(`/frames/${frameId}`);
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error fetching frame."));
  }
};

export const createFrame = async (payload: object) => {
  try {
    const response = await api.post("/frames", payload);
    if (response) {
      toast.success(response?.data?.message || "Frame Created Successfully");
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error fetching frame."));
  }
};

export const updateFrameByFrameId = async (id, payload) => {
  try {
    const response = await api.patch(`/frames/${id}`, payload);
    if (response) {
      toast.success(response?.data?.message);
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error creating frame."));
  }
};

export const deleteImage = async (imageId: string) => {
  try {
    const response = await api.delete(`ai-images/${imageId}`);
    if (response) {
      toast.success(response?.data?.message);
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error deleting image."));
  }
};

export const deleteCharacter = async (characterId) => {
  try {
    const response = await api.delete(`characters/${characterId}`);
    if (response) {
      toast.success(response?.data?.message);
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error deleting character."));
  }
};

export const deleteAction = async (actionId) => {
  try {
    const response = await api.delete(`actions/${actionId}`);
    if (response) {
      toast.success(response?.data?.message);
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error deleting action."));
  }
};

export const deleteEnvironment = async (environmentId) => {
  try {
    const response = await api.delete(`environments/${environmentId}`);
    if (response) {
      toast.success(response?.data?.message);
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error deleting environment."));
  }
};

export const deleteFrame = async (frameId) => {
  try {
    const response = await api.delete(`frames/${frameId}`);
    if (response) {
      toast.success(response?.data?.message);
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error deleting frame."));
  }
};
