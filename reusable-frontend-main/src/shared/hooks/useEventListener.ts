"use client";

import { useEffect } from "react";

type EventTargetType =
  | Window
  | Document
  | HTMLElement;

export function useEventListener<
  K extends keyof WindowEventMap
>(
  eventName: K,
  handler: (
    event: WindowEventMap[K]
  ) => void,
  element: EventTargetType = window
) {
  useEffect(() => {
    if (!element) return;

    const listener = (
      event: Event
    ) => {
      handler(
        event as WindowEventMap[K]
      );
    };

    element.addEventListener(
      eventName,
      listener
    );

    return () => {
      element.removeEventListener(
        eventName,
        listener
      );
    };
  }, [
    eventName,
    handler,
    element,
  ]);
}