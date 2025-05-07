import React, {Suspense} from "react";
import CreateSceneForm from "@/components/CreateScene";

const Scene = () => {
  return (
      <Suspense fallback={<div>Loading scene...</div>}>
          <CreateSceneForm/>
    </Suspense>
  );
};

export default Scene;
