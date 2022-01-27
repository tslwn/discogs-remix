import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { useLoaderData } from "remix";
import invariant from "tiny-invariant";
import Collapsible from "~/components/common/Collapsible";
import Page from "~/components/common/Page";
import Stat from "~/components/common/Stat";
import ForSale from "~/components/release/ForSale";
import HeadingReleases from "~/components/release/HeadingReleases";
import Rating from "~/components/release/Rating";
import Videos from "~/components/release/Videos";
import { useRouteData } from "~/routes/api";
import type { LoaderData } from "~/types/loaders";
import { getDiscogsClient } from "~/util/auth.server";
import { formatReleaseArtistsAndTitle } from "~/util/release";
import { availableVideos } from "~/util/youtube.server";

export const loader = async ({ params, request }: DataFunctionArgs) => {
  const id = Number(params.id);
  invariant(typeof id === "number", "expected params.id");

  const client = await getDiscogsClient(request);
  const release = await client.getRelease(id);
  const videos = await availableVideos(release.videos);

  return { release: { ...release, videos } };
};

export const meta = ({ data }: { data: LoaderData<typeof loader> }) => ({
  title: formatReleaseArtistsAndTitle(data.release.artists, data.release.title),
});

export default function Route() {
  const { release } = useLoaderData<LoaderData<typeof loader>>();

  const { curr_abbr } = useRouteData();

  return (
    <Page>
      <div className="mb-8">
        <HeadingReleases
          artists={release.artists}
          country={release.country}
          formats={release.formats}
          genres={release.genres}
          images={release.images}
          labels={release.labels}
          styles={release.styles}
          title={release.title}
          year={release.year}
        />
      </div>
      <div className="flex items-center mb-4 space-x-8">
        <Stat
          className="border-green-600"
          text="have"
          value={release.community.have}
        />
        <Stat
          className="border-red-600"
          text="want"
          value={release.community.want}
        />
        <Rating
          average={release.community.rating.average}
          count={release.community.rating.count}
        />
        <ForSale
          currency={curr_abbr}
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
