import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { AxiosError } from "axios";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { loggers } from "./logger";
import { sdk } from "./sdk";

/**
 * Tipos de erros OAuth para melhor tratamento
 */
enum OAuthErrorType {
  VALIDATION = "validation_error",
  TOKEN_EXCHANGE = "token_exchange_error",
  USER_INFO = "user_info_error",
  DATABASE = "database_error",
  SESSION = "session_error",
  NETWORK = "network_error",
  UNKNOWN = "unknown_error",
}

interface OAuthErrorResponse {
  error: string;
  errorType: OAuthErrorType;
  message: string;
  retryable: boolean;
}

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

/**
 * Classifica o erro e retorna uma resposta apropriada
 */
function classifyError(error: unknown, stage: string): OAuthErrorResponse {
  // Erro de rede (Axios)
  if (error instanceof AxiosError) {
    if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND") {
      return {
        error: "OAuth server unavailable",
        errorType: OAuthErrorType.NETWORK,
        message: "Unable to reach authentication server. Please try again later.",
        retryable: true,
      };
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      return {
        error: "Authentication failed",
        errorType: OAuthErrorType.TOKEN_EXCHANGE,
        message: "Invalid or expired authorization code. Please try logging in again.",
        retryable: false,
      };
    }
    if (error.response?.status && error.response.status >= 500) {
      return {
        error: "OAuth server error",
        errorType: OAuthErrorType.NETWORK,
        message: "Authentication server encountered an error. Please try again later.",
        retryable: true,
      };
    }
  }

  // Erro de banco de dados
  if (stage === "database" || (error instanceof Error && error.message.includes("database"))) {
    return {
      error: "Database error",
      errorType: OAuthErrorType.DATABASE,
      message: "Unable to save user information. Please try again.",
      retryable: true,
    };
  }

  // Erro genérico
  return {
    error: "OAuth callback failed",
    errorType: OAuthErrorType.UNKNOWN,
    message: "An unexpected error occurred during authentication.",
    retryable: true,
  };
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    // Validação de parâmetros
    if (!code || !state) {
      loggers.oauth.warn("OAuth callback missing required parameters", {
        hasCode: Boolean(code),
        hasState: Boolean(state),
        ip: req.ip,
      });
      res.status(400).json({
        error: "Missing parameters",
        errorType: OAuthErrorType.VALIDATION,
        message: "Authorization code and state are required.",
        retryable: false,
      } satisfies OAuthErrorResponse);
      return;
    }

    let stage = "token_exchange";

    try {
      // Etapa 1: Trocar código por token
      loggers.oauth.debug("Exchanging code for token");
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);

      // Etapa 2: Obter informações do usuário
      stage = "user_info";
      loggers.oauth.debug("Fetching user info");
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        loggers.oauth.error("OAuth response missing openId", undefined, { userInfo });
        res.status(400).json({
          error: "Invalid user info",
          errorType: OAuthErrorType.USER_INFO,
          message: "User information is incomplete. Please try again.",
          retryable: true,
        } satisfies OAuthErrorResponse);
        return;
      }

      // Etapa 3: Salvar usuário no banco
      stage = "database";
      loggers.oauth.debug("Upserting user", { openId: userInfo.openId });
      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      // Etapa 4: Criar token de sessão
      stage = "session";
      loggers.oauth.debug("Creating session token");
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      // Etapa 5: Configurar cookie e redirecionar
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      loggers.oauth.info("OAuth login successful", {
        openId: userInfo.openId,
        loginMethod: userInfo.loginMethod,
      });

      res.redirect(302, "/");
    } catch (error) {
      const errorResponse = classifyError(error, stage);

      loggers.oauth.error("OAuth callback failed", error, {
        stage,
        errorType: errorResponse.errorType,
        ip: req.ip,
      });

      // Retorna status apropriado baseado no tipo de erro
      const statusCode = errorResponse.errorType === OAuthErrorType.VALIDATION ? 400
        : errorResponse.retryable ? 503 : 500;

      res.status(statusCode).json(errorResponse);
    }
  });
}
