import { Task } from "./task";

export interface Meta {
  path: string;
  current_page: number;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
}

export interface Tasks {
  data: Task[];
  meta: Meta;
}
