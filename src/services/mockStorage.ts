// Mock storage service to replace spark.kv
class MockStorageService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error reading storage key "${key}":`, error)
      return null
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting storage key "${key}":`, error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error deleting storage key "${key}":`, error)
    }
  }

  async keys(): Promise<string[]> {
    try {
      return Object.keys(localStorage)
    } catch (error) {
      console.error('Error getting storage keys:', error)
      return []
    }
  }
}

export const mockStorage = new MockStorageService()
