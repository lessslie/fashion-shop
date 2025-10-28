import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

// Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  MERCADO_PAGO = 'MERCADO_PAGO',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  // Relación Many-to-One con User
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Número de orden único (visible para el usuario)
  @Column({ unique: true })
  orderNumber: string; // Ej: "ORD-2025-00123"

  // ==================== INFORMACIÓN DE FACTURACIÓN/ENVÍO ====================
  @Column()
  billingFirstName: string;

  @Column()
  billingLastName: string;

  @Column({ nullable: true })
  billingCompany?: string;

  @Column()
  billingCountry: string;

  @Column()
  billingAddress: string;

  @Column()
  billingCity: string;

  @Column()
  billingProvince: string;

  @Column()
  billingZipCode: string;

  @Column()
  billingPhone: string;

  @Column()
  billingEmail: string;

  // ==================== TOTALES ====================
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number; // Suma de items sin descuentos

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  discount: number; // Total de descuentos aplicados

  @Column('decimal', { precision: 10, scale: 2 })
  total: number; // Subtotal - Discount

  // ==================== PAGO ====================
  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  // ==================== ESTADO DE LA ORDEN ====================
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  // ==================== NOTAS ====================
  @Column('text', { nullable: true })
  orderNotes?: string; // Notas del cliente

  @Column('text', { nullable: true })
  adminNotes?: string; // Notas internas del admin

  // ==================== RELACIONES ====================
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  // ==================== TIMESTAMPS ====================
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;
}