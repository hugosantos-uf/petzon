"use client";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useLoginMutation, useRegisterMutation } from "@/app/store/api/petsApi";
import { useAppDispatch } from "@/app/hooks/hooks";
import { setCredentials } from "./multiActionAreaCard/authSlice";
import { useRouter } from "@/i18n/navigation";

interface LoginFormInputs {
  emailLogin: string;
  passwordLogin: string;
}

interface RegisterFormInputs {
  nameRegister: string;
  emailRegister: string;
  passwordRegister: string;
}

export default function AuthPage() {
  const t = useTranslations("auth");
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const router = useRouter();

  // Hooks da nossa API
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const dispatch = useAppDispatch();

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: errorsLogin },
  } = useForm<LoginFormInputs>({
    mode: "onBlur",
  });

  const {
    register: registerRegister,
    handleSubmit: handleSubmitRegister,
    formState: { errors: errorsRegister },
  } = useForm<RegisterFormInputs>({
    mode: "onBlur",
  });

  const onLoginSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const { token } = await login({
        email: data.emailLogin,
        senha: data.passwordLogin,
      }).unwrap();
      dispatch(setCredentials({ token }));
      alert("Login realizado com sucesso!");
      router.push("/");
    } catch (err) {
      console.error("Falha no login:", err);
      alert("Email ou senha inválidos.");
    }
  };

  const onRegisterSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    try {
      await register({
        nome: data.nameRegister,
        email: data.emailRegister,
        senha: data.passwordRegister,
      }).unwrap();
      alert("Cadastro realizado com sucesso! Por favor, faça o login.");
      setActiveTab("login");
    } catch (err) {
      console.error("Falha no cadastro:", err);
      alert(
        "Não foi possível realizar o cadastro. Verifique os dados ou tente outro email."
      );
    }
  };

  const inputClass =
    "mt-1 w-full border border-purple-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500";
  const errorClass = "text-red-500 text-xs mt-1";
  const buttonClass =
    "w-full bg-purple-700 hover:bg-purple-800 text-white py-2 rounded-md font-semibold transition disabled:opacity-50";

  return (
    <main className="flex-1 bg-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="flex border-b border-purple-200 mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "login"
                ? "text-purple-700 border-b-2 border-purple-700"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            {t("loginTab")}
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === "register"
                ? "text-purple-700 border-b-2 border-purple-700"
                : "text-gray-500 hover:text-purple-600"
            }`}
          >
            {t("registerTab")}
          </button>
        </div>

        {activeTab === "login" && (
          <form
            onSubmit={handleSubmitLogin(onLoginSubmit)}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="emailLogin"
                className="block text-sm font-medium text-gray-700"
              >
                {t("email")}
              </label>
              <input
                id="emailLogin"
                type="email"
                className={`${inputClass} ${
                  errorsLogin.emailLogin ? "border-red-500" : ""
                }`}
                {...registerLogin("emailLogin", {
                  required: t("errorEmailRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("errorEmailInvalid"),
                  },
                })}
              />
              {errorsLogin.emailLogin && (
                <p className={errorClass}>{errorsLogin.emailLogin.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="passwordLogin"
                className="block text-sm font-medium text-gray-700"
              >
                {t("password")}
              </label>
              <input
                id="passwordLogin"
                type="password"
                className={`${inputClass} ${
                  errorsLogin.passwordLogin ? "border-red-500" : ""
                }`}
                {...registerLogin("passwordLogin", {
                  required: t("errorPasswordRequired"),
                  minLength: {
                    value: 6,
                    message: t("errorPasswordMinLength"),
                  },
                })}
              />
              {errorsLogin.passwordLogin && (
                <p className={errorClass}>
                  {errorsLogin.passwordLogin.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={buttonClass}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? t("submittingLogin") : t("loginBtn")}
            </button>
          </form>
        )}

        {activeTab === "register" && (
          <form
            onSubmit={handleSubmitRegister(onRegisterSubmit)}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="nameRegister"
                className="block text-sm font-medium text-gray-700"
              >
                {t("name")}
              </label>
              <input
                id="nameRegister"
                type="text"
                className={`${inputClass} ${
                  errorsRegister.nameRegister ? "border-red-500" : ""
                }`}
                {...registerRegister("nameRegister", {
                  required: t("errorNameRequired"),
                })}
              />
              {errorsRegister.nameRegister && (
                <p className={errorClass}>
                  {errorsRegister.nameRegister.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="emailRegister"
                className="block text-sm font-medium text-gray-700"
              >
                {t("email")}
              </label>
              <input
                id="emailRegister"
                type="email"
                className={`${inputClass} ${
                  errorsRegister.emailRegister ? "border-red-500" : ""
                }`}
                {...registerRegister("emailRegister", {
                  required: t("errorEmailRequired"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("errorEmailInvalid"),
                  },
                })}
              />
              {errorsRegister.emailRegister && (
                <p className={errorClass}>
                  {errorsRegister.emailRegister.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="passwordRegister"
                className="block text-sm font-medium text-gray-700"
              >
                {t("password")}
              </label>
              <input
                id="passwordRegister"
                type="password"
                className={`${inputClass} ${
                  errorsRegister.passwordRegister ? "border-red-500" : ""
                }`}
                {...registerRegister("passwordRegister", {
                  required: t("errorPasswordRequired"),
                  minLength: {
                    value: 6,
                    message: t("errorPasswordMinLength"),
                  },
                })}
              />
              {errorsRegister.passwordRegister && (
                <p className={errorClass}>
                  {errorsRegister.passwordRegister.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className={buttonClass}
              disabled={isRegistering}
            >
              {isRegistering ? t("submittingRegister") : t("registerBtn")}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
