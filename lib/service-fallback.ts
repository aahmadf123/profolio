/**
 * Utility to attempt an operation with fallback options
 * @param primaryFn The primary function to attempt
 * @param fallbackFn The fallback function to use if primary fails
 * @param errorHandler Optional handler for errors
 */
export async function withFallback<T>(
  primaryFn: () => Promise<T>,
  fallbackFn: () => Promise<T>,
  errorHandler?: (error: unknown) => void,
): Promise<T> {
  try {
    return await primaryFn()
  } catch (error) {
    if (errorHandler) {
      errorHandler(error)
    } else {
      console.error("Primary function failed, using fallback:", error)
    }

    try {
      return await fallbackFn()
    } catch (fallbackError) {
      console.error("Fallback function also failed:", fallbackError)
      throw fallbackError
    }
  }
}

/**
 * Creates a mock object that returns empty/default values
 * @param serviceName Name of the service for logging
 */
export function createMockService<T>(serviceName: string): T {
  return new Proxy({} as T, {
    get: (target, prop) => {
      if (typeof prop === "string") {
        // Return a function that logs and returns a default value
        return (...args: any[]) => {
          console.warn(`${serviceName} not available: ${prop} called with`, args)
          return null
        }
      }
      return undefined
    },
  })
}

