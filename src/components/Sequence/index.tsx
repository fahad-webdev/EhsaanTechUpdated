/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {Dispatch, SetStateAction, useRef, useState} from "react";
import {Accordion, AccordionTab} from "primereact/accordion";
import {Button} from "primereact/button";
import {ProgressSpinner} from "primereact/progressspinner";
import toast from "react-hot-toast";
import {MidJourneyImages} from "../MidJourneyImage";
import {deleteFrame} from "@/services/frame";
import {Dialog} from "primereact/dialog";
import {Sequence} from "@/types/sequence";

interface SequenceTemplateProps {
  sequence: Sequence;
  setSequences: React.Dispatch<React.SetStateAction<Sequence[]>>;
  activeIndex: number | number[] | null;
  setActiveIndex: Dispatch<SetStateAction<number | number[] | null>>;
  loadingPromptId: string | null;
  selectedImages: Record<string, any>;
  loadingVariation: boolean | null;
  handleCreateMidJourneyImages: (promptId: string) => void;
  handleReGenerateMidJourneyImages: (promptId: string) => void;
  handleUpdatePromptForm: (promptId: string, index: number) => void;
  handleDeleteImage: (id: string, promptId: string) => Promise<void>;
  handleImageVariation: (id: any, index: any) => Promise<void>;
}

const SequenceTemplate: React.FC<SequenceTemplateProps> = ({
  sequence,
  setSequences,
  activeIndex,
  setActiveIndex,
  loadingPromptId,
  selectedImages,
  loadingVariation,
  handleCreateMidJourneyImages,
  handleReGenerateMidJourneyImages,
  handleUpdatePromptForm,
  handleDeleteImage,
  handleImageVariation,
}) => {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [promptId, setPromptId] = useState<number | null>(null);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Prompt copied to clipboard!"))
      .catch((err) => toast.error("Failed to copy text: ", err));
  };

  const handleDeletePrompt = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setPromptId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const response = await deleteFrame(promptId);

    if (response.success) {
      setSequences((prevSequences) =>
        prevSequences.map((seq) =>
          seq.id === sequence.id
            ? {
                ...seq,
                prompts: {
                  ...seq.prompts,
                  data: {
                    ...seq.prompts?.data,
                    frames: seq.prompts?.data?.frames?.filter(
                      (f) => f.id !== promptId
                    ),
                  },
                },
              }
            : seq
        )
      );
    }

    setDeleteModalVisible(false);
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModalVisible(false);
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const fromIndex = dragItem.current;
    const toIndex = dragOverItem.current;

    if (fromIndex === null || toIndex === null || fromIndex === toIndex) return;

    const updatedFrames = [...(sequence.prompts?.data?.frames || [])];
    const movedItem = updatedFrames.splice(fromIndex, 1)[0];
    updatedFrames.splice(toIndex, 0, movedItem);

    setSequences((prevSequences) =>
      prevSequences.map((seq) =>
        seq.id === sequence.id
          ? {
              ...seq,
              prompts: {
                ...seq.prompts,
                data: {
                  ...seq.prompts?.data,
                  frames: updatedFrames,
                },
              },
            }
          : seq
      )
    );

    dragItem.current = null;
    dragOverItem.current = null;
  };
  
  return (
    <div>
      <div className="text-center mb-4">
        <h1>{sequence.title}</h1>
        {sequence?.prompts?.data?.frames?.length === 0 && (
          <p className="text-center text-gray-700 text-xl">No prompts added.</p>
        )}
      </div>
      <Accordion
        multiple
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
      >
        {sequence?.prompts?.data?.frames?.map((prompt, index) => (
          <AccordionTab
            key={prompt.id}
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            draggable
            headerTemplate={
              <div className="flex flex-column md:flex-row justify-content-between align-items-center w-full">
                <span className="text-gray-700 text-lg font-medium text-center md:text-left">
                  {prompt.prompt}
                </span>
                <div className="flex mt-2 md:mt-0">
                  {loadingPromptId &&
                  String(loadingPromptId).split(",").includes(String(prompt.id)) ? (
                    <ProgressSpinner
                      style={{ width: "20px", height: "20px" }}
                      strokeWidth="4"
                      animationDuration=".5s"
                    />
                  ) : (
                    <>
                      <Button
                        tooltip="Delete Prompt"
                        icon="pi pi-trash"
                        className="p-button-rounded p-button-text text-red-600"
                        onClick={(e) => handleDeletePrompt(e, prompt.id)}
                      />
                      <Button
                        tooltip="Copy Prompt"
                        icon="pi pi-copy"
                        className="p-button-rounded p-button-text text-blue-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPrompt(prompt.prompt);
                        }}
                      />
                      <Button
                        tooltip="Generate Image"
                        icon="pi pi-camera"
                        className="p-button-rounded p-button-text text-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateMidJourneyImages(prompt.id);
                        }}
                      />
                      <Button
                        tooltip="Regenerate Image"
                        icon="pi pi-sync"
                        className="p-button-rounded p-button-text text-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReGenerateMidJourneyImages(prompt.id);
                        }}
                      />
                      <Button
                        tooltip="Update Prompt"
                        icon="pi pi-pencil"
                        className="p-button-rounded p-button-text text-orange-400"
                        onClick={() => handleUpdatePromptForm(prompt.id, index)}
                      />
                    </>
                  )}
                </div>
              </div>
            }
          >
            <Dialog
              visible={deleteModalVisible}
              onHide={() => setDeleteModalVisible(false)}
              header="Confirm Delete"
              footer={
                <div className="flex align-items-center justify-content-center space-x-2">
                  <Button
                    label="No"
                    icon="pi pi-times"
                    onClick={cancelDelete}
                    className="p-button-text"
                  />
                  <Button
                    label="Yes"
                    icon="pi pi-check"
                    onClick={confirmDelete}
                    className="p-button-danger"
                    autoFocus
                  />
                </div>
              }
            >
              <p className="text-gray-700">
                Are you sure you want to delete this prompt?
              </p>
            </Dialog>

            {loadingPromptId === prompt.id ? (
              <p className="text-gray-500 text-sm text-center mt-2">
                Loading images...
              </p>
            ) : loadingVariation ? (
              <p className="text-gray-500 text-sm text-center mt-2">
                Loading variation...
              </p>
            ) : selectedImages[prompt?.id]?.length > 0 ? (
              <div
                className="grid text-center overflow-auto"
                style={{ maxHeight: "590px" }}
              >
                {selectedImages[prompt?.id]?.map((image) => (
                  <div key={image.id} className="col-12 lg:col-3 sm:col-6">
                    <MidJourneyImages
                      image={image}
                      promptId={prompt?.id}
                      handleDeleteImage={handleDeleteImage}
                      handleImageVariation={handleImageVariation}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center mt-2">
                {selectedImages[prompt?.id] === undefined ? (
                  <>
                    No images available yet.. Click the{" "}
                    <span className="text-green-600 font-medium">Camera</span>{" "}
                    icon to generate images.
                  </>
                ) : (
                  <>
                    Images have been{" "}
                    <span className="text-red-600 font-medium">deleted</span>.
                    Update the prompt to create new images.
                  </>
                )}
              </p>
            )}
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};

export default SequenceTemplate;
