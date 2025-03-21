/**
 * Framework-agnostic logger service
 * 
 * This is a simplified version that can be implemented with any logging library
 */

// Define the logger interface
export interface ILogger {
  trace(message: string, ...args: any[]): void
  debug(message: string, ...args: any[]): void
  info(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  error(message: string, ...args: any[]): void
  fatal(message: string, ...args: any[]): void
}

/**
 * Default console-based logger implementation
 * This can be replaced with any logging library in the new framework
 */
class ConsoleLogger implements ILogger {
  private readonly isProduction: boolean
  private readonly name: string

  constructor(name: string = 'xahod-hq') {
    this.name = name
    // Determine if we're in production mode
    this.isProduction = process.env.NODE_ENV === 'production'
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString()
    return `${timestamp} ${level.padEnd(5)} [${this.name}] ${message}`
  }

  trace(message: string, ...args: any[]): void {
    if (!this.isProduction) {
      console.trace(this.formatMessage('TRACE', message), ...args)
    }
  }

  debug(message: string, ...args: any[]): void {
    if (!this.isProduction) {
      console.debug(this.formatMessage('DEBUG', message), ...args)
    }
  }

  info(message: string, ...args: any[]): void {
    console.info(this.formatMessage('INFO', message), ...args)
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('WARN', message), ...args)
  }

  error(message: string, ...args: any[]): void {
    console.error(this.formatMessage('ERROR', message), ...args)
  }

  fatal(message: string, ...args: any[]): void {
    console.error(this.formatMessage('FATAL', message), ...args)
  }
}

// Export a singleton instance
export const logger: ILogger = new ConsoleLogger()

/**
 * Create a new logger with a specific name
 * @param name The name for the logger context
 * @returns A new logger instance
 */
export function createLogger(name: string): ILogger {
  return new ConsoleLogger(name)
}