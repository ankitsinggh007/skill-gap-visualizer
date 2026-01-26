// Error mapper: Convert backend error envelope to UI-safe message
export function mapApiError(response, errorData) {
  // Map common status codes to user-friendly messages
  const statusMessages = {
    400: "Invalid resume format. Please check your file and try again.",
    405: "API method not allowed. Please contact support.",
    413: "Resume file is too large. Please upload a smaller file.",
    500: "Server error. Please try again later.",
  };

  const message =
    statusMessages[response.status] ||
    errorData?.error?.message ||
    "Failed to extract skills. Please try again.";

  return {
    success: false,
    message,
    status: response.status,
  };
}

export async function extractSkillsFromResume(resumeText) {
  try {
    const res = await fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText }),
    });

    // Check if response is successful
    if (!res.ok) {
      try {
        const errorData = await res.json();
        return mapApiError(res, errorData);
      } catch {
        return mapApiError(res, null);
      }
    }

    return await res.json();
  } catch (error) {
    console.error("Frontend → extract API failed:", error);
    return {
      success: false,
      message: "Network error. Please check your connection and try again.",
      error: error.message,
    };
  }
}
