import { AxiosError } from 'axios';

export class ErrorHandler {
  static handleApiError(error: any): void {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      switch (status) {
        case 400:
          console.error('Bad Request:', message);
          // Show user-friendly message for invalid input
          break;
        case 401:
          console.error('Unauthorized:', message);
          // Handle authentication error
          break;
        case 403:
          console.error('Forbidden:', message);
          // Handle permission error
          break;
        case 404:
          console.error('Not Found:', message);
          // Handle resource not found
          break;
        case 500:
          console.error('Server Error:', message);
          // Handle server error
          break;
        default:
          console.error('Unknown Error:', message);
          // Handle unknown error
      }
    } else {
      console.error('Non-API Error:', error);
      // Handle non-API errors
    }
  }

  static getErrorMessage(error: any): string {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      switch (status) {
        case 400:
          return 'Please check your input and try again.';
        case 401:
          return 'Please log in to continue.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 500:
          return 'Something went wrong. Please try again later.';
        default:
          return 'An unexpected error occurred.';
      }
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }

  static handleNetworkError(error: any): void {
    if (error instanceof AxiosError && !error.response) {
      console.error('Network Error:', error.message);
      // Handle network connectivity issues
    }
  }

  static handleValidationError(errors: Record<string, string[]>): void {
    console.error('Validation Errors:', errors);
    // Handle form validation errors
  }

  static handleTimeoutError(): void {
    console.error('Request timed out');
    // Handle request timeout
  }

  static handleRateLimitError(): void {
    console.error('Rate limit exceeded');
    // Handle rate limiting
  }

  static handleSessionExpired(): void {
    console.error('Session expired');
    // Handle session expiration
  }

  static handleResourceNotFound(resource: string): void {
    console.error(`${resource} not found`);
    // Handle resource not found
  }

  static handleInsufficientPermissions(): void {
    console.error('Insufficient permissions');
    // Handle permission issues
  }

  static handleServerMaintenance(): void {
    console.error('Server under maintenance');
    // Handle server maintenance
  }

  static handlePaymentError(error: any): void {
    console.error('Payment Error:', error);
    // Handle payment-related errors
  }

  static handleCartError(error: any): void {
    console.error('Cart Error:', error);
    // Handle cart-related errors
  }

  static handleProductError(error: any): void {
    console.error('Product Error:', error);
    // Handle product-related errors
  }

  static handleRecommendationError(error: any): void {
    console.error('Recommendation Error:', error);
    // Handle recommendation-related errors
  }

  static handleVoiceError(error: any): void {
    console.error('Voice Error:', error);
    // Handle voice-related errors
  }

  static handleChatError(error: any): void {
    console.error('Chat Error:', error);
    // Handle chat-related errors
  }

  static handleMoodError(error: any): void {
    console.error('Mood Error:', error);
    // Handle mood-related errors
  }

  static handleBehaviorError(error: any): void {
    console.error('Behavior Error:', error);
    // Handle behavior-related errors
  }

  static handlePersonaError(error: any): void {
    console.error('Persona Error:', error);
    // Handle persona-related errors
  }
} 