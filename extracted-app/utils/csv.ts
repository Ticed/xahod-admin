/**
 * CSV utilities for data export
 */

/**
 * Converts an array of objects into a CSV string
 * Handles proper escaping of values and adds headers based on object keys
 * 
 * @param data Array of objects to convert
 * @returns CSV formatted string with headers
 * @throws Error if data array is empty
 */
export const toCSV = (data: Record<string, any>[]): string => {
  if (!data.length) {
    throw new Error('Cannot create CSV from empty data')
  }

  const headers = Object.keys(data[0])
  
  // Properly escape and format cell values
  const formatCell = (value: any): string => {
    if (value === null || value === undefined) return ''
    const str = typeof value === 'object' ? JSON.stringify(value) : String(value)
    // Escape quotes and wrap in quotes if contains special characters
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csv = [
    headers.join(','),
    ...data.map((row) => headers.map((fieldName) => formatCell(row[fieldName])).join(',')),
  ].join('\r\n')

  return csv
}

/**
 * Downloads data as a CSV file in the browser
 * 
 * @param data Array of objects to convert to CSV
 * @param filename Name of the file to download (should end in .csv)
 * @throws Error if data array is empty
 * @example
 * downloadAsCSV([{ id: 1, name: 'Test' }], 'export.csv')
 */
export const downloadAsCSV = (data: Record<string, any>[], filename: string): void => {
  if (!filename.toLowerCase().endsWith('.csv')) {
    filename += '.csv'
  }

  const csv = toCSV(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  
  // Handle browser differences
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename)
    return
  }

  const link = document.createElement('a')
  if (link.download !== undefined) { // Feature detection
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Clean up
  }
}