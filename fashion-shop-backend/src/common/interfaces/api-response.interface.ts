export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
  }
  
  export interface ApiErrorResponse {
    success: false;
    message: string;
    error?: string;
    statusCode?: number;
  }
  
  export interface ApiSuccessResponse<T> {
    success: true;
    message: string;
    data: T;
  }