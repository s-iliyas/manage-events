"use client";

import { Input } from "antd";
import { useState } from "react";
import { Auth } from "aws-amplify";
import { useRouter } from "next/navigation";

const Code = ({ username }: { username: string }) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const { push } = useRouter();

  const handleCode = async () => {
    setLoading(true);
    try {
      await Auth.confirmSignUp(username, code);
      push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <strong>Verification code has sent to your email.</strong>
      <div className="flex flex-col w-full">
        <small>Code:</small>
        <Input
          placeholder="123456"
          name="code"
          className="bg-transparent"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        onClick={handleCode}
        className="py-1 bg-sky-700 text-white max-w-max px-2 rounded-md cursor-pointer"
      >
        Submit
      </button>
    </>
  );
};

export default Code;
