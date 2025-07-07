import AuthPage from "@/app/components/features/auth/AuthPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  return <AuthPage />;
}
