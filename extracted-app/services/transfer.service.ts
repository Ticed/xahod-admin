/**
 * Service for handling transfers
 */

/**
 * Interface for transfer service
 */
export interface ITransferService {
  /**
   * Process a transaction
   * @param tx The transaction to process
   * @returns Promise resolving when the transaction is processed
   */
  processTransaction(tx: any): Promise<any>

  /**
   * Retry a function with exponential backoff
   * @param fn The function to retry
   * @returns Promise resolving with the function result
   */
  retry<T>(fn: () => Promise<T>): Promise<T>
}

/**
 * Default implementation of the transfer service
 */
export class TransferService implements ITransferService {
  /**
   * Process a transaction
   * @param tx The transaction to process
   * @returns Promise resolving when the transaction is processed
   */
  async processTransaction(tx: any): Promise<any> {
    // This would be implemented based on the specific requirements
    console.log('Processing transaction:', tx)
    return tx
  }

  /**
   * Retry a function with exponential backoff
   * @param fn The function to retry
   * @param maxRetries Maximum number of retries
   * @param baseDelay Base delay in milliseconds
   * @returns Promise resolving with the function result
   */
  async retry<T>(
    fn: () => Promise<T>, 
    maxRetries: number = 3, 
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | null = null
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        if (attempt < maxRetries) {
          // Exponential backoff with jitter
          const delay = baseDelay * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError || new Error('Retry failed')
  }
}

// Export a singleton instance
export const transferService: ITransferService = new TransferService()