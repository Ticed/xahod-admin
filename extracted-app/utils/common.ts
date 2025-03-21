/**
 * Common utility functions
 */

/**
 * Creates a promise that resolves after the specified time
 * @param ms Time to sleep in milliseconds
 * @returns Promise that resolves after the specified time
 */
export const sleep = (ms = 0): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Shortens a string by keeping a specified number of characters at the start and end
 * Useful for displaying long identifiers like addresses or transaction hashes
 * @param value The string to crop
 * @param cutoffStart Number of characters to keep at the start
 * @param cutoffEnd Number of characters to keep at the end
 * @returns The cropped string with '...' in the middle
 */
export function cropString(value: string, cutoffStart = 4, cutoffEnd = 4): string {
  if (value && value.length > 8) {
    return `${value.substring(0, cutoffStart)}...${value.substring(value.length - cutoffEnd)}`
  }
  return value
}

/**
 * Copies text to the clipboard using a temporary textarea element
 * @param str The string to copy
 * @throws Error if copying fails
 */
export function copyToClipboard(str: string): void {
  const textarea = document.createElement('textarea')
  textarea.value = str
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  try {
    document.execCommand('copy')
  } catch (err) {
    console.error('Unable to copy', err)
    throw new Error('Unable to copy')
  }
  document.body.removeChild(textarea)
}

/**
 * Formats a number with specified decimal places and thousands separator
 * @param value The number to format
 * @param decimals Number of decimal places
 * @param thousandsSeparator Character to use as thousands separator
 * @returns Formatted number string
 */
export function formatNumberNicely(
  value: number | string, 
  decimals = 2, 
  thousandsSeparator = ','
): string {
  let result = parseFloat(value.toString()).toFixed(decimals)
  if (thousandsSeparator) {
    result = result.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)
  }
  return result
}

/**
 * Formats a date according to a specified format string
 * Supports: YYYY (year), MM (month), DD (day), HH (hour), mm (minute), ss (second)
 * @param date The date to format
 * @param format Format string using supported tokens
 * @returns Formatted date string
 * @example
 * formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') // "2024-01-22 15:30:45"
 */
export const formatDate = (date: Date, format: string): string => {
  const map: { [key: string]: string } = {
    YYYY: date.getFullYear().toString(),
    MM: (date.getMonth() + 1).toString().padStart(2, '0'),
    DD: date.getDate().toString().padStart(2, '0'),
    HH: date.getHours().toString().padStart(2, '0'),
    mm: date.getMinutes().toString().padStart(2, '0'),
    ss: date.getSeconds().toString().padStart(2, '0'),
  }

  return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (matched) => map[matched])
}