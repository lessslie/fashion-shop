// src/cloudinary/cloudinary.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') 
    private readonly cloudinaryInstance: typeof cloudinary
  ) {}

  async uploadFile(file: MulterFile): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        {
          folder: 'fashion-shop',
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) return reject(new Error(error.message || 'Error al subir archivo'));
          if (!result) {
            return reject(new Error('No se pudo cargar el archivo'));
          }
          resolve(result);
        },
      );

      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<{ result: string }> {
    const response = await this.cloudinaryInstance.uploader.destroy(publicId) as { result?: string };
    return { 
      result: response.result || 'ok'
    };
  }

  getOptimizedUrl(publicId: string, options: Record<string, string | number | boolean> = {}): string {
    const defaultOptions = {
      fetch_format: 'auto',
      quality: 'auto',
      width: 800,
      crop: 'limit',
    };
    
    return this.cloudinaryInstance.url(publicId, {
      ...defaultOptions,
      ...options,
    });
  }
}