export interface QueueItem {
  id: number;
  artists: string;
  title: string;
  src?: string;
}

export type Queue = QueueItem[];
