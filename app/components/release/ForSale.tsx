import ExternalLink from "~/components/common/ExternalLink";

interface ForSaleProps {
  currency: string;
  lowestPrice: number | null;
  numForSale: number;
  to: string;
}

export default function ForSale({
  currency,
  lowestPrice,
  numForSale,
  to,
}: ForSaleProps) {
  return (
    <div className="px-4 py-2">
      {lowestPrice !== null && numForSale > 0 ? (
        <>
          <ExternalLink
            className="block font-semibold text-2xl"
            href={to}
            visited
          >
            {numForSale} for sale
          </ExternalLink>
          <div>
            <span className="text-neutral-500">from </span>
            <span className="font-semibold text-orange-700">
              {new Intl.NumberFormat(undefined, {
                style: "currency",
                currency,
              }).format(lowestPrice)}
            </span>
          </div>
        </>
      ) : (
        <>
          <span className="block font-semibold text-2xl text-neutral-300">
            -
          </span>
          <span className="block text-neutral-500">None for sale</span>
        </>
      )}
    </div>
  );
}
