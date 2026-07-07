"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function BienDetailTracker({ bienId }: { bienId: string }) {
  useEffect(() => {
    void trackEvent("vue_bien", bienId);
  }, [bienId]);

  return null;
}
