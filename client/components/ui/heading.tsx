import React from "react";

const Heading = ({ title }: { title: string }) => {
  return <strong className="text-2xl text-gray-700 py-1">{title}</strong>;
};

export default Heading;
