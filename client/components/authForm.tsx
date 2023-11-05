"use client";

import Link from "next/link";
import { Input } from "antd";
import { useState } from "react";
import { Auth } from "aws-amplify";
import { useRouter } from "next/navigation";

import Code from "@/components/code";
import Heading from "@/components/ui/heading";
import useCustomMessage from "@/hooks/useCustomMessage";

const AuthForm = ({ type }: { type: "signUp" | "signIn" }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);

  const { push } = useRouter();

  const { error, contextHolder } = useCustomMessage();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const authData: {
        username: string;
        password: string;
        attributes?: {
          email: string;
        };
      } = {
        username,
        password,
      };
      if (type === "signUp") {
        authData.attributes = {
          email: username,
        };
      }
      await Auth[type](authData);
      if (type === "signUp") {
        setAuthSuccess(true);
      } else {
        push("/");
      }
    } catch (err: any) {
      if (type === "signIn") {
        if (err?.code === "UserNotConfirmedException") {
          await Auth.resendSignUp(username);
          setAuthSuccess(true);
        } else if (err?.code === "UserNotFoundException") {
          error(
            "User account with this email does not exists. Please try to sign up first."
          );
          setTimeout(() => {
            push("/signup");
          }, 3000);
        } else {
          error(err?.message);
        }
      } else if (type === "signUp") {
        if (err?.code === "UsernameExistsException") {
          error(
            "User account with this email already exists. Please try to login in first."
          );
          setTimeout(() => {
            push("/login");
          }, 3000);
        } else {
          error(err?.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col max-w-[30em] min-h-[40rem] mx-auto p-5 space-y-5 justify-center items-center">
      {contextHolder}
      <Heading title={type === "signUp" ? "Sign Up" : "Login"} />
      <small>
        {type === "signUp"
          ? "Please login first to manage events."
          : "User should have an account to manage events."}
      </small>
      {!authSuccess ? (
        <>
          <div className="flex flex-col w-full">
            <small>Email:</small>
            <Input
              placeholder="john@gmail.com"
              name="email"
              className="bg-transparent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex flex-col w-full">
            <small>Password:</small>
            <Input.Password
              placeholder="john1234"
              name="password"
              className="bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <small>
            {type === "signUp" ? "Old user?" : "New user?"}{" "}
            <Link
              href={type === "signUp" ? "/login" : "/signup"}
              className="underline"
            >
              {type === "signUp" ? "Login here" : "SignUp here"}
            </Link>
          </small>
          <button
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
            className="py-1 bg-sky-700 text-white max-w-max px-2 rounded-md cursor-pointer"
          >
            {type === "signUp" ? "SignUp" : "Login"}
          </button>
        </>
      ) : (
        <Code username={username} />
      )}
    </form>
  );
};

export default AuthForm;
