/**
 * Validation utilities
 */

/**
 * Form validation rules used throughout the application
 */
export const validators = {
  /** Validates email format */
  email: (v: string): boolean | string => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(v) || 'Please enter a valid email address'
  },
  /** Ensures a value is present */
  required: (v: any): boolean | string => !!v || 'This field is required',
  /** Ensures a number is greater than zero */
  positiveNumber: (v: number): boolean | string => Number(v) > 0 || 'Please enter a positive number',
  /** Validates XRP withdrawal amount against minimum requirement */
  xrpMinimumExchangeWithdrawal: (v: number): boolean | string => 
    Number(v) >= 0.4 || 'Minimum withdrawal amount is 0.4 XRP',
  /** Validates XAH withdrawal amount against minimum requirement */
  xahMinimumExchangeWithdrawal: (v: number): boolean | string => 
    Number(v) >= 2 || 'Minimum withdrawal amount is 2 XAH',
}