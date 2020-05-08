import React, { useEffect, createRef } from "react";
import lottie from "lottie-web";
import animation from "../images/pulpo.json";

export default () => {
  const animationContainer = createRef();

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animation,
    });
    return () => anim.destroy();
  }, []);

  return (
    <div style={{ width: "50%", maxWidth: 500 }} ref={animationContainer} />
  );
};
