export const getErrorMessage = (error: any): string => {
  // Check for response data message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // Check for direct error message
  if (error.message) {
    return error.message;
  }

  // Friendly fallback messages based on status code
  const errorMap: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Session expired. Please log in again.',
    403: "You don't have permission to do this.",
    404: 'Resource not found.',
    409: 'This resource already exists.',
    422: 'Invalid data provided.',
    500: 'Server error. Please try again later.',
    502: 'Service temporarily unavailable.',
    503: 'Service unavailable. Please try again later.',
  };

  const statusCode = error.response?.status;
  if (statusCode && errorMap[statusCode]) {
    return errorMap[statusCode];
  }

  return 'Something went wrong. Please try again.';
};
