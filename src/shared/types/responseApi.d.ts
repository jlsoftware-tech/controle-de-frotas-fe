import type { TypeOptions } from 'react-toastify';

export type ValidationErrors = Record<string, string[]>;

export type ApiEnvelope<T> = {
  success: boolean;
  status_code: number;
  message: string;
  data: T | null;
};

/** Resposta normalizada pelos helpers de `axiosRequest`. */
export type ApiResponse<T> = {
  success: boolean;
  status_code?: number;
  message: string;
  data?: T;
  errors?: ValidationErrors;
  type: TypeOptions;
};

/** Metadados de paginação do `PaginatedCollection` do backend. */
export type Pagination = {
  numPerPage: number;
  currPage: number;
  totalEntries: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export type PaginationParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type SortParams<TField extends string> = {
  sort?: TField;
  order?: 'asc' | 'desc';
};
