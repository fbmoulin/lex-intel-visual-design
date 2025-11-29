/**
 * Sanitization Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 */

import { describe, expect, it } from "vitest";
import {
  sanitizeText,
  sanitizeMarkdown,
  containsSuspiciousContent,
  sanitizePetitionData,
  escapeHtml,
} from "./sanitize";

describe("sanitizeText", () => {
  it("removes all HTML tags", () => {
    expect(sanitizeText("<p>Hello</p>")).toBe("Hello");
    expect(sanitizeText("<script>alert('xss')</script>")).toBe("");
    expect(sanitizeText("<div><span>Nested</span></div>")).toBe("Nested");
  });

  it("handles null and undefined", () => {
    expect(sanitizeText(null)).toBe("");
    expect(sanitizeText(undefined)).toBe("");
  });

  it("handles empty string", () => {
    expect(sanitizeText("")).toBe("");
  });

  it("preserves plain text", () => {
    expect(sanitizeText("Hello World")).toBe("Hello World");
    expect(sanitizeText("Test 123")).toBe("Test 123");
  });

  it("trims whitespace", () => {
    expect(sanitizeText("  hello  ")).toBe("hello");
  });

  it("removes XSS payloads", () => {
    expect(sanitizeText('<img src=x onerror="alert(1)">')).toBe("");
    expect(sanitizeText('<svg onload="alert(1)">')).toBe("");
    expect(sanitizeText('javascript:alert(1)')).toBe("javascript:alert(1)");
  });
});

describe("sanitizeMarkdown", () => {
  it("allows safe HTML tags", () => {
    expect(sanitizeMarkdown("<p>Paragraph</p>")).toContain("<p>");
    expect(sanitizeMarkdown("<strong>Bold</strong>")).toContain("<strong>");
    expect(sanitizeMarkdown("<em>Italic</em>")).toContain("<em>");
  });

  it("removes dangerous tags", () => {
    expect(sanitizeMarkdown("<script>alert('xss')</script>")).not.toContain("<script>");
    expect(sanitizeMarkdown("<iframe src='evil.com'></iframe>")).not.toContain("<iframe>");
    expect(sanitizeMarkdown("<style>body{display:none}</style>")).not.toContain("<style>");
  });

  it("removes dangerous attributes", () => {
    const result = sanitizeMarkdown('<p onclick="alert(1)">Click me</p>');
    expect(result).not.toContain("onclick");
    expect(result).toContain("<p>");
  });

  it("handles null and undefined", () => {
    expect(sanitizeMarkdown(null)).toBe("");
    expect(sanitizeMarkdown(undefined)).toBe("");
  });

  it("allows links with href", () => {
    const result = sanitizeMarkdown('<a href="https://example.com">Link</a>');
    expect(result).toContain("href=");
    expect(result).toContain("https://example.com");
  });

  it("adds security attributes to links", () => {
    const result = sanitizeMarkdown('<a href="https://example.com">Link</a>');
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain('target="_blank"');
  });

  it("allows code blocks", () => {
    expect(sanitizeMarkdown("<pre><code>const x = 1;</code></pre>")).toContain("<pre>");
    expect(sanitizeMarkdown("<pre><code>const x = 1;</code></pre>")).toContain("<code>");
  });

  it("allows tables", () => {
    const tableHtml = "<table><tr><td>Cell</td></tr></table>";
    const result = sanitizeMarkdown(tableHtml);
    expect(result).toContain("<table>");
    expect(result).toContain("<tr>");
    expect(result).toContain("<td>");
  });
});

