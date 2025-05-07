import api from "@/utils/fetchClient";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/errorHandling";

export const createMovie = async (payload) => {
    try {
      const response = await api.post("/movies", payload);
      if (response) {
        toast.success(response?.data?.message || "Movie Created Successfully");
      }
      return response?.data;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create scene."));
    }
  };
  
  export const getMovies = async () => {
    try {
      const response = await api.get(`/movies`);
      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to fetch movies."));
    }
  };

  export const getMovieById = async (movieId) => {
    try {
      const response = await api.get(`/movies/${movieId}`);
      return response.data;
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to fetch movies."));
    }
  };
  
  export const getSceneByMovieId = async (id) => {
    try {
      const response = await api.get(`/movies/${id}/scenes`);
      return response.data;
    } catch (error) {
      console.error("An error occurred:", error);
      throw error;
    }
  };
  
  export const deleteMovie = async (movieId) => {
    try {
      const response = await api.delete(`movies/${movieId}`);
      if (response) {
        toast.success(response?.data?.message);
      }
      return response?.data;
    } catch (error) {
      toast.error(getErrorMessage(error, "Error deleting scene."));
    }
  };
  