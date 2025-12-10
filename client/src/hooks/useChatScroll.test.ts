/**
 * useChatScroll Hook Tests
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChatScroll } from "./useChatScroll";

describe("useChatScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("refs", () => {
    it("returns containerRef", () => {
      const { result } = renderHook(() => useChatScroll());
      expect(result.current.containerRef).toBeDefined();
      expect(result.current.containerRef.current).toBeNull();
    });

    it("returns scrollAreaRef", () => {
      const { result } = renderHook(() => useChatScroll());
      expect(result.current.scrollAreaRef).toBeDefined();
      expect(result.current.scrollAreaRef.current).toBeNull();
    });

    it("returns inputAreaRef", () => {
      const { result } = renderHook(() => useChatScroll());
      expect(result.current.inputAreaRef).toBeDefined();
      expect(result.current.inputAreaRef.current).toBeNull();
    });
  });

  describe("minHeightForLastMessage", () => {
    it("returns 0 initially", () => {
      const { result } = renderHook(() => useChatScroll());
      expect(result.current.minHeightForLastMessage).toBe(0);
    });

    it("returns 0 when enableMinHeight is false", () => {
      const { result } = renderHook(() =>
        useChatScroll({ enableMinHeight: false })
      );
      expect(result.current.minHeightForLastMessage).toBe(0);
    });
  });

  describe("scrollToBottom", () => {
    it("returns a function", () => {
      const { result } = renderHook(() => useChatScroll());
      expect(typeof result.current.scrollToBottom).toBe("function");
    });

    it("does not throw when called without refs", () => {
      const { result } = renderHook(() => useChatScroll());
      expect(() => {
        act(() => {
          result.current.scrollToBottom();
        });
      }).not.toThrow();
    });

    it("scrollToBottom is memoized", () => {
      const { result, rerender } = renderHook(() => useChatScroll());
      const firstScrollToBottom = result.current.scrollToBottom;
      rerender();
      expect(result.current.scrollToBottom).toBe(firstScrollToBottom);
    });
  });

  describe("options", () => {
    it("accepts empty options", () => {
      const { result } = renderHook(() => useChatScroll({}));
      expect(result.current).toBeDefined();
    });

    it("accepts enableMinHeight option", () => {
      const { result } = renderHook(() =>
        useChatScroll({ enableMinHeight: true })
      );
      expect(result.current.minHeightForLastMessage).toBe(0);
    });
  });
});
