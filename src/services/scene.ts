import api from "@/utils/fetchClient";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errorHandling";

export const createCharacter = async (payload) => {
  try {
    const response = await api.post("/characters", payload);
    if (response) {
      toast.success(
        response?.data?.message || "Created Character Successfully"
      );
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to create character."));
  }
};

export const getCharacter = async () => {
  try {
    const response = await api.get(`/characters`);
    return response.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch character."));
  }
};

export const createAction = async (payload) => {
  try {
    const response = await api.post("/actions", payload);
    if (response) {
      toast.success(response?.data?.message || "Created Action Successfully");
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to create action."));
  }
};

export const getAction = async () => {
  try {
    const response = await api.get(`/actions`);
    return response.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch action."));
  }
};

export const createLocation = async (payload) => {
  try {
    const response = await api.post("/environments", payload);
    if (response) {
      toast.success(
        response?.data?.message || "Created Environment Successfully"
      );
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to create environment."));
  }
};

export const getLocation = async () => {
  try {
    const response = await api.get(`/environments`);
    return response.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch environment."));
  }
};

export const createScene = async (payload) => {
  try {
    const response = await api.post("/scenes", payload);
    if (response) {
      toast.success(response?.data?.message || "Scene Created Successfully");
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to create scene."));
  }
};

export const getScene = async () => {
  try {
    const response = await api.get(`/scenes`);
    return response.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch scenes."));
  }
};

export const getSingleScene = async (id) => {
  try {
    const response = await api.get(`/scenes/${id}`);
    return response.data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

export const deleteScene = async (sceneId) => {
  try {
    const response = await api.delete(`scenes/${sceneId}`);
    if (response) {
      toast.success(response?.data?.message);
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Error deleting scene."));
  }
};
