import { useState, useEffect } from "react";

export function useViewport() {
  const [isNarrow, setIsNarrow] = useState(false);
  const [isVeryNarrow, setIsVeryNarrow] = useState(false);
  const [isMenuOverLay, setIsMenuOverLay] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMenuOverLay(window.innerWidth < 1380);
      setIsNarrow(window.innerWidth < 1042);
      setIsVeryNarrow(window.innerWidth < 740);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return { isNarrow, isVeryNarrow, isMenuOverLay };
}
