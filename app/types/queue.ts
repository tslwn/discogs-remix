export interface QueueItem {
  id: number;
  artists: string;
  title: string;
  src?: string;
  type: "master" | "release";
}

export type Queue = QueueItem[];
