"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "primereact/skeleton";
import { useSearch } from "@/hooks/useSearch";
import { Card } from "primereact/card";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Movie } from "@/types/movie";
import { deleteMovie, getMovies } from "@/services/movie";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "../../app/globals.css";

const Movies = () => {
  const [visibleCards, setVisibleCards] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [movie, setMovie] = useState<Movie[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [movieId, setMovieId] = useState<number | null>(null);
  const { searchQuery } = useSearch();
  const router = useRouter();

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

  const loadMoreMovies = useCallback(() => {
    if (visibleCards < movie.length) {
      setVisibleCards((prev) => prev + 4);
    }
  }, [visibleCards, movie.length]);

  useEffect(() => {
    if (inView) {
      loadMoreMovies();
    }
  }, [inView, loadMoreMovies]);

  useEffect(() => {
    const loadSceneData = async () => {
      setIsLoading(true);

      const response = await getMovies();
      if (response) {
        setMovie(response.data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };

    loadSceneData();
  }, []);

  const filteredMovies = useMemo(() => {
    return movie.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [movie, searchQuery]);

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

  const handleMovieDetails = (id) => {
    router.push(`/movie?movieId=${id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setMovieId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async (e) => {
    e.stopPropagation();
    const response = await deleteMovie(movieId);

    if (response.success) {
      setMovie((prevScenes) =>
        prevScenes.filter((movie) => movie.id !== movieId)
      );
    }
    setDeleteModalVisible(false);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setDeleteModalVisible(false);
  };

  // Handle the drag-and-drop reorder
  const handleOnDragEnd = (result) => {
    const { destination, source } = result;

    // If the item is dropped outside the list
    if (!destination) return;

    // Reorder the movie list
    const reorderedMovies = Array.from(movie);
    const [movedMovie] = reorderedMovies.splice(source.index, 1);
    reorderedMovies.splice(destination.index, 0, movedMovie);

    // Update the state with the new order
    setMovie(reorderedMovies);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div>
        <div className="col-12">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="movies-list">
              {(provided) => (
                <div
                  className="grid"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {isLoading ? (
                    Array.from({ length: visibleCards }).map((_, index) => (
                      <div key={index} className="col-12 md:col-6 lg:col-3">
                        <CardSkeleton />
                      </div>
                    ))
                  ) : movie.length === 0 ? (
                    <div className="col-12 text-center text-gray-700 text-xl">
                      No movie created yet.
                    </div>
                  ) : filteredMovies.length > 0 ? (
                    filteredMovies.slice(0, visibleCards).map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            className="col-12 md:col-6 lg:col-3"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              className="transform card transition-all cursor-pointer duration-300 m-2 hover:shadow-xl hover:-translate-y-1 border rounded-4xl"
                              onClick={() => handleMovieDetails(item?.id)}
                              pt={{
                                root: { className: "surface-card border-round-xl" },
                                content: { className: "py-6" },
                              }}
                            >
                              <div className="flex flex-column items-content-center justify-content-center space-y-4 rounded-4xl">
                                <span className="text-gray-600 font-medium text-lg mb-4 text-center">
                                  Movie {item?.id}
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
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <div className="col-12 text-center text-gray-700 text-xl">
                      No movies match your search. Try a different keyword!
                    </div>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
          Are you sure you want to delete this movie?
        </p>
      </Dialog>

      <div
        ref={ref}
        className="flex justify-content-center align-items-center mt-4 mx-auto"
      >
        {visibleCards < movie.length && !isLoading && (
          <p>Loading more movies...</p>
        )}
      </div>
    </div>
  );
};

export default Movies;