describe("containsSuspiciousContent", () => {
  it("detects script tags", () => {
    expect(containsSuspiciousContent("<script>alert(1)</script>")).toBe(true);
    expect(containsSuspiciousContent("<SCRIPT>alert(1)</SCRIPT>")).toBe(true);
  });

  it("detects javascript: protocol", () => {
    expect(containsSuspiciousContent('javascript:alert(1)')).toBe(true);
    expect(containsSuspiciousContent('JAVASCRIPT:alert(1)')).toBe(true);
  });

  it("detects event handlers", () => {
    expect(containsSuspiciousContent('onclick="alert(1)"')).toBe(true);
    expect(containsSuspiciousContent('onerror="alert(1)"')).toBe(true);
    expect(containsSuspiciousContent('onload="alert(1)"')).toBe(true);
    expect(containsSuspiciousContent('onmouseover="alert(1)"')).toBe(true);
  });

  it("detects iframe tags", () => {
    expect(containsSuspiciousContent("<iframe src='evil.com'></iframe>")).toBe(true);
  });

  it("detects object/embed tags", () => {
    expect(containsSuspiciousContent("<object data='evil.swf'></object>")).toBe(true);
    expect(containsSuspiciousContent("<embed src='evil.swf'>")).toBe(true);
  });

  it("detects data: protocol", () => {
    expect(containsSuspiciousContent('data:text/html,<script>alert(1)</script>')).toBe(true);
  });

  it("returns false for safe content", () => {
    expect(containsSuspiciousContent("Hello World")).toBe(false);
    expect(containsSuspiciousContent("Legal petition text")).toBe(false);
    expect(containsSuspiciousContent("<p>Paragraph</p>")).toBe(false);
  });

  it("handles null and undefined", () => {
    expect(containsSuspiciousContent(null)).toBe(false);
    expect(containsSuspiciousContent(undefined)).toBe(false);
  });
});

describe("sanitizePetitionData", () => {
  it("sanitizes text fields", () => {
    const data = {
      autor: "<script>alert(1)</script>John Doe",
      fatos: "<p>Facts</p>",
      fundamentosJuridicos: "Legal basis",
      pedidos: "Requests<script>xss</script>",
      id: 123,
    };

    const sanitized = sanitizePetitionData(data);

    expect(sanitized.autor).toBe("John Doe");
    expect(sanitized.fatos).toBe("Facts");
    expect(sanitized.fundamentosJuridicos).toBe("Legal basis");
    expect(sanitized.pedidos).toBe("Requests");
    expect(sanitized.id).toBe(123); // Non-text fields unchanged
  });

  it("preserves non-text fields", () => {
    const data = {
      id: 123,
      userId: 456,
      status: "rascunho",
      createdAt: new Date("2025-01-01"),
    };

    const sanitized = sanitizePetitionData(data);

    expect(sanitized.id).toBe(123);
    expect(sanitized.userId).toBe(456);
    expect(sanitized.status).toBe("rascunho");
    expect(sanitized.createdAt).toEqual(new Date("2025-01-01"));
  });

  it("handles missing text fields", () => {
    const data = {
      id: 1,
      title: "Test",
    };

    const sanitized = sanitizePetitionData(data);

    expect(sanitized.id).toBe(1);
    expect(sanitized.title).toBe("Test");
  });
});

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    expect(escapeHtml("<")).toBe("&lt;");
    expect(escapeHtml(">")).toBe("&gt;");
    expect(escapeHtml("&")).toBe("&amp;");
    expect(escapeHtml('"')).toBe("&quot;");
    expect(escapeHtml("'")).toBe("&#39;");
  });

  it("escapes multiple characters", () => {
    expect(escapeHtml("<script>alert('xss')</script>")).toBe(
      "&lt;script&gt;alert(&#39;xss&#39;)&lt;&#x2F;script&gt;"
    );
  });

  it("handles null and undefined", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
  });

  it("preserves safe characters", () => {
    expect(escapeHtml("Hello World")).toBe("Hello World");
    expect(escapeHtml("Test 123")).toBe("Test 123");
  });
});

describe("XSS Attack Vectors", () => {
  // Test common XSS payloads
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    '<body onload=alert(1)>',
    '<iframe src="javascript:alert(1)">',
    '<a href="javascript:alert(1)">click</a>',
    '"><script>alert(String.fromCharCode(88,83,83))</script>',
    '<img src="x" onerror="alert(1)">',
    '<div style="background:url(javascript:alert(1))">',
    '<input onfocus=alert(1) autofocus>',
    '<marquee onstart=alert(1)>',
    '<video><source onerror="alert(1)">',
    '<audio src=x onerror=alert(1)>',
  ];

  xssPayloads.forEach((payload, index) => {
    it(`sanitizeText removes XSS payload #${index + 1}`, () => {
      const result = sanitizeText(payload);
      expect(result).not.toContain("<script");
      expect(result).not.toContain("onerror");
      expect(result).not.toContain("onload");
      expect(result).not.toContain("javascript:");
    });

    it(`containsSuspiciousContent detects XSS payload #${index + 1}`, () => {
      expect(containsSuspiciousContent(payload)).toBe(true);
    });
  });
});
