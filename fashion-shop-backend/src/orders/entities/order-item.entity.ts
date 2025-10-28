import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  variantId: string;

  // Relación Many-to-One con Order
  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  // Relación Many-to-One con ProductVariant
  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  // ==================== SNAPSHOT DE DATOS (histórico) ====================
  // Guardamos estos datos para mantener el historial aunque se edite/borre el producto

  @Column()
  productName: string; // Nombre del producto al momento de la compra

  @Column()
  variantSku: string; // SKU de la variante

  @Column({ nullable: true })
  variantColor?: string; // Color de la variante

  @Column({ nullable: true })
  variantSize?: string; // Talle de la variante

  @Column()
  productImage: string; // Primera imagen del producto

  // ==================== CANTIDAD Y PRECIOS ====================
  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number; // Precio unitario sin descuento

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discountAmount: number; // Descuento por unidad

  @Column('decimal', { precision: 10, scale: 2 })
  finalPrice: number; // Precio final por unidad (unitPrice - discountAmount)

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number; // finalPrice * quantity

  @CreateDateColumn()
  createdAt: Date;
}