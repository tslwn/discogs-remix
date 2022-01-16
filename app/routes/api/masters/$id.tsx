import clsx from "clsx";
import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import Collapsible from "~/components/common/Collapsible";
import Link from "~/components/common/Link";
import Page from "~/components/common/Page";
import HeadingMasters from "~/components/release/HeadingMasters";
import type { Master, MasterVersions } from "~/types/discojs";
import { getDiscogsClient, requireAuthSession } from "~/util/auth.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const session = await requireAuthSession(request);
  const client = await getDiscogsClient(request);

  const currAbbr = session.get("curr_abbr");
  invariant(typeof currAbbr === "string", "expected curr_abbr");

  const master = await client.getMaster(id);
  const masterVersions = await client.getMasterVersions(id);

  return {
    currAbbr,
    master,
    masterVersions,
  };
};

interface LoaderData {
  currAbbr: string;
  master: Master;
  masterVersions: MasterVersions;
}

export default function Route() {
  const { master, masterVersions } = useLoaderData<LoaderData>();

  return (
    <Page>
      <div className="mb-8">
        <HeadingMasters
          artists={master.artists}
          title={master.title}
          images={master.images}
          year={master.year}
          genres={master.genres}
          styles={master.styles}
        />
      </div>
      <div className="mb-4">
        <Collapsible
          defaultOpen
          heading="Tracklist"
          panel={
            <ul className="mb-2">
              {master.tracklist.map((track) => (
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
                {masterVersions.versions.map((version) => (
                  <tr key={version.id}>
                    <td>
                      <Link to={`/api/releases/${version.id}`} visited>
                        {version.title !== master.title ? version.title : null}{" "}
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
