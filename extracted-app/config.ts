/**
 * Application configuration
 * Framework-agnostic configuration values
 */

/**
 * Application configuration interface
 * All configuration values should be documented here
 */
export interface AppConfig {
  /** Current environment (development, production, etc.) */
  ENVIRONMENT: string
  /** Application name used in titles and metadata */
  APP_NAME: string
  /** Base URL for API requests */
  API_URL: string
  /** Base URL for the application */
  BASE_URL: string
  /** Logging level for the application */
  LOG_LEVEL: string
  /** Current build version */
  BUILD_VERSION: string
}

/**
 * Default configuration values
 * These should be overridden by environment-specific values in the actual implementation
 */
export const defaultConfig: AppConfig = {
  ENVIRONMENT: 'development',
  API_URL: '/api',
  APP_NAME: 'Xahod HQ',
  BASE_URL: '',
  LOG_LEVEL: 'info',
  BUILD_VERSION: '0.0.0',
}

/**
 * Load configuration from environment variables
 * This is a placeholder that should be implemented based on the framework's approach
 * to environment variables
 * 
 * @param env Environment variables object
 * @returns Configuration object with values from environment variables
 */
export function loadConfigFromEnv(env: Record<string, string | undefined>): Partial<AppConfig> {
  const config: Partial<AppConfig> = {}
  
  // Map environment variables to config properties
  // This is just an example - implementation will depend on the framework
  if (env.ENVIRONMENT) config.ENVIRONMENT = env.ENVIRONMENT
  if (env.API_URL) config.API_URL = env.API_URL
  if (env.APP_NAME) config.APP_NAME = env.APP_NAME
  if (env.BASE_URL) config.BASE_URL = env.BASE_URL
  if (env.LOG_LEVEL) config.LOG_LEVEL = env.LOG_LEVEL
  if (env.BUILD_VERSION) config.BUILD_VERSION = env.BUILD_VERSION
  
  return config
}

/**
 * Create a configuration object by merging default config with environment-specific values
 * 
 * @param envConfig Environment-specific configuration values
 * @returns Complete configuration object
 */
export function createConfig(envConfig: Partial<AppConfig> = {}): AppConfig {
  return {
    ...defaultConfig,
    ...envConfig,
  }
}