import { getConfig } from "./template";

import config from "../../app-config.json";

const apiUrl = config.template.apiUrl;
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmY2FrcWpvcWJpcW5qYmdmc2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzOTU1OTYsImV4cCI6MjA1Nzk3MTU5Nn0.GoeNNjqr833dtla8kb730tVhEEaPoV84ykoNjkedscY";

export async function fetchData(path: string, fallbackValue: any = []) {
  try {
    const response = await fetch(`${apiUrl}${path}?apikey=${apiKey}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("An error occurred while fetching data. Falling back to default value!", error);
    return fallbackValue;
  }
}

const API_URL = getConfig((config) => config.template.apiUrl);

const mockUrls = import.meta.glob<{ default: string }>("../mock/*.json", {
  query: "url",
  eager: true,
});

export async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = API_URL
    ? `${API_URL}${path}?apikey=${apiKey}`
    : mockUrls[`../mock${path}.json`]?.default;

  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  const response = await fetch(url, options);
  return response.json() as T;
}

export async function requestWithFallback<T>(
  path: string,
  fallbackValue: T
): Promise<T> {
  try {
    return await request<T>(path);
  } catch (error) {
    console.warn(
      "An error occurred while fetching data. Falling back to default value!"
    );
    console.warn({ path, error, fallbackValue });
    return fallbackValue;
  }
}

export async function requestWithPost<P, T>(
  path: string,
  payload: P
): Promise<T> {
  return await request<T>(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
