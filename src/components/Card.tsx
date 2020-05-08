import React from "react";

interface Props {
  title: number;
  description: string;
}

export default ({ title, description }: Props) => {
  return (
    <div className="card" style={{ minWidth: 0, boxSizing: "content-box" }}>
      <h4>
        <b>{title.toLocaleString("en")}</b>
      </h4>
      <p>{description}</p>
    </div>
  );
};
