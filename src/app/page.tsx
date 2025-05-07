"use server";
import "./globals.css";
import Movies from "@/components/Movies";
import React, {Suspense} from "react";

export default async function Home() {
  return (
    <>
        <Suspense fallback={<div>Loading scene...</div>}>
            <Movies/>
        </Suspense>
    </>
  );
}
