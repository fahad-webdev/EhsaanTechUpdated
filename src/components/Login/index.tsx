"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import Image from "next/image";
import { LoginFormData } from "@/types/auth";
import BearImage from "../../assets/BearImage.jpg";
import { buttonStyle } from "@/ui/buttonStyle";
import { useAuth } from "@/hooks/useAuth";
import { Ripple } from "primereact/ripple";
import "./index.css";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
      const { email, password } = data;
      await signIn(email, password);
      setIsLoading(false);
  };

  return (
    <div className="flex align-items-center justify-content-center h-screen overflow-hidden">
      <div className="card p-4 shadow-2 border-round-2xl w-full lg:w-4">
        <div className="text-center my-5">
          <Image
            src={BearImage}
            alt="Bear Wars"
            height={100}
            width={100}
            className="mb-4 border-round-3xl border-circle object-cover"
          />
          <div className="text-900 text-3xl font-medium mb-3">
            Welcome to Magic Movies
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field mt-5">
          <span className="p-float-label p-input-icon-right">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                }}
                render={({ field, fieldState }) => (
                  <InputText
                    id="email"
                    {...field}
                    className={`w-full ${fieldState.invalid ? "p-invalid" : ""}`}
                    disabled={isLoading}
                  />
                )}
              />
              <label htmlFor="email" className={errors.email ? "p-error" : ""}>
                Email address*
              </label>
            </span>
            {errors.email && (
              <small className="p-error">{errors.email.message}</small>
            )}
          </div>

          <div className="field mt-5">
            <span className="p-float-label">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                render={({ field, fieldState }) => (
                  <Password
                    id="password"
                    {...field}
                    toggleMask
                    className={`w-full ${fieldState.invalid ? "p-invalid" : ""}`}
                    disabled={isLoading}
                    feedback={false}
                  />
                )}
              />
              <label
                htmlFor="password"
                className={errors.password ? "p-error" : ""}
              >
                Password*
              </label>
            </span>
            {errors.password && (
              <small className="p-error">{errors.password.message}</small>
            )}
          </div>

          <Divider className="my-4" />

          <div className="flex justify-content-center">
            <Ripple />
            <Button
              style={buttonStyle}
              type="submit"
              label="Sign In"
              icon="pi pi-user"
              iconPos="right"
              loading={isLoading}
              className="w-full mt-3 py-2 text-lg border-round-lg"
            />
          </div>
        </form>
      </div>
    </div>
  );
}