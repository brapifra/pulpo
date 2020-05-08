import React from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import ga from "../utils/ga";

const defaultTitle = (() => {
  if (Math.random() > 0.5) {
    return "Share";
  }

  return "Include this in your CV";
})();

export default ({ email }: { email: string }) => {
  const [result, setResult] = React.useState<string>();
  const [shareButtonTitle, setShareButtonTitle] = useLocalStorage(
    "shareButtonTitle",
    ""
  );

  if (!shareButtonTitle) {
    setShareButtonTitle(defaultTitle);
  }

  return (
    <>
      {result && <p>{result}</p>}
      <button
        className="btn"
        onClick={() => {
          ga("send", "event", shareButtonTitle, "click", email);
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
    </>
  );
};
