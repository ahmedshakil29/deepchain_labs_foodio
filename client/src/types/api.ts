// src/types/api.ts

export type ApiResponse<T> = {
  message?: string;
  data: T;
};

export type ApiError = {
  message: string;
  statusCode?: number;
};

// ✔ Use when later migrate to:

// RTK Query

// TanStack Query

// Central API layer
