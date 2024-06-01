import { CustomError } from './CustomError.class.ts';

export class NotFoundError extends CustomError {
  readonly code: number = 404;
  constructor(message?: string, name?: string) {
    super(message ?? 'Not found.', name);
  }
}
