import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import CreateSceneForm from "./index";
import { getSequencesBySceneId } from "@/services/sequence";
import { createFrame } from "@/services/frame";

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn((param) => {
      if (param === "sceneId") return "10";
      return null;
    }),
  })),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("primereact/hooks", () => ({
  ...jest.requireActual("primereact/hooks"),
  usePrimeReact: () => ({ css: false }),
}));

jest.mock("@/services/scene", () => ({
  getCharacter: jest.fn(() => Promise.resolve({ data: mockCharacters })),
  createCharacter: jest.fn(() => Promise.resolve({ data: {} })),
  getAction: jest.fn(() => Promise.resolve({ data: [] })),
  createAction: jest.fn(() => Promise.resolve({ data: {} })),
  getLocation: jest.fn(() => Promise.resolve({ data: [] })),
  createLocation: jest.fn(() => Promise.resolve({ data: {} })),
  getSingleScene: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock("@/services/sequence", () => ({
  getSequencesBySceneId: jest.fn(() =>
    Promise.resolve({ data: mockSequences })
  ),
  createSequence: jest.fn(),
}));

jest.mock("@/services/frame", () => ({
  getFrameBySequenceId: jest.fn(),
  createFrame: jest.fn(),
}));

const mockSequences = [
  { id: 1, sceneId: 10, title: "Test Sequence", prompts: [] },
];

const mockCharacters = [{ id: 1, label: "hero", value: "Hero" }];

const mockFrame = {
  actionId: 12,
  characterId: 22,
  environmentId: 9,
  prompt: "Bull running - Wolf Wolf in white eating Jungle",
  sequenceId: 48,
  shot: "Bull running",
};

describe("CreateSceneForm Component", () => {
  beforeEach(() => {
    (
      getSequencesBySceneId as jest.MockedFunction<typeof getSequencesBySceneId>
    ).mockResolvedValue(mockSequences);
    (createFrame as jest.Mock).mockResolvedValue(mockFrame);
  });

  it("renders the component correctly", async () => {
    await act(async () => {
      render(<CreateSceneForm />);
    });
  });

  it("fetches sequences on load", async () => {
    await act(async () => {
      render(<CreateSceneForm />);
    });

    await waitFor(() => expect(getSequencesBySceneId).toHaveBeenCalledWith(10));
  });

  it("allows adding a new prompt", async () => {
    (createFrame as jest.Mock).mockResolvedValue(mockFrame);

    await act(async () => {
      render(<CreateSceneForm />);
    });

    fireEvent.change(screen.getByPlaceholderText("Write a shot description"), {
      target: { value: "Bull running" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Combined scene description"),
      {
        target: { value: "Bull running - Wolf Wolf in white eating Jungle" },
      }
    );
    fireEvent.change(screen.getByLabelText("Character"));
    fireEvent.change(screen.getByLabelText("Action"));
    fireEvent.change(screen.getByLabelText("Environment"));

    await act(async () => {
      fireEvent.submit(screen.getByTestId("create-form"));
    });
  });

  it("renders the carousel correctly", async () => {
    await act(async () => {
      render(<CreateSceneForm />);
    });

    await waitFor(() => expect(getSequencesBySceneId).toHaveBeenCalledWith(10));

    expect(screen.getByText("Test Sequence")).toBeInTheDocument();
  });
});
