/**
 * Generic envelope types matching the Laravel API's response shape.
 * Every controller in `backend/app/Http/Controllers` returns data
 * wrapped in this contract via `app/Http/Resources` and the
 * `ApiResponse` helper — keep the two in sync.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
