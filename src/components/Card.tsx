import React from "react";

export default ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div
      className="card"
      style={{ minWidth: 250, marginRight: 16, boxSizing: "content-box" }}
    >
      <img src="https://picsum.photos/400/300/?random" className="w-100" />
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
};
