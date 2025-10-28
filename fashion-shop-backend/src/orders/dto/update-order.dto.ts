import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentStatus } from '../entities/order.entity';

export class UpdateOrderDto {
  @ApiProperty({
    example: OrderStatus.SHIPPED,
    enum: OrderStatus,
    description: 'Estado de la orden',
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Estado de orden inválido' })
  status?: OrderStatus;

  @ApiProperty({
    example: PaymentStatus.COMPLETED,
    enum: PaymentStatus,
    description: 'Estado del pago',
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus, { message: 'Estado de pago inválido' })
  paymentStatus?: PaymentStatus;

  @ApiProperty({
    example: 'Pedido despachado con Correo Argentino. Tracking: AR123456',
    description: 'Notas internas del admin',
    required: false,
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;
}