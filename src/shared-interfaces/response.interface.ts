export interface ApiResponse<T> {
  status: string;
  results?: number;
  token?: string;
  data: T;
}
