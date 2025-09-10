import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  TiendaNubeConfig,
  ApiResponse,
  PaginatedResponse,
} from "../types/api.js";

export class TiendaNubeClient {
  private client: AxiosInstance;
  private config: TiendaNubeConfig;

  constructor(config: TiendaNubeConfig) {
    this.config = {
      baseUrl: "https://api.tiendanube.com/v1",
      ...config,
    };

    const userAgent =
      process.env["TIENDANUBE_USER_AGENT"] || "TiendaNube-MCP-Server/1.5.0";

    this.client = axios.create({
      baseURL: `${this.config.baseUrl}/${this.config.storeId}`,
      timeout: 30000,
      headers: {
        // Primary header required by Tienda Nube
        Authentication: `bearer ${this.config.accessToken}`,
        // Fallback for environments expecting Authorization
        Authorization: `bearer ${this.config.accessToken}`,
        "Content-Type": "application/json",
        "User-Agent": userAgent,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for logging
    this.client.interceptors.request.use(
      (config: any) => {
        console.log(
          `[API Request] ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error: any) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and retry logic
    this.client.interceptors.response.use(
      (response: any) => {
        console.log(`[API Response] ${response.status} ${response.config.url}`);
        return response;
      },
      async (error: any) => {
        const { config, response } = error;

        console.error(`[API Error] ${response?.status} ${config?.url}`, {
          status: response?.status,
          data: response?.data,
          headers: response?.headers,
        });

        // Handle rate limiting with retry
        if (response?.status === 429) {
          const retryAfter = response.headers["retry-after"]
            ? parseInt(response.headers["retry-after"]) * 1000
            : 5000;

          console.log(`[Rate Limited] Retrying after ${retryAfter}ms`);
          await this.delay(retryAfter);
          return this.client.request(config);
        }

        // Handle server errors with exponential backoff
        if (response?.status >= 500 && config.retryCount < 3) {
          config.retryCount = (config.retryCount || 0) + 1;
          const delay = Math.pow(2, config.retryCount) * 1000;

          console.log(
            `[Server Error] Retry ${config.retryCount}/3 after ${delay}ms`
          );
          await this.delay(delay);
          return this.client.request(config);
        }

        return Promise.reject(this.formatError(error));
      }
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private formatError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || data?.error || `HTTP ${status} Error`;
      const formattedError = new Error(
        `TiendaNube API Error (${status}): ${message}`
      );
      (formattedError as any).status = status;
      (formattedError as any).data = data;
      return formattedError;
    }

    if (error.request) {
      return new Error("TiendaNube API: No response received from server");
    }

    return new Error(`TiendaNube API: ${error.message}`);
  }

  private checkAuthentication(): void {
    if (!this.config.accessToken || !this.config.storeId) {
      throw new Error(
        "Authentication required. Please set TIENDANUBE_ACCESS_TOKEN and TIENDANUBE_STORE_ID environment variables."
      );
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    // Skip auth check for the store endpoint when authenticating
    if (endpoint !== "/store") {
      this.checkAuthentication();
    }

    // Special-case for store info endpoint: it's not under /{store_id}
    if (endpoint === "/store") {
      const response: AxiosResponse<T> = await this.client.get(
        `${this.config.baseUrl}${endpoint}`,
        {
          params,
          ...config,
        }
      );

      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    }

    const response: AxiosResponse<T> = await this.client.get(endpoint, {
      params,
      ...config,
    });

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    this.checkAuthentication();

    const response: AxiosResponse<T> = await this.client.post(
      endpoint,
      data,
      config
    );

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    this.checkAuthentication();

    const response: AxiosResponse<T> = await this.client.put(
      endpoint,
      data,
      config
    );

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.client.patch(
      endpoint,
      data,
      config
    );

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    this.checkAuthentication();

    const response: AxiosResponse<T> = await this.client.delete(
      endpoint,
      config
    );

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  // Helper method for paginated endpoints
  async getPaginated<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<T[]>(endpoint, params, config);

    // Extract pagination info from headers if available
    const headers = (response as any).headers || {};

    return {
      data: response.data,
      total: headers["x-total-count"]
        ? parseInt(headers["x-total-count"])
        : undefined,
      page: params?.["page"],
      per_page: params?.["per_page"],
      has_next: headers["x-has-next"] === "true",
      has_prev: headers["x-has-prev"] === "true",
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<TiendaNubeConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.accessToken) {
      this.client.defaults.headers["Authentication"] =
        `bearer ${newConfig.accessToken}`;
      this.client.defaults.headers["Authorization"] =
        `bearer ${newConfig.accessToken}`;
    }

    if (newConfig.storeId || newConfig.baseUrl) {
      this.client.defaults.baseURL = `${this.config.baseUrl}/${this.config.storeId}`;
    }
  }

  // Get current configuration (without sensitive data)
  getConfig(): Omit<TiendaNubeConfig, "clientSecret" | "accessToken"> {
    const { clientSecret, accessToken, ...safeConfig } = this.config;
    return safeConfig;
  }
}
