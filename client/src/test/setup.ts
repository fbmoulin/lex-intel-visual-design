/**
 * Vitest Setup for Client Component Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * This file runs before each test file.
 * Only applies browser mocks when running in jsdom environment.
 */

import { afterEach, vi } from "vitest";

// Only apply browser-specific setup when running in jsdom
if (typeof window !== "undefined") {
  // Import jest-dom matchers only for browser tests
  import("@testing-library/jest-dom/vitest");

  // Import cleanup for React tests
  import("@testing-library/react").then(({ cleanup }) => {
    afterEach(() => {
      cleanup();
    });
  });

  // Mock window.matchMedia for components that use media queries
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    root: null,
    rootMargin: "",
    thresholds: [],
  }));

  // Mock scrollTo
  window.scrollTo = vi.fn();
}
