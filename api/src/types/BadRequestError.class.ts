import { CustomError } from './CustomError.class.ts';

export class BadRequestError extends CustomError {
  readonly code: number = 400;
  constructor(message?: string, name?: string) {
    super(message ?? 'Bad request.', name);
  }
}
