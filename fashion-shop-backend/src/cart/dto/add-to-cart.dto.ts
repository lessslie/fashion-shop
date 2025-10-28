import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, IsInt } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID de la variante del producto',
  })
  @IsUUID('4', { message: 'El ID de la variante debe ser un UUID válido' })
  variantId: string;

  @ApiProperty({
    example: 2,
    description: 'Cantidad de unidades',
    default: 1,
  })
  @IsNumber()
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  quantity: number;
}