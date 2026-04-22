import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    
    // Obtenemos la respuesta original de NestJS
    const exceptionResponse = exception.getResponse() as any;

    // Extraemos únicamente el mensaje (ya sea un string o un arreglo de class-validator)
    const errorMessage = typeof exceptionResponse === 'object' && exceptionResponse.message
      ? exceptionResponse.message
      : exceptionResponse;

    // Retornamos el JSON limpio, omitiendo el statusCode y el error
    response.status(status).json({
      message: errorMessage,
    });
  }
}
