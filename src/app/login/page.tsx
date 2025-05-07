import React, {Suspense} from "react";
import Login from "@/components/Login";

const LoginPage = () => {
  return (
      <Suspense fallback={<div>Loading scene...</div>}>
          <Login/>
      </Suspense>
  );
};

export default LoginPage;
