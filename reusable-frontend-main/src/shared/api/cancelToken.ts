import axios, {
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";

/**
 * ============================
 * Request Cancellation Manager
 * ============================
 */

class CancelRequestManager {
  private requests = new Map<string, CancelTokenSource>();

  /**
   * Create a new cancel token
   */
  create(key: string): AxiosRequestConfig {
    this.cancel(key);

    const source = axios.CancelToken.source();

    this.requests.set(key, source);

    return {
      cancelToken: source.token,
    };
  }

  /**
   * Cancel a single request
   */
  cancel(key: string): void {
    const source = this.requests.get(key);

    if (source) {
      source.cancel(`Request cancelled: ${key}`);

      this.requests.delete(key);
    }
  }

  /**
   * Cancel all pending requests
   */
  cancelAll(): void {
    this.requests.forEach((source, key) => {
      source.cancel(`Request cancelled: ${key}`);
    });

    this.requests.clear();
  }

  /**
   * Remove completed request
   */
  remove(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Check if request exists
   */
  has(key: string): boolean {
    return this.requests.has(key);
  }

  /**
   * Get total pending requests
   */
  count(): number {
    return this.requests.size;
  }
}

const cancelRequestManager = new CancelRequestManager();

export default cancelRequestManager;