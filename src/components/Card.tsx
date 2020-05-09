import React from "react";

interface Props {
  title: number | string;
  description: string;
}

export default ({ title, description }: Props) => {
  const formattedTitle = title.toLocaleString("en");
  return (
    <div
      className="card"
      style={{ minWidth: 0, boxSizing: "border-box", height: 166 }}
    >
      <h4 style={{ marginBlockStart: "1.15em", marginBlockEnd: "1.15em" }}>
        <b
          style={{
            fontWeight: "bold",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: "block",
          }}
          title={formattedTitle}
        >
          {formattedTitle}
        </b>
      </h4>
      <p>{description}</p>
    </div>
  );
};
