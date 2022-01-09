import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import React from 'react';

interface CollapsibleProps {
  defaultOpen?: boolean;
  heading: string;
  panel: React.ReactNode;
}

export default function Collapsible({
  defaultOpen,
  heading,
  panel,
}: CollapsibleProps) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button className="bg-neutral-200 hover:bg-neutral-300 font-semibold focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 flex items-center justify-between mb-2 px-4 py-2 rounded-lg w-full">
            <h4>{heading}</h4>
            {open ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </Disclosure.Button>
          <Disclosure.Panel className="px-4 py-2">{panel}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
