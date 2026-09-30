"use client";

import { useEffect } from "react";

export function useDocumentTitle(
  title: string,
  restoreTitle?: string
) {
  useEffect(() => {
    const previousTitle =
      document.title;

    document.title = title;

    return () => {
      document.title =
        restoreTitle ?? previousTitle;
    };
  }, [title, restoreTitle]);
}