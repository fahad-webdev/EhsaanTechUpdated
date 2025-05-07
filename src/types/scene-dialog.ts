import { UseFormHandleSubmit } from "react-hook-form";
import { Control } from "react-hook-form";

interface SceneFormValues {
  name: string;
  description?: string;
}

export interface SceneDialogProps {
  visibleSceneDialog: boolean;
  setVisibleSceneDialog: (visible: boolean) => void;
  handleSceneSubmit: UseFormHandleSubmit<SceneFormValues>;
  onCreateScene: (data: SceneFormValues) => void;
  sceneControl: Control<SceneFormValues>;
  loadingCreate: boolean;
}
