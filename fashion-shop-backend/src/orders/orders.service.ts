import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { ProductVariant } from '../products/entities/product-variant.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    private readonly cartService: CartService,
  ) {}

  // ==================== CREAR ORDEN DESDE EL CARRITO ====================
  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    // 1. Obtener carrito del usuario con totales
    const cartData = await this.cartService.getCart(userId);
    const { cart, subtotal, discount, total } = cartData;

    // Validar que el carrito no esté vacío
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException(
        'El carrito está vacío. Agregue productos antes de crear una orden.',
      );
    }

    // 2. Validar stock disponible para todos los items
    for (const cartItem of cart.items) {
      const variant = cartItem.variant;

      if (!variant.isActive) {
        throw new BadRequestException(
          `El producto "${variant.product.name}" ya no está disponible`,
        );
      }

      if (variant.stock < cartItem.quantity) {
        throw new BadRequestException(
          `Stock insuficiente para "${variant.product.name}". ` +
            `Disponible: ${variant.stock}, solicitado: ${cartItem.quantity}`,
        );
      }
    }

    // 3. Generar número de orden único
    const orderNumber = await this.generateOrderNumber();

    // 4. Crear la orden
    const order = this.orderRepository.create({
      userId,
      orderNumber,
      ...createOrderDto,
      subtotal,
      discount,
      total,
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    });

    const savedOrder = await this.orderRepository.save(order);

    // 5. Crear los items de la orden (con snapshot de datos)
    const orderItems: OrderItem[] = [];

    for (const cartItem of cart.items) {
      const variant = cartItem.variant;
      const product = variant.product;

      // Calcular precios
      const unitPrice = Number(product.basePrice);
      let discountAmount = 0;

      // Calcular descuento si aplica
      if (product.hasDiscount && this.isDiscountActive(product)) {
        if (product.discountType === 'PERCENTAGE') {
          discountAmount = (unitPrice * Number(product.discountValue)) / 100;
        } else {
          discountAmount = Math.min(Number(product.discountValue), unitPrice);
        }
      }

      const finalPrice = unitPrice - discountAmount;
      const itemSubtotal = finalPrice * cartItem.quantity;

      // Crear item con snapshot
      const orderItem = this.orderItemRepository.create({
        orderId: savedOrder.id,
        variantId: variant.id,
        productName: product.name,
        variantSku: variant.sku,
        variantColor: variant.color,
        variantSize: variant.size,
        productImage: product.images[0] || '',
        quantity: cartItem.quantity,
        unitPrice,
        discountAmount,
        finalPrice,
        subtotal: itemSubtotal,
      });

      const savedItem = await this.orderItemRepository.save(orderItem);
      orderItems.push(savedItem);

      // 6. Descontar stock de la variante
      variant.stock -= cartItem.quantity;
      variant.isOutOfStock = variant.stock === 0;
      await this.variantRepository.save(variant);

      // 7. Actualizar estadísticas del producto
      product.totalSold += cartItem.quantity;
      await this.variantRepository.manager.save(product);
    }

    // 8. Vaciar el carrito
    await this.cartService.clearCart(userId);

    // 9. Retornar orden completa
    return this.findOne(savedOrder.id);
  }

  // ==================== GENERAR NÚMERO DE ORDEN ÚNICO ====================
  private async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `ORD-${year}-`;

    // Buscar el último número de orden del año
    const lastOrder = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.orderNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('order.createdAt', 'DESC')
      .getOne();

    let nextNumber = 1;

    if (lastOrder) {
      const lastNumber = parseInt(lastOrder.orderNumber.split('-').pop() || '0');
      nextNumber = lastNumber + 1;
    }

    // Formatear con ceros a la izquierda (ej: ORD-2025-00001)
    const orderNumber = `${prefix}${nextNumber.toString().padStart(5, '0')}`;

    return orderNumber;
  }

  // ==================== VERIFICAR SI DESCUENTO ESTÁ ACTIVO ====================
  private isDiscountActive(product: any): boolean {
    if (!product.hasDiscount) return false;

    const now = new Date();

    if (product.discountStartDate && new Date(product.discountStartDate) > now) {
      return false;
    }

    if (product.discountEndDate && new Date(product.discountEndDate) < now) {
      return false;
    }

    return true;
  }

  // ==================== OBTENER TODAS LAS ÓRDENES (ADMIN) ====================
  async findAll(filters?: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    userId?: string;
  }): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.user', 'user');

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters?.paymentStatus) {
      query.andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: filters.paymentStatus,
      });
    }

    if (filters?.userId) {
      query.andWhere('order.userId = :userId', { userId: filters.userId });
    }

    query.orderBy('order.createdAt', 'DESC');

    return query.getMany();
  }

  // ==================== OBTENER ÓRDENES DE UN USUARIO ====================
  async findByUser(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  // ==================== OBTENER DETALLE DE UNA ORDEN ====================
  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'user'],
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  // ==================== ACTUALIZAR ORDEN (ADMIN) ====================
  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Actualizar campos
    Object.assign(order, updateOrderDto);

    // Si se marca como completada, guardar timestamp
    if (
      updateOrderDto.status === OrderStatus.DELIVERED &&
      !order.completedAt
    ) {
      order.completedAt = new Date();
    }

    // Si se cancela, guardar timestamp
    if (
      updateOrderDto.status === OrderStatus.CANCELLED &&
      !order.cancelledAt
    ) {
      order.cancelledAt = new Date();
    }

    await this.orderRepository.save(order);

    return this.findOne(id);
  }

  // ==================== CANCELAR ORDEN ====================
  async cancel(id: string): Promise<Order> {
    const order = await this.findOne(id);

    // Solo se puede cancelar si está en PENDING o PROCESSING
    if (
      order.status !== OrderStatus.PENDING &&
      order.status !== OrderStatus.PROCESSING
    ) {
      throw new BadRequestException(
        'Solo se pueden cancelar órdenes en estado PENDING o PROCESSING',
      );
    }

    // Devolver stock a las variantes
    for (const item of order.items) {
      const variant = await this.variantRepository.findOne({
        where: { id: item.variantId },
      });

      if (variant) {
        variant.stock += item.quantity;
        variant.isOutOfStock = false;
        await this.variantRepository.save(variant);
      }
    }

    // Marcar orden como cancelada
    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();

    await this.orderRepository.save(order);

    return this.findOne(id);
  }
}