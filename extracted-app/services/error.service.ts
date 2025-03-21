/**
 * Error handling service
 */

export interface IErrorHandler {
  /**
   * Handle errors related to transfers
   * @param error The error to handle
   */
  handleTransferError(error: any): void

  /**
   * Handle network-related errors
   * @param error The error to handle
   */
  handleNetworkError(error: any): void
}

/**
 * Default implementation of the error handler
 * This can be extended or replaced in the new framework
 */
export class ErrorHandler implements IErrorHandler {
  handleTransferError(error: any) {
    console.error('Transfer error:', error)
    // This would be implemented based on the new framework's error handling approach
  }

  handleNetworkError(error: any) {
    console.error('Network error:', error)
    // This would be implemented based on the new framework's error handling approach
  }
}

// Export a singleton instance
export const errorHandler: IErrorHandler = new ErrorHandler()