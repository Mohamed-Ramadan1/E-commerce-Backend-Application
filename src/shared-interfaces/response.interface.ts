export interface ApiResponse<T> {
  status: string;
  results?: number;
  data: T;
}
