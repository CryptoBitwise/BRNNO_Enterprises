// PWA Service for handling online/offline functionality
class PWAService {
  private isOnlineStatus: boolean = navigator.onLine;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnlineStatus = true;
      this.notifyOnlineStatusChange(true);
    });

    window.addEventListener('offline', () => {
      this.isOnlineStatus = false;
      this.notifyOnlineStatusChange(false);
    });
  }

  private notifyOnlineStatusChange(isOnline: boolean) {
    // Dispatch custom event for components to listen to
    window.dispatchEvent(
      new CustomEvent('pwa-online-status-change', { detail: { isOnline } })
    );
  }

  // Check if the device is currently online
  isOnline(): boolean {
    return this.isOnlineStatus;
  }

  // Get the current online status
  getOnlineStatus(): boolean {
    return this.isOnlineStatus;
  }

  // Subscribe to online status changes
  onOnlineStatusChange(callback: (isOnline: boolean) => void): () => void {
    const handler = (event: CustomEvent) => callback(event.detail.isOnline);
    window.addEventListener('pwa-online-status-change', handler as EventListener);
    
    // Return unsubscribe function
    return () => {
      window.removeEventListener('pwa-online-status-change', handler as EventListener);
    };
  }

  // Check if the app is running as a PWA
  isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  // Get PWA installation status
  getInstallationStatus(): 'installed' | 'not-installed' | 'unknown' {
    if (this.isPWA()) {
      return 'installed';
    }
    
    // Check if beforeinstallprompt event has been fired
    if ('serviceWorker' in navigator) {
      return 'not-installed';
    }
    
    return 'unknown';
  }

  // Request PWA installation
  async requestInstallation(): Promise<boolean> {
    // This would typically be implemented with the beforeinstallprompt event
    // For now, we'll return false as a placeholder
    return false;
  }
}

// Create and export a singleton instance
const pwaService = new PWAService();
export default pwaService;
