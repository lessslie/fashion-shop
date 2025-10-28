import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { PaymentMethod } from '../entities/order.entity';

export class CreateOrderDto {
  // ==================== INFORMACIÓN DE FACTURACIÓN/ENVÍO ====================
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  billingFirstName: string;

  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido',
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  billingLastName: string;

  @ApiProperty({
    example: 'Mi Empresa S.A.',
    description: 'Nombre de la empresa (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  billingCompany?: string;

  @ApiProperty({
    example: 'Argentina',
    description: 'País',
  })
  @IsString()
  @IsNotEmpty({ message: 'El país es obligatorio' })
  billingCountry: string;

  @ApiProperty({
    example: 'Av. Corrientes 1234',
    description: 'Dirección completa',
  })
  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  billingAddress: string;

  @ApiProperty({
    example: 'Buenos Aires',
    description: 'Ciudad',
  })
  @IsString()
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  billingCity: string;

  @ApiProperty({
    example: 'Buenos Aires',
    description: 'Provincia/Estado',
  })
  @IsString()
  @IsNotEmpty({ message: 'La provincia es obligatoria' })
  billingProvince: string;

  @ApiProperty({
    example: '1414',
    description: 'Código postal',
  })
  @IsString()
  @IsNotEmpty({ message: 'El código postal es obligatorio' })
  billingZipCode: string;

  @ApiProperty({
    example: '+5491123456789',
    description: 'Teléfono de contacto',
  })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  billingPhone: string;

  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Email de contacto',
  })
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  billingEmail: string;

  // ==================== MÉTODO DE PAGO ====================
  @ApiProperty({
    example: PaymentMethod.BANK_TRANSFER,
    enum: PaymentMethod,
    description: 'Método de pago elegido',
  })
  @IsEnum(PaymentMethod, { message: 'Método de pago inválido' })
  paymentMethod: PaymentMethod;

  // ==================== NOTAS ====================
  @ApiProperty({
    example: 'Por favor dejar en portería',
    description: 'Notas adicionales del cliente (opcional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  orderNotes?: string;
}