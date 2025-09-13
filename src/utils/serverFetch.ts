/**
 * Server-side fetch wrapper with proper error handling and type safety
 * Similar to useFetchWrapper but for API routes and server-side operations
 */
import { joinURL } from "./helpers";

export interface ServerFetchOptions extends RequestInit {
  baseURL?: string;
}

export interface IServerFetchError {
  status?: number;
  statusText?: string;
  body?: string;
}

export class ServerFetchError extends Error implements IServerFetchError {
  status?: number;
  statusText?: string;
  body?: string;

  constructor(message: string, status?: number, statusText?: string, body?: string) {
    super(message);
    this.name = 'ServerFetchError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}

export async function serverFetch<T = unknown>(
  url: string,
  options: ServerFetchOptions = {}
): Promise<T> {
  const { baseURL = "", ...fetchOptions } = options;
  const fullUrl = baseURL ? joinURL(baseURL, url) : url;

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const bodyText = await response.text().catch(() => "");
      throw new ServerFetchError(
        `HTTP ${response.status}: ${bodyText || response.statusText}`,
        response.status,
        response.statusText,
        bodyText
      );
    }

    // Try to parse as JSON, fallback to text if it fails
    try {
      return (await response.json()) as T;
    } catch {
      // If JSON parsing fails, return the text content
      return (await response.text()) as unknown as T;
    }
  } catch (error) {
    if (error instanceof ServerFetchError) {
      throw error;
    }
    
    // Convert unknown errors to ServerFetchError
    const message = error instanceof Error ? error.message : String(error);
    throw new ServerFetchError(`Fetch failed: ${message}`);
  }
}

/**
 * Specialized function for form-encoded POST requests (like OAuth token refresh)
 */
export async function serverFetchForm<T = unknown>(
  url: string,
  formData: Record<string, string>,
  options: Omit<ServerFetchOptions, 'body' | 'method'> = {}
): Promise<T> {
  return serverFetch<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...options.headers,
    },
    body: new URLSearchParams(formData).toString(),
  });
}
