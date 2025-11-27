/**
 * Environment Variables Configuration
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Valida e exporta variáveis de ambiente com tipagem segura.
 * Falha fast no boot se variáveis obrigatórias não estiverem definidas.
 */

/**
 * Variáveis de ambiente obrigatórias
 * O servidor não inicia se alguma delas estiver faltando
 */
const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  "DATABASE_URL",
  "OAUTH_SERVER_URL",
] as const;

/**
 * Variáveis opcionais que têm valores default
 */
const OPTIONAL_ENV_VARS = {
  VITE_APP_ID: "",
  OWNER_OPEN_ID: "",
  BUILT_IN_FORGE_API_URL: "",
  BUILT_IN_FORGE_API_KEY: "",
} as const;

/**
 * Valida que todas as variáveis obrigatórias estão definidas
 * Lança erro no boot se alguma estiver faltando
 */
function validateRequiredEnvVars(): void {
  const missingVars: string[] = [];

  for (const varName of REQUIRED_ENV_VARS) {
    const value = process.env[varName];
    if (!value || value.trim() === "") {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = [
      "",
      "═══════════════════════════════════════════════════════════════",
      "  ERRO: Variáveis de ambiente obrigatórias não definidas",
      "═══════════════════════════════════════════════════════════════",
      "",
      "  As seguintes variáveis são obrigatórias mas não foram encontradas:",
      "",
      ...missingVars.map((v) => `    - ${v}`),
      "",
      "  Por favor, defina-as no arquivo .env ou como variáveis de ambiente.",
      "",
      "  Exemplo de .env:",
      "    JWT_SECRET=sua-chave-secreta-aqui",
      "    DATABASE_URL=mysql://user:pass@host:3306/db",
      "    OAUTH_SERVER_URL=https://oauth.example.com",
      "",
      "═══════════════════════════════════════════════════════════════",
      "",
    ].join("\n");

    console.error(errorMessage);

    // Em produção, falha imediatamente
    // Em desenvolvimento, apenas avisa (permite rodar sem DB para dev local)
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
    } else {
      console.warn("[ENV] ⚠️  Continuando em modo desenvolvimento com variáveis faltando...\n");
    }
  }
}

/**
 * Valida requisitos mínimos de segurança para variáveis sensíveis
 */
function validateSecurityRequirements(): void {
  const jwtSecret = process.env.JWT_SECRET;

  // Em produção, JWT_SECRET deve ter no mínimo 32 caracteres
  if (process.env.NODE_ENV === "production" && jwtSecret && jwtSecret.length < 32) {
    console.warn(
      "[ENV] ⚠️  JWT_SECRET deve ter no mínimo 32 caracteres para segurança adequada"
    );
  }

  // Avisa se DATABASE_URL contém credenciais em texto claro (para awareness)
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && dbUrl.includes("@") && !dbUrl.includes("ssl=true")) {
    console.warn(
      "[ENV] ⚠️  DATABASE_URL não parece ter SSL habilitado. Considere usar ssl=true em produção."
    );
  }
}

// Executa validações no import do módulo (fail-fast)
validateRequiredEnvVars();
validateSecurityRequirements();

/**
 * Objeto ENV tipado e validado
 * Use este objeto em vez de acessar process.env diretamente
 */
export const ENV = {
  // Identificação da aplicação
  appId: process.env.VITE_APP_ID ?? OPTIONAL_ENV_VARS.VITE_APP_ID,

  // Autenticação e Segurança
  cookieSecret: process.env.JWT_SECRET ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? OPTIONAL_ENV_VARS.OWNER_OPEN_ID,

  // Banco de Dados
  databaseUrl: process.env.DATABASE_URL ?? "",

  // APIs Externas
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? OPTIONAL_ENV_VARS.BUILT_IN_FORGE_API_URL,
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? OPTIONAL_ENV_VARS.BUILT_IN_FORGE_API_KEY,

  // Flags de Ambiente
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
  isTest: process.env.NODE_ENV === "test",
} as const;

/**
 * Helper para verificar se uma feature está disponível
 */
export function hasFeature(feature: "database" | "forge" | "oauth"): boolean {
  switch (feature) {
    case "database":
      return Boolean(ENV.databaseUrl);
    case "forge":
      return Boolean(ENV.forgeApiUrl && ENV.forgeApiKey);
    case "oauth":
      return Boolean(ENV.oAuthServerUrl);
    default:
      return false;
  }
}
