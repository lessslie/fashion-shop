// src/cloudinary/cloudinary.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles, UserRole } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

// Interfaz para el tipo de archivo de Multer
interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@ApiTags('Cloudinary')
@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)  // Solo administradores
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir un archivo a Cloudinary' })
  @ApiResponse({ status: 201, description: 'Archivo subido exitosamente' })
  @ApiResponse({ status: 400, description: 'Error al subir el archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: MulterFile) {
    try {
      const result = await this.cloudinaryService.uploadFile(file);
      return {
        success: true,
        message: 'Archivo subido exitosamente',
        data: {
          url: this.cloudinaryService.getOptimizedUrl(result.public_id),
          publicId: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
        },
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        success: false,
        message: 'Error al subir el archivo',
        error: errorMessage,
      };
    
    }
  }
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)  // Solo administradores
@Delete()
@ApiOperation({ summary: 'Eliminar un archivo de Cloudinary' })
@ApiResponse({ status: 200, description: 'Archivo eliminado exitosamente' })
@ApiResponse({ status: 404, description: 'Archivo no encontrado' })
async deleteFile(@Query('publicId') publicId: string) {
  try {
    const result = await this.cloudinaryService.deleteFile(publicId);
    if (result.result === 'ok') {
      return {
        success: true,
        message: 'Archivo eliminado exitosamente',
        publicId,
      };
    }
    throw new Error('No se pudo eliminar el archivo');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  return {
    success: false,
    message: 'Error al eliminar el archivo',
    error: errorMessage,
  };
  
  }
}

  @Get('url')
  @ApiOperation({ 
    summary: 'Obtener URL optimizada', 
    description: 'Genera una URL optimizada para una imagen existente' 
  })
  @ApiResponse({ status: 200, description: 'URL generada exitosamente' })
  getOptimizedUrl(
    @Query('publicId') publicId: string,
    @Query('width') width?: number,
    @Query('height') height?: number,
    @Query('crop') crop: string = 'limit',
  ) {
    try {
      const options = {
        width: width ? parseInt(width.toString()) : undefined,
        height: height ? parseInt(height.toString()) : undefined,
        crop,
      };
      
      const url = this.cloudinaryService.getOptimizedUrl(publicId);
      return {
        success: true,
        url,
        options,
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      return {
        success: false,
        message: 'Error al generar la URL',
        error: errorMessage,
      };
    
    }
  }
}