export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { message: string } };

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { success: true, data };
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
