import { vi } from "vitest";

// Provides a mock for import.meta.env.VITE_API_URL used by api/client.ts
vi.stubEnv("VITE_API_URL", "http://localhost:3000/api");
