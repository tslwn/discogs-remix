import type { DataFunctionArgs } from "@remix-run/server-runtime";
import clsx from "clsx";
import { useLoaderData } from "remix";
import invariant from "tiny-invariant";
import Collapsible from "~/components/common/Collapsible";
import Link from "~/components/common/Link";
import Page from "~/components/common/Page";
import HeadingMasters from "~/components/release/HeadingMasters";
import type { LoaderData } from "~/types/loaders";
import { getDiscogsClient } from "~/util/auth.server";
import { formatReleaseArtistsAndTitle } from "~/util/release";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscogsClient(request);

  const master = await client.getMasterRelease(id);
  const { versions } = await client.getMasterReleaseVersions(id);

  return {
    ...master,
    versions,
  };
};

export const meta = ({ data }: { data: LoaderData<typeof loader> }) => ({
  title: formatReleaseArtistsAndTitle(data.artists, data.title),
});

export default function Route() {
  const { artists, genres, images, styles, title, tracklist, versions, year } =
    useLoaderData<LoaderData<typeof loader>>();

  return (
    <Page>
      <div className="mb-8">
        <HeadingMasters
          artists={artists}
          title={title}
          images={images}
          year={year}
          genres={genres}
          styles={styles}
        />
      </div>
      <div className="mb-4">
        <Collapsible
          defaultOpen
          heading="Tracklist"
          panel={
            <ul className="mb-2">
              {tracklist.map((track) => (
                <li
                  className="flex justify-between"
                  key={`${track.position} ${track.title}`}
                >
                  <span
                    className={clsx(
                      track.type_ !== "track" && "font-semibold my-2"
                    )}
                  >
                    {track.title}
                  </span>
                  <span>{track.duration}</span>
                </li>
              ))}
            </ul>
          }
        />
      </div>
      <div>
        <Collapsible
          heading="Versions"
          panel={
            <table className="mb-2 table-auto text-left w-full">
              <thead>
                <tr>
                  <th className="font-semibold">Title (Format)</th>
                  <th className="font-semibold">Label</th>
                  <th className="font-semibold">Cat #</th>
                  <th className="font-semibold">Country</th>
                  <th className="font-semibold text-right">Year</th>
                </tr>
              </thead>
              <tbody>
                {versions.map((version) => (
                  <tr key={version.id}>
                    <td>
                      <Link to={`/api/releases/${version.id}`} visited>
                        {version.title !== title ? version.title : null}{" "}
                        {version.major_formats}
                      </Link>{" "}
                      <span className="text-xs">{version.format}</span>
                    </td>
                    <td>{version.label}</td>
                    <td>{version.catno}</td>
                    <td>{version.country}</td>
                    <td className="text-right">
                      {version.released !== "0" ? version.released : "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        />
      </div>
    </Page>
  );
}
