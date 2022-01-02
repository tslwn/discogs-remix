import React from 'react';

export default function Page({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="overflow-y-auto">
      <div className="p-4">{children}</div>
    </div>
  );
}
