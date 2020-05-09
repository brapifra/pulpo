import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import ga from "../utils/ga";

const defaultTitle = (() => {
  if (Math.random() > 0.5) {
    return "Share";
  }

  return "Add this to your resume";
})();

export default ({ user }: { user: string }) => {
  const [result, setResult] = React.useState<string>();
  const [shareButtonTitle, setShareButtonTitle] = useLocalStorage(
    "shareButtonTitle",
    ""
  );

  if (!shareButtonTitle) {
    ga("send", "event", shareButtonTitle, "set", user);
    setShareButtonTitle(defaultTitle);
  }

  return (
    <div style={{ marginTop: 14, textAlign: "center" }}>
      {result && <p>{result}</p>}
      <button
        className="btn"
        onClick={() => {
          ga("send", "event", shareButtonTitle, "click", user);
          const result = "This feature is not supported yet.";
          setResult(
            `${result} You will have to ${
              shareButtonTitle === "Share"
                ? "take a screenshot"
                : "copy-paste it"
            } in the meantime :)`
          );
        }}
      >
        {shareButtonTitle}
      </button>
    </div>
  );
};
