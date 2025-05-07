import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Scenes from "../Scenes";
import { useSearch } from "@/hooks/useSearch";
import { getSceneByMovieId } from "@/services/movie";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "next/navigation";
import { getMovieById } from "@/services/movie";

// Mock the useSearch hook
jest.mock("@/hooks/useSearch", () => ({
  useSearch: jest.fn(),
}));

// Mock the API services
jest.mock("@/services/scene", () => ({
  getSceneByMovieId: jest.fn(),
  deleteScene: jest.fn(),
}));

jest.mock("@/services/movie", () => ({
  getMovieById: jest.fn(),
  getSceneByMovieId: jest.fn(),
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock Intersection Observer hook
jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn(),
}));

describe("Scenes Component", () => {
  const mockPush = jest.fn();
  const mockSearchParams = new URLSearchParams("movieId=1");
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useInView as jest.Mock).mockReturnValue({ ref: jest.fn(), inView: false });
    (useSearch as jest.Mock).mockReturnValue({ searchQuery: "" });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
  });

  it("fetches and displays scene data", async () => {
    const mockScenes = [
      { id: 1, title: "Scene One" },
      { id: 2, title: "Scene Two" },
    ];
    (getSceneByMovieId as jest.Mock).mockResolvedValue({ data: mockScenes });
    (getMovieById as jest.Mock).mockResolvedValue({ data: { title: "Test Movie" } });

    await act(async () => {
      render(<Scenes />);
    });

    await waitFor(() => {
      expect(getSceneByMovieId).toHaveBeenCalledWith(1);
    });
  });

  it("filters scenes based on search query", async () => {
    (useSearch as jest.Mock).mockReturnValue({ searchQuery: "Scene One" });
    (getSceneByMovieId as jest.Mock).mockResolvedValue({
      data: [
        { id: 1, title: "Scene One" },
        { id: 2, title: "Scene Two" },
      ],
    });
    (getMovieById as jest.Mock).mockResolvedValue({ data: { title: "Test Movie" } });

    await act(async () => {
      render(<Scenes />);
    });

    await waitFor(() => expect(getSceneByMovieId).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("Scene Two")).not.toBeInTheDocument();
  });

  it("navigates to scene details when a card is clicked", async () => {
    const mockScenes = [{ id: 1, title: "Scene One" }];
    (getSceneByMovieId as jest.Mock).mockResolvedValue({ data: mockScenes });
    (getMovieById as jest.Mock).mockResolvedValue({ data: { title: "Test Movie" } });

    await act(async () => {
      render(<Scenes />);
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText("Scene One"));
      expect(mockPush).toHaveBeenCalledWith("/scene?sceneId=1");
    });
  });

  it("displays 'No scenes match your search' when there are no results", async () => {
    (useSearch as jest.Mock).mockReturnValue({ searchQuery: "Nonexistent" });
    (getSceneByMovieId as jest.Mock).mockResolvedValue({
      data: [{ id: 1, title: "Scene One" }],
    });
    (getMovieById as jest.Mock).mockResolvedValue({ data: { title: "Test Movie" } });

    await act(async () => {
      render(<Scenes />);
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          "No scenes match your search. Try a different keyword!"
        )
      ).toBeInTheDocument()
    );
  });

  it("loads more scenes when inView is triggered", async () => {
    (useInView as jest.Mock).mockReturnValue({ ref: jest.fn(), inView: true });
    const mockScenes = Array.from({ length: 20 }, (_, i) => ({
      id: String(i + 1),
      title: `Scene ${i + 1}`,
    }));

    (getSceneByMovieId as jest.Mock).mockResolvedValue({ data: mockScenes });
    (getMovieById as jest.Mock).mockResolvedValue({ data: { title: "Test Movie" } });

    await act(async () => {
      render(<Scenes />);
    });

    await waitFor(() => expect(getSceneByMovieId).toHaveBeenCalledTimes(1));
  });
});