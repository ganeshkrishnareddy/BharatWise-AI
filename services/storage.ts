// Storage service cleaned up as Tasks/Notes and Expenses have been removed.
// This file is kept for potential future persistent features (e.g. settings).

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
  // Placeholder for future storage methods
  async clearAllData(): Promise<void> {
    await delay(50);
    // localStorage.clear(); // Be careful with this in production
  }
};