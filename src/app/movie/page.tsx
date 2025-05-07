import React, {Suspense} from "react";
import Scenes from "@/components/Scenes";

const Movie = () => {
  return (
      <Suspense fallback={<div>Loading scene...</div>}>
      <Scenes />
    </Suspense>
  );
};

export default Movie;
