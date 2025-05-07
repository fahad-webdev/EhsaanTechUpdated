import axios from "axios";

export const getErrorMessage = (error: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || defaultMessage;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return defaultMessage;
  };
  