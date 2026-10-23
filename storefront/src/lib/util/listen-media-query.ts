/** Safari before 14 exposes addListener instead of the EventTarget methods. */
export function listenMediaQuery(query: MediaQueryList, update: () => void) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }

  query.addListener(update)
  return () => query.removeListener(update)
}
