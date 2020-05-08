export default (...args: any[]) => {
  if (typeof window === "undefined" || !(window as any).ga) {
    return;
  }

  return (window as any).ga(...args);
};
