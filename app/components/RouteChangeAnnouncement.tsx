import React from "react";
import { useLocation } from "remix";

const RouteChangeAnnouncement = React.memo(() => {
  const [hydrated, setHydrated] = React.useState(false);

  const [innerHtml, setInnerHtml] = React.useState("");

  const location = useLocation();

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const firstRenderRef = React.useRef(true);

  React.useEffect(() => {
    // We don't want to announce the initial page load, so skip the first render.
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    const pageTitle = location.pathname === "/" ? "Home page" : document.title;

    setInnerHtml(`Navigated to ${pageTitle}`);
  }, [location.pathname]);

  // Don't render anything on the server.
  if (!hydrated) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      aria-atomic
      id="route-change-region"
      style={{
        border: "0",
        clipPath: "inset(100%)",
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: "0",
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      }}
    >
      {innerHtml}
    </div>
  );
});

export default RouteChangeAnnouncement;
