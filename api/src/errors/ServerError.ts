import { CustomError } from './CustomError.ts';

export class ServerError extends CustomError {
  readonly code: number = 500;
  constructor(message?: string, name?: string) {
    super(message ?? 'Ooops... An unexpected error has occured.', name);
  }
}
