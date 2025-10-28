import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsBoolean,
  IsArray,
  IsUrl,
  ArrayMinSize,
  ValidateNested,
  IsDateString,
  ArrayMaxSize,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ProductCategory,
  ProductStatus,
  DiscountType,
} from '../entities/product.entity';
import { CreateProductVariantDto } from './create-product-variant.dto';

export class CreateProductDto {
  @ApiProperty({
    example: 'Saco Whole Oversize',
    description: 'Nombre del producto',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  name: string;

  @ApiProperty({
    example: 'Saco elegante de corte oversize con excelente caída...',
    description: 'Descripción del producto',
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  description: string;

  @ApiProperty({
    example: ProductCategory.ROPA,
    enum: ProductCategory,
    description: 'Categoría principal del producto',
  })
  @IsEnum(ProductCategory, { message: 'Categoría inválida' })
  category: ProductCategory;

  @ApiProperty({
    example: 'camperas',
    description: 'Subcategoría del producto (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiProperty({
    example: 'Urban Style',
    description: 'Marca del producto (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({
    example: 25000,
    description: 'Precio base del producto',
  })
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  basePrice: number;

  @ApiProperty({
    example: false,
    description: 'Si el producto tiene descuento activo',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  hasDiscount?: boolean;

  @ApiProperty({
    example: DiscountType.PERCENTAGE,
    enum: DiscountType,
    description: 'Tipo de descuento (porcentual o fijo)',
    required: false,
  })
  @IsOptional()
  @IsEnum(DiscountType, { message: 'Tipo de descuento inválido' })
  discountType?: DiscountType;

  @ApiProperty({
    example: 20,
    description: 'Valor del descuento (20 para 20% o 5000 para $5000)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'El descuento no puede ser negativo' })
  discountValue?: number;

  @ApiProperty({
    example: '2025-11-01T00:00:00Z',
    description: 'Fecha de inicio del descuento',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  discountStartDate?: string;

  @ApiProperty({
    example: '2025-11-30T23:59:59Z',
    description: 'Fecha de fin del descuento',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  discountEndDate?: string;

  @ApiProperty({
    example: [
      'https://res.cloudinary.com/.../img1.jpg',
      'https://res.cloudinary.com/.../img2.jpg',
    ],
    description: 'Array de URLs de imágenes del producto (mínimo 1, máximo 10)',
    isArray: true,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe haber al menos 1 imagen' })
  @ArrayMaxSize(10, { message: 'Máximo 10 imágenes por producto' })
  @IsUrl({}, { each: true, message: 'Todas las URLs deben ser válidas' })
  images: string[];

  @ApiProperty({
    example: ['urban', 'elegant'],
    description: 'Tags de estilo del producto',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  styleTags?: string[];

  @ApiProperty({
    example: ['camperas', 'remeras'],
    description: 'Tags de categoría del producto',
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryTags?: string[];

  @ApiProperty({
    example: ProductStatus.ACTIVE,
    enum: ProductStatus,
    description: 'Estado del producto',
    default: ProductStatus.DRAFT,
    required: false,
  })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Estado inválido' })
  status?: ProductStatus;

  @ApiProperty({
    example: false,
    description: 'Si el producto es destacado en home',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiProperty({
    example: true,
    description: 'Si el producto tiene badge "NEW"',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @ApiProperty({
    example: [
      {
        color: 'Beige',
        size: 'M',
        stock: 10,
        featuredImage: 'https://res.cloudinary.com/.../beige.jpg',
      },
      {
        color: 'Beige',
        size: 'L',
        stock: 5,
      },
    ],
    description: 'Array de variantes del producto (mínimo 1)',
    type: [CreateProductVariantDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe haber al menos 1 variante' })
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}