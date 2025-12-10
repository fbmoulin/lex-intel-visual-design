import { useRef, useState, useEffect, useCallback } from "react";

/** Constantes de layout do chat */
const CHAT_LAYOUT = {
  /** Padding vertical total (p-4 = 16px * 2) */
  PADDING_PX: 32,
  /** Altura reservada para mensagem do usuário (item: 40px + margin: 16px) */
  USER_MESSAGE_HEIGHT_PX: 56,
} as const;

export interface UseChatScrollOptions {
  /** Habilitar cálculo de min-height para última mensagem */
  enableMinHeight?: boolean;
}

export interface UseChatScrollReturn {
  /** Ref para o container principal */
  containerRef: React.RefObject<HTMLDivElement>;
  /** Ref para a área de scroll */
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  /** Ref para a área de input */
  inputAreaRef: React.RefObject<HTMLFormElement>;
  /** Min-height calculada para última mensagem */
  minHeightForLastMessage: number;
  /** Função para scroll suave até o final */
  scrollToBottom: () => void;
}

/**
 * Hook para gerenciar scroll e layout de chat
 *
 * @example
 * ```tsx
 * const {
 *   containerRef,
 *   scrollAreaRef,
 *   inputAreaRef,
 *   minHeightForLastMessage,
 *   scrollToBottom,
 * } = useChatScroll();
 * ```
 */
export function useChatScroll(
  options: UseChatScrollOptions = {}
): UseChatScrollReturn {
  const { enableMinHeight = true } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputAreaRef = useRef<HTMLFormElement>(null);

  const [minHeightForLastMessage, setMinHeightForLastMessage] = useState(0);

  // Calcular min-height para última mensagem (push user message to top)
  useEffect(() => {
    if (!enableMinHeight) return;

    const container = containerRef.current;
    const inputArea = inputAreaRef.current;

    if (container && inputArea) {
      const containerHeight = container.offsetHeight;
      const inputHeight = inputArea.offsetHeight;
      const scrollAreaHeight = containerHeight - inputHeight;

      const calculatedHeight =
        scrollAreaHeight - CHAT_LAYOUT.PADDING_PX - CHAT_LAYOUT.USER_MESSAGE_HEIGHT_PX;

      setMinHeightForLastMessage(Math.max(0, calculatedHeight));
    }
  }, [enableMinHeight]);

  // Scroll suave até o final
  const scrollToBottom = useCallback(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const viewport = scrollArea.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLDivElement | null;

    if (viewport) {
      requestAnimationFrame(() => {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, []);

  return {
    containerRef,
    scrollAreaRef,
    inputAreaRef,
    minHeightForLastMessage,
    scrollToBottom,
  };
}
