"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import {useInView} from "react-intersection-observer";
import "./index.css";
import {Skeleton} from "primereact/skeleton";
import {Scene, Title} from "@/types/scene";
import {useSearch} from "@/hooks/useSearch";
import {Card} from "primereact/card";
import {useRouter, useSearchParams} from "next/navigation";
import {Button} from "primereact/button";
import {createScene, deleteScene} from "@/services/scene";
import {Dialog} from "primereact/dialog";
import {getMovieById, getSceneByMovieId} from "@/services/movie";
import {buttonStyle} from "@/ui/buttonStyle";
import SceneDialog from "../Dialogs/SceneDialog";
import {useForm} from "react-hook-form";
import {createSceneSchema} from "@/schema/create-scene";
import {zodResolver} from "@hookform/resolvers/zod";

const Scenes = () => {
  const [visibleCards, setVisibleCards] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [scene, setScene] = useState<Scene[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [sceneId, setSceneId] = useState<number | null>(null);
  const [visibleSceneDialog, setVisibleSceneDialog] = useState<boolean>(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [movieTitle, setMovieTitle] = useState<Title>();

  const { searchQuery } = useSearch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const movieIdParam = searchParams.get("movieId") || null;
  const id =
      movieIdParam && !isNaN(Number(movieIdParam))
          ? Number(movieIdParam)
          : null;

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const truncateWords = (str = "", numWords) => {
    const words = str.split(" ");
    if (words.length > numWords) {
      return words.slice(0, numWords).join(" ") + "...";
    }
    return str;
  };

  const {
    control: sceneControl,
    handleSubmit: handleSceneSubmit,
    reset: resetSceneForm,
  } = useForm({
    resolver: zodResolver(createSceneSchema),
    defaultValues: {
      title: "",
    },
  });
  const onCreateScene = async (data) => {
    setLoadingCreate(true);
    const payload = { title: data.title, movieId: id };
    const response = await createScene(payload);

    if (response?.data?.id) {
      setVisibleSceneDialog(false);
      router.push(`/scene?sceneId=${response?.data?.id}`);
      resetSceneForm();
    } else {
      throw new Error("Failed to create scene");
    }
    setLoadingCreate(false);
  };

  const loadMoreScenes = useCallback(() => {
    if (visibleCards < scene.length) {
      setVisibleCards((prev) => prev + 4);
    }
  }, [visibleCards, scene.length]);

  useEffect(() => {
    if (inView) {
      loadMoreScenes();
    }
  }, [inView, loadMoreScenes]);

  useEffect(() => {
    const loadSceneData = async () => {
      setIsLoading(true);

      const response = await getSceneByMovieId(id);
      if (response) {
        setScene(response.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    loadSceneData();

    const loadMovieData = async () => {
      const response = await getMovieById(id);
      if (response) {
        setMovieTitle(response.data);
      }
    };
    loadMovieData();
  }, [id]);

  const filteredScenes = useMemo(() => {
    return scene.filter((scene) =>
        scene.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [scene, searchQuery]);

  const CardSkeleton = () => (
    <div className="surface-0 card shadow-2 p-3 border-1 border-50 border-round-2xl">
      <div className="flex justify-content-center mb-3 p-6">
        <div className="flex-col justify-content-center">
          <div className="flex justify-content-center">
            <Skeleton width="8rem" height="1.5rem" className="mb-2" />
          </div>
          <div>
            <Skeleton width="12rem" height="1.5rem" />
          </div>
        </div>
      </div>
    </div>
  );

  const handleSceneDetails = (id) => {
    router.push(`/scene?sceneId=${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setSceneId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();
    const response = await deleteScene(sceneId);

    if (response.success) {
      setScene((prevScenes) =>
          prevScenes.filter((scene) => scene.id !== sceneId),
      );
    }
    setDeleteModalVisible(false);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeleteModalVisible(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center flex align-items-center justify-content-center">
        {movieTitle?.title}
      </h1>
      <div>
        <div className="col-12">
          <div className="grid">
            {isLoading ? (
              Array.from({ length: visibleCards }).map((_, index) => (
                <div key={index} className="col-12 md:col-6 lg:col-3">
                  <CardSkeleton />
                </div>
              ))
            ) : scene.length === 0 ? (
              <>
                <div className="col-12 text-center text-gray-700 text-xl">
                  <p className="mb-4">No scene created yet.</p>
                  <Button
                    label="Create Scene"
                    icon="pi pi-plus-circle"
                    iconPos="right"
                    className="p-button-lg"
                    onClick={() => setVisibleSceneDialog(true)}
                    style={buttonStyle}
                  />
                </div>
                <SceneDialog
                  visibleSceneDialog={visibleSceneDialog}
                  setVisibleSceneDialog={setVisibleSceneDialog}
                  handleSceneSubmit={handleSceneSubmit}
                  onCreateScene={onCreateScene}
                  sceneControl={sceneControl}
                  loadingCreate={loadingCreate}
                />
              </>
            ) : filteredScenes.length > 0 ? (
              filteredScenes.slice(0, visibleCards).map((item) => (
                <div key={item.id} className="col-12 md:col-6 lg:col-3">
                  <Card
                    className="transform card transition-all cursor-pointer duration-300 m-2 hover:shadow-xl hover:-translate-y-1 border rounded-4xl"
                    onClick={() => handleSceneDetails(item?.id)}
                    pt={{
                      root: { className: "surface-card border-round-xl" },
                      content: { className: "py-6" },
                    }}
                  >
                    <div className="flex flex-column items-content-center justify-content-center space-y-4 rounded-4xl">
                      <span className="text-gray-600 font-medium text-lg mb-4 text-center">
                        Scene {item?.id}
                      </span>
                      <div className="font-bold text-xl text-indigo-600 text-center">
                        {truncateWords(item?.title, 3)}
                      </div>
                    </div>
                    <div className="flex align-items-end justify-content-end">
                      <Button
                        icon="pi pi-trash"
                        iconPos="right"
                        className="p-button-rounded p-button-text text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(e, item.id);
                        }}
                      />
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-12 text-center text-gray-700 text-xl">
                No scenes match your search. Try a different keyword!
              </div>
            )}
          </div>
        </div>
      </div>

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
          Are you sure you want to delete this scene?
        </p>
      </Dialog>

      <div
        ref={ref}
        className="flex justify-content-center align-items-center mt-4 mx-auto"
      >
        {visibleCards < scene.length && !isLoading && (
          <p>Loading more scenes...</p>
        )}
      </div>
    </div>
  );
};

export default Scenes;
