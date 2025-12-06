/**
 * AIChatBox Component Tests
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 * @vitest-environment jsdom
 */

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

// Create mock functions using vi.hoisted (since vi.mock is hoisted)
const { mockToastError, mockAiChat } = vi.hoisted(() => ({
  mockToastError: vi.fn(),
  mockAiChat: vi.fn(() => ({ allowed: true, retryAfterMs: 0 })),
}));

// Mock dependencies
vi.mock("sonner", () => ({
  toast: {
    error: mockToastError,
    success: vi.fn(),
  },
}));

vi.mock("@/lib/rateLimit", () => ({
  RateLimiters: {
    aiChat: mockAiChat,
  },
}));

// Mock streamdown
vi.mock("streamdown", () => ({
  Streamdown: ({ children }: { children: string }) => <div data-testid="streamdown">{children}</div>,
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Loader2: ({ className }: { className: string }) => <div className={className} data-testid="loader" />,
  Send: () => <div data-testid="send-icon" />,
  User: () => <div data-testid="user-icon" />,
  Sparkles: () => <div data-testid="sparkles-icon" />,
}));

import { AIChatBox, Message } from "./AIChatBox";

describe("AIChatBox", () => {
  const mockOnSendMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    // Reset rate limiter mock
    mockAiChat.mockReturnValue({ allowed: true, retryAfterMs: 0 });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("empty state", () => {
    it("renders empty state message when no messages", () => {
      render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          emptyStateMessage="Start chatting with AI"
        />
      );

      expect(screen.getByText("Start chatting with AI")).toBeInTheDocument();
    });

    it("renders default empty state message", () => {
      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      expect(screen.getByText("Start a conversation with AI")).toBeInTheDocument();
    });

    it("renders suggested prompts in empty state", () => {
      const prompts = ["Tell me about legal procedures", "Explain habeas corpus"];

      render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          suggestedPrompts={prompts}
        />
      );

      expect(screen.getByText("Tell me about legal procedures")).toBeInTheDocument();
      expect(screen.getByText("Explain habeas corpus")).toBeInTheDocument();
    });

    it("calls onSendMessage when clicking a suggested prompt", async () => {
      const prompts = ["Tell me about contracts"];
      const user = userEvent.setup();

      render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          suggestedPrompts={prompts}
        />
      );

      await user.click(screen.getByText("Tell me about contracts"));

      expect(mockOnSendMessage).toHaveBeenCalledWith("Tell me about contracts");
    });
  });

  describe("message display", () => {
    it("displays user messages", () => {
      const messages: Message[] = [
        { role: "user", content: "Hello AI!" },
      ];

      render(<AIChatBox messages={messages} onSendMessage={mockOnSendMessage} />);

      expect(screen.getByText("Hello AI!")).toBeInTheDocument();
    });

    it("displays assistant messages", () => {
      const messages: Message[] = [
        { role: "assistant", content: "Hello! How can I help you?" },
      ];

      render(<AIChatBox messages={messages} onSendMessage={mockOnSendMessage} />);

      expect(screen.getByText("Hello! How can I help you?")).toBeInTheDocument();
    });

    it("filters out system messages", () => {
      const messages: Message[] = [
        { role: "system", content: "You are a helpful assistant" },
        { role: "user", content: "Hello!" },
      ];

      render(<AIChatBox messages={messages} onSendMessage={mockOnSendMessage} />);

      expect(screen.queryByText("You are a helpful assistant")).not.toBeInTheDocument();
      expect(screen.getByText("Hello!")).toBeInTheDocument();
    });

    it("displays multiple messages in conversation", () => {
      const messages: Message[] = [
        { role: "user", content: "What is a petition?" },
        { role: "assistant", content: "A petition is a formal written request." },
        { role: "user", content: "How do I write one?" },
      ];

      render(<AIChatBox messages={messages} onSendMessage={mockOnSendMessage} />);

      expect(screen.getByText("What is a petition?")).toBeInTheDocument();
      expect(screen.getByText("A petition is a formal written request.")).toBeInTheDocument();
      expect(screen.getByText("How do I write one?")).toBeInTheDocument();
    });
  });

  describe("input handling", () => {
    it("renders textarea with custom placeholder", () => {
      render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          placeholder="Digite sua pergunta..."
        />
      );

      expect(screen.getByPlaceholderText("Digite sua pergunta...")).toBeInTheDocument();
    });

    it("renders textarea with default placeholder", () => {
      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      expect(screen.getByPlaceholderText("Type your message...")).toBeInTheDocument();
    });

    it("updates input value on change", async () => {
      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "Test message");

      expect(textarea).toHaveValue("Test message");
    });

    it("clears input after sending message", async () => {
      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "Test message");

      const submitButton = screen.getByRole("button", { name: /enviar/i });
      await user.click(submitButton);

      expect(textarea).toHaveValue("");
    });
  });

  describe("form submission", () => {
    it("calls onSendMessage on form submit", async () => {
      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "Test message");

      const submitButton = screen.getByRole("button", { name: /enviar/i });
      await user.click(submitButton);

      expect(mockOnSendMessage).toHaveBeenCalledWith("Test message");
    });

    it("trims whitespace from input", async () => {
      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "  Test message  ");

      const submitButton = screen.getByRole("button", { name: /enviar/i });
      await user.click(submitButton);

      expect(mockOnSendMessage).toHaveBeenCalledWith("Test message");
    });

    it("does not submit empty input", async () => {
      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const submitButton = screen.getByRole("button", { name: /enviar/i });
      await user.click(submitButton);

      expect(mockOnSendMessage).not.toHaveBeenCalled();
    });

    it("does not submit whitespace-only input", async () => {
      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "   ");

      const submitButton = screen.getByRole("button", { name: /enviar/i });
      await user.click(submitButton);

      expect(mockOnSendMessage).not.toHaveBeenCalled();
    });

    it("submits on Enter key (without Shift)", async () => {
      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "Test message");
      await user.keyboard("{Enter}");

      expect(mockOnSendMessage).toHaveBeenCalledWith("Test message");
    });

    it("does not submit on Shift+Enter", async () => {
      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "Line 1");
      await user.keyboard("{Shift>}{Enter}{/Shift}");
      await user.type(textarea, "Line 2");

      expect(mockOnSendMessage).not.toHaveBeenCalled();
    });
  });

  describe("loading state", () => {
    it("shows loading indicator when isLoading is true", () => {
      const messages: Message[] = [
        { role: "user", content: "Hello" },
      ];

      render(
        <AIChatBox
          messages={messages}
          onSendMessage={mockOnSendMessage}
          isLoading={true}
        />
      );

      // There may be multiple loaders (one in messages, one in button)
      const loaders = screen.getAllByTestId("loader");
      expect(loaders.length).toBeGreaterThan(0);
    });

    it("disables submit button when loading", () => {
      render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          isLoading={true}
        />
      );

      const submitButton = screen.getByRole("button");
      expect(submitButton).toBeDisabled();
    });

    it("disables suggested prompts when loading", async () => {
      const prompts = ["Test prompt"];

      render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          suggestedPrompts={prompts}
          isLoading={true}
        />
      );

      const promptButton = screen.getByText("Test prompt");
      expect(promptButton).toBeDisabled();
    });

    it("prevents submission when loading", async () => {
      const user = userEvent.setup();

      render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          isLoading={true}
        />
      );

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "Test");

      // Button should be disabled
      const submitButton = screen.getByRole("button");
      expect(submitButton).toBeDisabled();
    });
  });

  describe("rate limiting", () => {
    it("shows rate limit error toast", async () => {
      mockAiChat.mockReturnValue({ allowed: false, retryAfterMs: 5000 });

      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "Test");

      const submitButton = screen.getByRole("button", { name: /enviar/i });
      await user.click(submitButton);

      expect(mockToastError).toHaveBeenCalledWith(
        "Muitas mensagens. Aguarde 5 segundos.",
        { id: "chat-rate-limit" }
      );
      expect(mockOnSendMessage).not.toHaveBeenCalled();
    });

    it("shows singular second for 1 second wait", async () => {
      mockAiChat.mockReturnValue({ allowed: false, retryAfterMs: 1000 });

      const user = userEvent.setup();

      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByPlaceholderText("Type your message...");
      await user.type(textarea, "Test");

      const submitButton = screen.getByRole("button", { name: /enviar/i });
      await user.click(submitButton);

      expect(mockToastError).toHaveBeenCalledWith(
        "Muitas mensagens. Aguarde 1 segundo.",
        { id: "chat-rate-limit" }
      );
    });
  });

  describe("accessibility", () => {
    it("has accessible form label", () => {
      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const form = screen.getByRole("form");
      expect(form).toHaveAttribute("aria-label", "Formulário de chat com IA");
    });

    it("has accessible textarea label", () => {
      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const textarea = screen.getByLabelText(/digite sua mensagem/i);
      expect(textarea).toBeInTheDocument();
    });

    it("has accessible submit button label", () => {
      render(<AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />);

      const button = screen.getByRole("button", { name: /enviar mensagem/i });
      expect(button).toBeInTheDocument();
    });

    it("shows loading state in button aria-label", () => {
      render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          isLoading={true}
        />
      );

      const button = screen.getByRole("button", { name: /enviando mensagem/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("applies custom className", () => {
      const { container } = render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("applies custom height", () => {
      const { container } = render(
        <AIChatBox
          messages={[]}
          onSendMessage={mockOnSendMessage}
          height="400px"
        />
      );

      expect(container.firstChild).toHaveStyle({ height: "400px" });
    });

    it("applies default height", () => {
      const { container } = render(
        <AIChatBox messages={[]} onSendMessage={mockOnSendMessage} />
      );

      expect(container.firstChild).toHaveStyle({ height: "600px" });
    });
  });
});
