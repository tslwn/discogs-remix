import { SearchType } from "~/util/discogs";

export interface QueueItem {
  id: number;
  artists: string;
  title: string;
  src?: string;
  type: SearchType;
}

export type Queue = QueueItem[];
