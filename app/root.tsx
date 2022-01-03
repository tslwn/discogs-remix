import NProgress from 'nprogress';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useTransition,
} from 'remix';
import type { LinksFunction } from 'remix';
import RouteChangeAnnouncement from '~/components/RouteChangeAnnouncement';
import appStyles from '~/styles/app.css';
import nProgressStyles from '~/styles/nprogress.css';
import React from 'react';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: appStyles },
    { rel: 'stylesheet', href: nProgressStyles },
  ];
};

export default function App() {
  const transition = useTransition();

  React.useEffect(() => {
    if (transition.state === 'idle') {
      NProgress.done();
    } else {
      NProgress.start();
    }
  }, [transition.state]);

  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
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
