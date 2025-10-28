import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    example: 'Beige',
    description: 'Color de la variante (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({
    example: 'M',
    description: 'Talle de la variante (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({
    example: 10,
    description: 'Stock disponible de esta variante',
    default: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @ApiProperty({
    example: 5,
    description: 'Umbral de stock bajo para alertas',
    default: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  lowStockThreshold?: number;

  @ApiProperty({
    example: 'https://res.cloudinary.com/.../beige_frente.jpg',
    description: 'Imagen destacada de la variante (opcional)',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'La URL de la imagen debe ser válida' })
  featuredImage?: string;

  @ApiProperty({
    example: true,
    description: 'Si la variante está activa',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}