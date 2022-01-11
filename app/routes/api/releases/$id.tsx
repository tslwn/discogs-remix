import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import Collapsible from "~/components/Collapsible";
import Page from "~/components/Page";
import ReleaseHeading from "~/components/ReleaseHeading";
import ForSale from "~/components/release/ForSale";
import Have from "~/components/release/Have";
import Rating from "~/components/release/Rating";
import Videos from "~/components/release/Videos";
import Want from "~/components/release/Want";
import { formatReleaseFormats, primaryOrFirstImage } from "~/lib/release";
import { filterVideos } from "~/lib/videos.server";
import type { Release } from "~/types/discojs";
import { getDiscogsClient, requireAuthSession } from "~/util/auth.server";

interface RouteParams {
  id: number;
}

function isRouteParams(params: any): params is RouteParams {
  return !Number.isNaN(Number(params.id));
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const session = await requireAuthSession(request);
  const client = await getDiscogsClient(request);

  if (!isRouteParams(params)) {
    throw new Error("Expected release ID parameter");
  }

  const currencyAbbreviation: string = session.get("curr_abbr");

  const release = await client.getRelease(params.id);

  return { currencyAbbreviation, release: await filterVideos(release) };
};

export default function Route() {
  const { currencyAbbreviation, release } =
    useLoaderData<{ currencyAbbreviation: string; release: Release }>();

  const src = primaryOrFirstImage(release.images)?.uri;

  return (
    <Page>
      <div className="mb-8">
        <ReleaseHeading
          id={release.id}
          artists={release.artists}
          title={release.title}
          src={src}
          year={release.year}
          country={release.country}
          // TODO: another problem with `discojs` type definitions
          // @ts-ignore
          formats={formatReleaseFormats(release.formats)}
          labels={release.labels}
          genres={release.genres}
          styles={release.styles}
        />
      </div>
      <div className="flex items-center mb-4 space-x-8">
        <Have have={release.community.have} />
        <Want want={release.community.want} />
        <Rating
          average={release.community.rating.average}
          count={release.community.rating.count}
        />
        <ForSale
          currency={currencyAbbreviation}
          lowestPrice={release.lowest_price}
          numForSale={release.num_for_sale}
          to={`https://www.discogs.com/sell/release/${release.id}`}
        />
        <Videos release={release} />
      </div>
      <div className="mb-4">
        <Collapsible
          defaultOpen
          heading="Tracklist"
          panel={
            <table className="mb-2 table-auto w-full">
              <tbody>
                {release.tracklist?.map((track) => (
                  <tr key={`${track.position} ${track.title}`}>
                    {track.type_ !== "track" ? (
                      <td className="font-semibold my-2" colSpan={3}>
                        {track.title}
                      </td>
                    ) : (
                      <>
                        <td className="w-8">{track.position}</td>
                        <td>{track.title}</td>
                        <td className="text-right">{track.duration}</td>
                      </>
                    )}
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
