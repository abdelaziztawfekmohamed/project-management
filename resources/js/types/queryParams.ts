export interface QueryParams {
  name?: string | null;
  status?: string | null;
  sort_field?: string | null;
  sort_direction?: string | null;
  [key: string]: string | null | undefined;
}
