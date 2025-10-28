import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Product } from '../products/entities/product.entity';
import { CartResponse, CartTotals } from './interfaces/cart-response.interface';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // ==================== OBTENER O CREAR CARRITO ====================
  private async getOrCreateCart(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId },
      relations: ['items', 'items.variant', 'items.variant.product'],
    });

    // Si no existe, crear uno nuevo
    if (!cart) {
      cart = this.cartRepository.create({ userId });
      cart = await this.cartRepository.save(cart);
    }

    return cart;
  }

  // ==================== OBTENER CARRITO DEL USUARIO ====================
  async getCart(userId: string): Promise<CartResponse> {
    const cart = await this.getOrCreateCart(userId);

    // Calcular totales
    const totals = this.calculateTotals(cart);

    return {
      cart,
      ...totals,
    };
  }

  // ==================== CALCULAR TOTALES DEL CARRITO ====================
  private calculateTotals(cart: Cart): CartTotals {
    let subtotal = 0;
    let discount = 0;
    let total = 0;

    for (const item of cart.items) {
      const product = item.variant.product;
      const basePrice = Number(product.basePrice);
      const quantity = item.quantity;

      // Calcular precio con descuento si aplica
      let itemPrice = basePrice;

      if (product.hasDiscount && product.discountType && this.isDiscountActive(product)) {
        const discountAmount = this.calculateDiscount(
          basePrice,
          product.discountType,
          Number(product.discountValue),
        );
        itemPrice = basePrice - discountAmount;
        discount += discountAmount * quantity;
      }

      subtotal += basePrice * quantity;
      total += itemPrice * quantity;
    }

    return {
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemCount: cart.items.length,
      totalQuantity: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }

  // ==================== VERIFICAR SI DESCUENTO ESTÁ ACTIVO ====================
  private isDiscountActive(product: Product): boolean {
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

  // ==================== CALCULAR DESCUENTO ====================
  private calculateDiscount(
    basePrice: number,
    discountType: string | undefined,
    discountValue: number,
  ): number {
    if (discountType === 'PERCENTAGE') {
      return (basePrice * discountValue) / 100;
    } else {
      // FIXED
      return Math.min(discountValue, basePrice); // No puede ser mayor al precio
    }
  }

  // ==================== AGREGAR ITEM AL CARRITO ====================
  async addItem(userId: string, addToCartDto: AddToCartDto): Promise<CartResponse> {
    const { variantId, quantity } = addToCartDto;

    // Verificar que la variante existe y está activa
    const variant = await this.variantRepository.findOne({
      where: { id: variantId, isActive: true },
      relations: ['product'],
    });

    if (!variant) {
      throw new NotFoundException(
        'Variante no encontrada o no está disponible',
      );
    }

    // Verificar que hay stock disponible
    if (variant.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${variant.stock} unidades`,
      );
    }

    // Obtener o crear carrito
    const cart = await this.getOrCreateCart(userId);

    // Verificar si el item ya existe en el carrito
    const existingItem = cart.items.find(
      (item) => item.variantId === variantId,
    );

    if (existingItem) {
      // Si existe, actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;

      // Verificar stock para la nueva cantidad
      if (variant.stock < newQuantity) {
        throw new BadRequestException(
          `Stock insuficiente. Disponible: ${variant.stock} unidades`,
        );
      }

      existingItem.quantity = newQuantity;
      await this.cartItemRepository.save(existingItem);
    } else {
      // Si no existe, crear nuevo item
      const newItem = this.cartItemRepository.create({
        cartId: cart.id,
        variantId,
        quantity,
        priceAtAdd: variant.product.basePrice,
      });

      await this.cartItemRepository.save(newItem);
    }

    return this.getCart(userId);
  }

  // ==================== ACTUALIZAR CANTIDAD DE ITEM ====================
  async updateItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ):Promise<CartResponse> {
    const { quantity } = updateCartItemDto;

    // Obtener carrito del usuario
    const cart = await this.getOrCreateCart(userId);

    // Buscar el item en el carrito
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    // Verificar stock disponible
    if (item.variant.stock < quantity) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${item.variant.stock} unidades`,
      );
    }

    // Actualizar cantidad
    item.quantity = quantity;
    await this.cartItemRepository.save(item);

    return this.getCart(userId);
  }

  // ==================== REMOVER ITEM DEL CARRITO ====================
  async removeItem(userId: string, itemId: string): Promise<CartResponse> {
    // Obtener carrito del usuario
    const cart = await this.getOrCreateCart(userId);

    // Buscar el item en el carrito
    const item = cart.items.find((i) => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    // Eliminar item
    await this.cartItemRepository.remove(item);

    return this.getCart(userId);
  }

  // ==================== VACIAR CARRITO ====================
  async clearCart(userId: string):Promise<CartResponse> {
    const cart = await this.getOrCreateCart(userId);

    // Eliminar todos los items
    if (cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }

    return this.getCart(userId);
  }
}