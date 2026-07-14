const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is not configured. Check your .env file.",
  );
}

interface ApiErrorResponse {
  message?: string;
  title?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getErrorMessage(
  errorResponse: ApiErrorResponse | null,
  fallbackMessage: string,
): string {
  if (errorResponse?.message) {
    return errorResponse.message;
  }

  if (errorResponse?.errors) {
    const validationMessages = Object.values(
      errorResponse.errors,
    ).flat();

    if (validationMessages.length > 0) {
      return validationMessages.join(" ");
    }
  }

  if (errorResponse?.title) {
    return errorResponse.title;
  }

  return fallbackMessage;
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText);
  } catch {
    return responseText;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    const errorResponse =
      typeof responseBody === "object" && responseBody !== null
        ? (responseBody as ApiErrorResponse)
        : null;

    const fallbackMessage =
      typeof responseBody === "string" && responseBody
        ? responseBody
        : "Something went wrong. Please try again.";

    throw new ApiError(
      getErrorMessage(errorResponse, fallbackMessage),
      response.status,
    );
  }

  return responseBody as T;
}