import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, IsInt } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    example: 3,
    description: 'Nueva cantidad de unidades',
  })
  @IsNumber()
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima es 1' })
  quantity: number;
}