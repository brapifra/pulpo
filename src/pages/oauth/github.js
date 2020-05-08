import React from "react";
import { useLocation } from "@reach/router";

export default function () {
  const location = useLocation();
  const [status, setStatus] = React.useState("Loading...");

  const code = React.useMemo(
    () => new URLSearchParams(location.search).get("code"),
    [location.search]
  );

  React.useEffect(() => {
    if (!code) {
      setStatus("Error!");
    } else {
      fetch(`/api/github/token?code=${code}`)
        .then((res) => res.json())
        .then((res) => {
          window.postMessage({ type: "close", data: res }, "*");
        })
        .catch((error) => setStatus(`Error: ${error.message}`));
    }
  }, [code]);

  return <main>{status}</main>;
}
