export function actionSuccess<T>(data: T) {
  return { success: true as const, data };
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ThemeNotFoundError extends Error {
  constructor(message = 'Theme not found') {
    super(message);
    this.name = 'ThemeNotFoundError';
  }
}
