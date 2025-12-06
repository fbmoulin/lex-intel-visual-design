/**
 * Header Component Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 * @vitest-environment jsdom
 */

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { Header } from "./Header";

// Mock wouter
vi.mock("wouter", () => ({
  Link: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className} data-testid="link">
      {children}
    </a>
  ),
}));

// Mock ThemeContext
const mockToggleTheme = vi.fn();
let mockTheme = "light";

vi.mock("@/contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: mockTheme,
    toggleTheme: mockToggleTheme,
  }),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Scale: () => <div data-testid="scale-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
}));

describe("Header", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = "light";
  });

  describe("branding", () => {
    it("renders the application title", () => {
      render(<Header />);

      expect(screen.getByText("Lex Intel Visual Design")).toBeInTheDocument();
    });

    it("renders the subtitle", () => {
      render(<Header />);

      expect(screen.getByText("Desenvolvido por Lex Intelligentia")).toBeInTheDocument();
    });

    it("renders the Scale icon", () => {
      render(<Header />);

      expect(screen.getByTestId("scale-icon")).toBeInTheDocument();
    });

    it("links to home page", () => {
      render(<Header />);

      const links = screen.getAllByTestId("link");
      const homeLink = links.find(link => link.getAttribute("href") === "/");
      expect(homeLink).toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("renders Templates navigation link", () => {
      render(<Header />);

      expect(screen.getByText("Templates")).toBeInTheDocument();
    });

    it("renders Minhas Petitions navigation link", () => {
      render(<Header />);

      expect(screen.getByText("Minhas Petições")).toBeInTheDocument();
    });

    it("renders Começar Agora button", () => {
      render(<Header />);

      expect(screen.getByText("Começar Agora")).toBeInTheDocument();
    });

    it("Templates link points to /templates", () => {
      render(<Header />);

      const links = screen.getAllByTestId("link");
      const templatesLinks = links.filter(link => link.getAttribute("href") === "/templates");
      expect(templatesLinks.length).toBeGreaterThan(0);
    });

    it("Minhas Petições link points to /my-petitions", () => {
      render(<Header />);

      const links = screen.getAllByTestId("link");
      const petitionsLink = links.find(link => link.getAttribute("href") === "/my-petitions");
      expect(petitionsLink).toBeInTheDocument();
    });
  });

  describe("theme toggle", () => {
    it("renders theme toggle button", () => {
      render(<Header />);

      const button = screen.getByTitle(/alternar para modo/i);
      expect(button).toBeInTheDocument();
    });

    it("shows Moon icon in light mode", () => {
      mockTheme = "light";
      render(<Header />);

      expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    });

    it("shows Sun icon in dark mode", () => {
      mockTheme = "dark";
      render(<Header />);

      expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    });

    it("calls toggleTheme when button is clicked", async () => {
      const user = userEvent.setup();
      render(<Header />);

      const button = screen.getByTitle(/alternar para modo/i);
      await user.click(button);

      expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    it("has correct title in light mode", () => {
      mockTheme = "light";
      render(<Header />);

      const button = screen.getByTitle("Alternar para modo escuro");
      expect(button).toBeInTheDocument();
    });

    it("has correct title in dark mode", () => {
      mockTheme = "dark";
      render(<Header />);

      const button = screen.getByTitle("Alternar para modo claro");
      expect(button).toBeInTheDocument();
    });
  });

  describe("structure", () => {
    it("renders as header element", () => {
      render(<Header />);

      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("has sticky positioning class", () => {
      render(<Header />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("sticky");
    });

    it("has border-b class for bottom border", () => {
      render(<Header />);

      const header = screen.getByRole("banner");
      expect(header).toHaveClass("border-b");
    });
  });
});
