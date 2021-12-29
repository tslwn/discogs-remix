import * as React from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLocation,
  useLoaderData,
} from 'remix';
import type { LinksFunction, LoaderFunction } from 'remix';

import appStyleUrl from '~/styles/app.css';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'preconnect',
      href: '//fonts.gstatic.com',
      crossOrigin: 'anonymous',
    },
    { rel: 'stylesheet', href: appStyleUrl },
    {
      rel: 'stylesheet',
      href: '//fonts.googleapis.com/css?family=Inter:300,400,600,700&amp;lang=en',
    },
  ];
};

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export const loader: LoaderFunction = async () => {
  return {
    ENV: {},
    data: '',
  };
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const data = useLoaderData();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <RouteChangeAnnouncement />
        <ScrollRestoration />
        {data && data.ENV && (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
        )}
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: React.PropsWithChildren<{}>) {
  return <>{children}</>;
}

export function CatchBoundary() {
  const caught = useCatch();

  let message;

  switch (caught.status) {
    case 401:
      message = <p>You do not have access to that page.</p>;
      break;
    case 404:
      message = <p>That page does not exist.</p>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error">
      <Layout>
        <div>
          <h1>An error occurred.</h1>
          <p>{error.message}</p>
        </div>
      </Layout>
    </Document>
  );
}

const RouteChangeAnnouncement = React.memo(() => {
  const [hydrated, setHydrated] = React.useState(false);

  const [innerHtml, setInnerHtml] = React.useState('');

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

    const pageTitle = location.pathname === '/' ? 'Home page' : document.title;

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
        border: '0',
        clipPath: 'inset(100%)',
        clip: 'rect(0 0 0 0)',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        padding: '0',
        position: 'absolute',
        width: '1px',
        whiteSpace: 'nowrap',
        wordWrap: 'normal',
      }}
    >
      {innerHtml}
    </div>
  );
});
