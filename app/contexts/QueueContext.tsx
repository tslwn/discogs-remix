import React from 'react';
import { Queue } from '~/types/queue';

interface QueueContextValue {
  queue: Queue;
  setQueue: React.Dispatch<React.SetStateAction<Queue>>;
}

const QueueContext = React.createContext<QueueContextValue | null>(null);

export function QueueProvider({ children }: React.PropsWithChildren<{}>) {
  const [queue, setQueue] = React.useState<Queue>([]);

  React.useEffect(() => {
    const getLocalStorageItem = () => {
      const item = localStorage.getItem('queue');
      return item !== null ? JSON.parse(item) : [];
    };
    setQueue(getLocalStorageItem());
  }, []);

  React.useEffect(() => {
    localStorage.setItem('queue', JSON.stringify(queue));
  }, [queue]);

  const value = { queue, setQueue };

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
}

export function useQueue() {
  const context = React.useContext(QueueContext);

  if (context === null) {
    throw new Error('useQueue must be used within a QueueProvider');
  }

  return context;
}
