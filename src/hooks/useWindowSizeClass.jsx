import { useEffect, useState } from "react";

export function useWindowSizeClass() {
  const [sizeClass, setSizeClass] = useState(getSizeClass(window.innerWidth));

  useEffect(() => {
    const handleResize = () => {
      setSizeClass(getSizeClass(window.innerWidth));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return sizeClass;
}

function getSizeClass(width) {
  if (width < 600) return "compact";
  if (width < 1240) return "medium";
  return "expanded";
}
