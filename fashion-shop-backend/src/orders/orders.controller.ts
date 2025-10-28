import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { OrderStatus, PaymentStatus } from './entities/order.entity';
import { RequestWithUser } from '../common/interfaces';

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth('JWT-auth')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ==================== CREAR ORDEN DESDE EL CARRITO ====================
  @Post()
  @ApiOperation({
    summary: 'Crear orden desde el carrito (checkout)',
    description:
      'Convierte el carrito del usuario en una orden. Valida stock, descuenta inventario y vacía el carrito.',
  })
  @ApiResponse({
    status: 201,
    description: 'Orden creada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Carrito vacío o stock insuficiente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  create(@Req() req: RequestWithUser, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, createOrderDto);
  }

  // ==================== OBTENER TODAS LAS ÓRDENES (ADMIN) ====================
  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener todas las órdenes (ADMIN)',
    description: 'Lista todas las órdenes con filtros opcionales',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: OrderStatus,
    description: 'Filtrar por estado de la orden',
  })
  @ApiQuery({
    name: 'paymentStatus',
    required: false,
    enum: PaymentStatus,
    description: 'Filtrar por estado del pago',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filtrar por ID de usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Solo ADMIN',
  })
  findAll(
    @Query('status') status?: OrderStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('userId') userId?: string,
  ) {
    const filters = { status, paymentStatus, userId };
    return this.ordersService.findAll(filters);
  }

  // ==================== OBTENER MIS ÓRDENES (USUARIO) ====================
  @Get('my-orders')
  @ApiOperation({
    summary: 'Obtener mis órdenes',
    description: 'Lista todas las órdenes del usuario autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de órdenes del usuario',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  findMyOrders(@Req() req: RequestWithUser ) {
    return this.ordersService.findByUser(req.user.id);
  }

  // ==================== OBTENER DETALLE DE UNA ORDEN ====================
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener detalle de una orden',
    description:
      'Usuarios pueden ver solo sus órdenes. Admin puede ver cualquier orden.',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de la orden',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  async findOne(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    const order = await this.ordersService.findOne(id);

    // Si no es admin, solo puede ver sus propias órdenes
    if (req.user.role !== UserRole.ADMIN && order.userId !== req.user.id) {
      throw new Error('No tienes permiso para ver esta orden');
    }

    return order;
  }

  // ==================== ACTUALIZAR ORDEN (ADMIN) ====================
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Actualizar estado de orden (ADMIN)',
    description: 'Permite al admin cambiar el estado de la orden y del pago',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden actualizada exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Solo ADMIN',
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  // ==================== CANCELAR ORDEN ====================
  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancelar orden',
    description:
      'Cancela la orden y devuelve el stock. Solo PENDING o PROCESSING.',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden cancelada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'La orden no puede ser cancelada en su estado actual',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Orden no encontrada',
  })
  async cancel(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    const order = await this.ordersService.findOne(id);

    // Si no es admin, solo puede cancelar sus propias órdenes
    if (req.user.role !== UserRole.ADMIN && order.userId !== req.user.id) {
      throw new Error('No tienes permiso para cancelar esta orden');
    }

    return this.ordersService.cancel(id);
  }
}