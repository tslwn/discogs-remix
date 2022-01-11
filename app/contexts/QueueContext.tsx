import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "remix";
import { decodeItem, encodeItem } from "~/lib/queue";
import { Queue, QueueItem } from "~/types/queue";

function useLocalStorage<Value>(key: string, defaultValue: Value) {
  const [value, setValue] = React.useState<Value>(defaultValue);

  React.useEffect(() => {
    const getLocalStorageItem = () => {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : [];
    };
    setValue(getLocalStorageItem());
  }, [key]);

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

const MAX_HISTORY = 50;

interface QueueContextValue {
  queue: Queue;
  history: Queue;

  isEmpty: () => boolean;
  current: () => QueueItem | undefined;
  enqueue: (item: QueueItem) => void;
  dequeue: () => void;
  clear: () => void;
}

const QueueContext = React.createContext<QueueContextValue | null>(null);

export function QueueProvider({ children }: React.PropsWithChildren<{}>) {
  const [queue, setQueue] = useLocalStorage<Queue>("queue", []);

  const [history, setHistory] = useLocalStorage<Queue>("history", []);

  const isEmpty = () => queue.length === 0;

  const current = () => (!isEmpty() ? decodeItem(queue[0]) : undefined);

  const enqueue = (item: QueueItem) => {
    setQueue((prev) => [...prev.slice(0), encodeItem(item)]);
  };

  const dequeue = () => {
    const item = current();
    if (item !== undefined) {
      setHistory((prev) => [
        ...prev.slice(Math.max(prev.length - MAX_HISTORY, 0)),
        item,
      ]);
      setQueue((prev) => prev.slice(1));
    }
  };

  const clear = () => {
    dequeue();
    setQueue([]);
  };

  const navigate = useNavigate();

  useHotkeys("q", () => {
    navigate("/api/queue");
  });
  useHotkeys("shift+alt+right", dequeue, [queue]);

  const value = {
    queue: queue.map((item) => decodeItem(item)),
    history: history.map((item) => decodeItem(item)),
    isEmpty,
    current,
    enqueue,
    dequeue,
    clear,
  };

  return (
    <QueueContext.Provider value={value}>{children}</QueueContext.Provider>
  );
}

export function useQueue() {
  const context = React.useContext(QueueContext);

  if (context === null) {
    throw new Error("useQueue must be used within a QueueProvider");
  }

  return context;
}
