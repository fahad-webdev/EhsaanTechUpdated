"use client";

import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ProgressSpinner } from "primereact/progressspinner";
import toast from "react-hot-toast";
import { buttonStyle } from "@/ui/buttonStyle";
import { useSearch } from "@/hooks/useSearch";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dialog } from "primereact/dialog";
import { createScene } from "@/services/scene";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller } from "react-hook-form";
import { createSceneSchema } from "@/schema/create-scene";
import { createMovie } from "@/services/movie";
import { createMovieSchema } from "@/schema/create-movie";
import { useSearchParams } from "next/navigation";
import SceneDialog from "../Dialogs/SceneDialog";
import "../../app/globals.css";

export default function Header() {

  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { setSearchQuery } = useSearch();
  const [loading, setLoading] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [visibleSceneDialog, setVisibleSceneDialog] = useState<boolean>(false);
  const [visibleMovieDialog, setVisibleMovieDialog] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const movieIdParam = searchParams.get("movieId");
  const id = movieIdParam ? Number(movieIdParam) : null;
  const isMovieRoute = pathname === "/movie";
  const isHomeRoute = pathname === "/";

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

  const {
    control: movieControl,
    handleSubmit: handleMovieSubmit,
    reset: resetMovieForm,
  } = useForm({
    resolver: zodResolver(createMovieSchema),
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

  const onCreateMovie = async (data) => {
    setLoadingCreate(true);
    const payload = { title: data.title };
    const response = await createMovie(payload);

    if (response?.data?.id) {
      setVisibleMovieDialog(false);
      router.push(`/movie?movieId=${response?.data?.id}`);
      resetMovieForm();
    } else {
      throw new Error("Failed to create movie");
    }
    setLoadingCreate(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    toast.success("User logged out");
    router.push("/login");
    setLoading(false);
  };

  return (
    <>
      {!["/login"].includes(pathname) && (
        <div className="flex align-items-center justify-content-between p-4 shadow-2 bg-white">
          <h1
            className="text-lg cursor-pointer hover:text-primary-700 transition-colors"
            style={{ color: "#605fa2" }}
            onClick={() => router.push("/")}
          >
            Magic Movies
          </h1>

          {/* Desktop View */}
          <div className="hidden md:flex align-items-center gap-4">
            {/* Search Input - shown on both routes */}
            {(isHomeRoute || isMovieRoute) && (
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText
                  placeholder="Search"
                  type="text"
                  className="w-8rem sm:w-auto"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </IconField>
            )}

            {/* Show Create Movie button on home route */}
            {isHomeRoute && (
              <Button
                label="Create Movie"
                icon="pi pi-plus-circle"
                iconPos="right"
                raised
                className="border-round-lg text-lg"
                style={buttonStyle}
                onClick={() => setVisibleMovieDialog(true)}
                disabled={loadingCreate}
              >
                {loadingCreate && (
                  <ProgressSpinner
                    style={{ width: "20px", height: "20px" }}
                    strokeWidth="4"
                    animationDuration=".5s"
                  />
                )}
              </Button>
            )}

            {/* Show Create Scene button on movie route */}
            {isMovieRoute && (
              <Button
                label="Create Scene"
                icon="pi pi-plus-circle"
                iconPos="right"
                raised
                className="border-round-lg text-lg"
                style={buttonStyle}
                onClick={() => setVisibleSceneDialog(true)}
                disabled={loadingCreate}
              >
                {loadingCreate && (
                  <ProgressSpinner
                    style={{ width: "20px", height: "20px" }}
                    strokeWidth="4"
                    animationDuration=".5s"
                  />
                )}
              </Button>
            )}

            {/* Logout button - shown on both routes */}
            <Button
              label="Logout"
              icon="pi pi-sign-out"
              style={buttonStyle}
              className="border-round-lg text-lg"
              onClick={handleLogout}
            >
              {loading && (
                <ProgressSpinner
                  style={{ width: "20px", height: "20px" }}
                  strokeWidth="4"
                  animationDuration=".5s"
                />
              )}
            </Button>
          </div>

          {/* Scene Dialog */}
          <SceneDialog
            visibleSceneDialog={visibleSceneDialog}
            setVisibleSceneDialog={setVisibleSceneDialog}
            handleSceneSubmit={handleSceneSubmit}
            onCreateScene={onCreateScene}
            sceneControl={sceneControl}
            loadingCreate={loadingCreate}
          />

          {/* Movie Dialog */}
          <Dialog
            visible={visibleMovieDialog}
            onHide={() => setVisibleMovieDialog(false)}
            header="Create New Movie"
            className="w-[90vw] md:w-3"
          >
            <form onSubmit={handleMovieSubmit(onCreateMovie)} className="p-4">
              <Controller
                name="title"
                control={movieControl}
                render={({ field, fieldState }) => (
                  <div className="mb-4">
                    <InputText
                      {...field}
                      className="w-full p-3"
                      placeholder="Enter Movie title"
                    />
                    {fieldState.error && (
                      <small className="text-red-500">
                        {fieldState.error.message}
                      </small>
                    )}
                  </div>
                )}
              />
              <Button
                label={loadingCreate ? "Creating..." : "Create"}
                icon="pi pi-plus-circle"
                iconPos="right"
                type="submit"
                className="w-full"
                style={buttonStyle}
                disabled={loadingCreate}
              >
                {loadingCreate && (
                  <ProgressSpinner
                    style={{ width: "20px", height: "20px" }}
                    strokeWidth="4"
                    animationDuration=".5s"
                  />
                )}
              </Button>
            </form>
          </Dialog>

          {/* Mobile View - Hamburger Menu */}
          <div className="md:hidden">
            <Button
              icon="pi pi-bars"
              className="p-button-text p-button-rounded"
              onClick={() => setMobileMenuVisible(true)}
            />
          </div>
          <Sidebar
            visible={mobileMenuVisible}
            onHide={() => setMobileMenuVisible(false)}
            position="right"
            className="w-64"
          >
            <div className="flex flex-column gap-4 p-4">
              {/* Search Input - shown on both routes */}
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search"> </InputIcon>
                <InputText
                  placeholder="Search"
                  type="text"
                  className="w-15rem sm:w-30rem	"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </IconField>

              {/* Show Create Movie button on home route */}
              {isHomeRoute && (
                <Button
                  label="Create Movie"
                  icon="pi pi-plus-circle"
                  iconPos="right"
                  raised
                  className="border-round-lg text-lg"
                  style={buttonStyle}
                  onClick={() => {
                    setVisibleMovieDialog(true);
                    setMobileMenuVisible(false);
                  }}
                />
              )}

              {/* Show Create Scene button on movie route */}
              {isMovieRoute && (
                <Button
                  label="Create Scene"
                  icon="pi pi-plus-circle"
                  iconPos="right"
                  raised
                  className="border-round-lg text-lg"
                  style={buttonStyle}
                  onClick={() => {
                    setVisibleSceneDialog(true);
                    setMobileMenuVisible(false);
                  }}
                />
              )}

              <Button
                label="Logout"
                icon="pi pi-sign-out"
                style={buttonStyle}
                className="border-round-lg text-lg"
                onClick={() => {
                  handleLogout();
                  setMobileMenuVisible(false);
                }}
              >
                {loading && (
                  <ProgressSpinner
                    style={{ width: "20px", height: "20px" }}
                    strokeWidth="4"
                    animationDuration=".5s"
                  />
                )}
              </Button>
            </div>
          </Sidebar>
        </div>
      )}
    </>
  );
}
