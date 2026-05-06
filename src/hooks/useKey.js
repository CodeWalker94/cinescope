import { useEffect } from "react";

/**
 * Fires `handler` when the specified keyboard key is pressed.
 * Attaches and cleans up the event listener automatically.
 *
 * @param {string} key - The KeyboardEvent.key value to listen for (e.g. "Escape", "Enter")
 * @param {function} handler - Callback to run when the key is pressed
 */
export function useKey(key, handler) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === key) handler(e);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler]);
}
