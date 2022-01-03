import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import React from 'react';

interface CollapsibleProps {
  heading: string;
  panel: React.ReactNode;
}

export default function Collapsible({ heading, panel }: CollapsibleProps) {
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button>
            <div className="flex items-center mb-2">
              <h4 className="font-semibold mr-2">{heading}</h4>
              {open ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
          </Disclosure.Button>
          <Disclosure.Panel>{panel}</Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
