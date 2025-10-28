import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';


@ApiTags('Cart')
@Controller('cart')
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ==================== OBTENER CARRITO ====================
  @Get()
  @ApiOperation({ summary: 'Obtener carrito del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Carrito con items y totales',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  // ==================== AGREGAR ITEM AL CARRITO ====================
  @Post('items')
  @ApiOperation({ summary: 'Agregar item al carrito' })
  @ApiResponse({
    status: 201,
    description: 'Item agregado al carrito exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Stock insuficiente o datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Variante no encontrada',
  })
  addItem(@Req() req: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addItem(req.user.id, addToCartDto);
  }

  // ==================== ACTUALIZAR CANTIDAD DE ITEM ====================
  @Patch('items/:id')
  @ApiOperation({ summary: 'Actualizar cantidad de un item del carrito' })
  @ApiResponse({
    status: 200,
    description: 'Cantidad actualizada exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Stock insuficiente o datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Item no encontrado en el carrito',
  })
  updateItem(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(req.user.id, id, updateCartItemDto);
  }

  // ==================== REMOVER ITEM DEL CARRITO ====================
  @Delete('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remover item del carrito' })
  @ApiResponse({
    status: 200,
    description: 'Item removido exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Item no encontrado en el carrito',
  })
  removeItem(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    return this.cartService.removeItem(req.user.id, id);
  }

  // ==================== VACIAR CARRITO ====================
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Vaciar carrito completamente' })
  @ApiResponse({
    status: 200,
    description: 'Carrito vaciado exitosamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}