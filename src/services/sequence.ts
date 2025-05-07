import api from "@/utils/fetchClient";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errorHandling";

export const createSequence = async (payload) => {
  try {
    const response = await api.post("/sequences", payload);
    if (response) {
      toast.success(response?.data?.message || "Sequence Created Successfully");
    }
    return response?.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to create sequence."));

  }
};

export const getSequencesBySceneId = async (
  sceneId: number
)=> {
  try {
    const response = await api.get(`/scenes/${sceneId}/sequences`);

    if (!response.data.success) {
      throw new Error("Failed to fetch sequences.");
    }

    return response.data.data;
  } catch (error) {
    toast.error(getErrorMessage(error, "Failed to fetch sequence."));

  }
};
