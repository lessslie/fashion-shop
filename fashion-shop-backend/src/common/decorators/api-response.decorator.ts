import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

// Respuestas estándar reutilizables
export function ApiStandardResponses() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Datos inválidos',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email', 'password is too short'],
          error: 'Bad Request',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'No autenticado - Token inválido o expirado',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'No autorizado - No tienes permisos',
      schema: {
        example: {
          statusCode: 403,
          message: 'Forbidden resource',
          error: 'Forbidden',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Error interno del servidor',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
        },
      },
    }),
  );
}

// Respuesta 404 estándar
export function ApiNotFoundResponseCustom(resource: string) {
  return ApiNotFoundResponse({
    description: `${resource} no encontrado`,
    schema: {
      example: {
        statusCode: 404,
        message: `${resource} not found`,
        error: 'Not Found',
      },
    },
  });
}

// Respuesta exitosa con tipo genérico
export function ApiSuccessResponse<T>(
  status: number,
  description: string,
  type?: Type<T>,
) {
  return ApiResponse({
    status,
    description,
    type,
  });
}
