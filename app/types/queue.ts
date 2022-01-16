import { SearchTypeEnum } from "discojs";

export interface QueueItem {
  id: number;
  artists: string;
  title: string;
  src?: string;
  type: SearchTypeEnum;
}

export type Queue = QueueItem[];
