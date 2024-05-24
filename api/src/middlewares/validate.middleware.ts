import { Response, Request, NextFunction, RequestHandler } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ServerError } from '@/errors/ServerError.ts';
import { BadRequestError } from '@/errors/BadRequestError.ts';

export const validate =
  (schema: AnyZodObject): RequestHandler =>
  async (
    req: Request<unknown, unknown, unknown, unknown>,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        next(new BadRequestError(error.errors[0].message));
      } else {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Ooops... An unexpected error has occured.';
        next(new ServerError(errorMessage));
      }
    }
  };
