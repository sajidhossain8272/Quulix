"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Suspense } from "react";

function FacebookPixelInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_FB_PIXEL_ID) return;

    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.NEXT_PUBLIC_FB_PIXEL_ID as string);
        ReactPixel.pageView();
      });
  }, [pathname, searchParams]);

  return null;
}

export function FacebookPixel() {
  return (
    <Suspense fallback={null}>
      <FacebookPixelInner />
    </Suspense>
  );
}
