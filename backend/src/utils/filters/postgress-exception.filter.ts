import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(QueryFailedError)
export class PostgresExceptionFilter extends BaseExceptionFilter {
  public catch(exception: TypeORMError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const message = exception.message || null;

    if (
      typeof message === 'string' &&
      message.includes('duplicate key value violates unique constraint')
    ) {
      return response.status(400).json({
        statusCode: 1001,
        path: request.url,
        errorMessage: 'User code already exists in the database',
      });
    }
  }
}
