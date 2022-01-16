import React from "react";

export default function Page({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-y-auto">
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}
