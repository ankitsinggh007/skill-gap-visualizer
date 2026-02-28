export function mapApiError(response, errorData, fallbackMessage) {
  const statusMessages = {
    400: "Invalid resume format. Please check your file and try again.",
    405: "API method not allowed. Please contact support.",
    413: "Resume file is too large. Please upload a smaller file.",
    429: "Too many requests. Please wait a moment and try again.",
    500: "Server error. Please try again later.",
    503: "Service temporarily unavailable. Please try again shortly.",
  };

  const message =
    statusMessages[response?.status] ||
    errorData?.error?.message ||
    fallbackMessage ||
    "Request failed. Please try again.";

  return {
    success: false,
    message,
    status: response?.status,
  };
}
