import chalk from 'chalk';
import { ErrorRequestHandler, Response, Request, NextFunction } from 'express';
import { CustomErrorContent } from '@/types/error.type.ts';

export const errorHandler: ErrorRequestHandler = (
  error: CustomErrorContent,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(chalk.red(JSON.stringify(error, null, 2)));
  res.render('error', {
    title: `${error.code.toString()} ${error.message}`,
    error,
  });
};
