import api from "@/utils/fetchClient";

export const getGenerateImages = async (taskId) => {
  try {
    const response = await api.get(`/scene/midjourney/${taskId}`);
    return response.data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

export const getMidJourneyImageByFrameId = async (frameId) => {
  try {
    const response = await api.get(`frames/ai-images`, {
      params: {frameId: frameId},
    });
    return response.data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

export const regenerate = async (frameId: number) => {
  try {
    const {data} = await api.get(`frames/${frameId}/regenerate`);
    return data;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  }
};

export const variationByImageId = async (imageId) => {
  try {
    const response = await api.get(`ai-images/${imageId}/variation`);
    return response?.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw error?.response?.data?.message;
  }
};
