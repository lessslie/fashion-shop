import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { ProductVariant } from '../../products/entities/product-variant.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cartId: string;

  @Column()
  variantId: string;

  // Relación Many-to-One con Cart
  @ManyToOne(() => Cart, (cart) => cart.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  // Relación Many-to-One con ProductVariant
  @ManyToOne(() => ProductVariant, {
    eager: true, // Siempre traer la variante con el producto
  })
  @JoinColumn({ name: 'variantId' })
  variant: ProductVariant;

  // Cantidad de este item en el carrito
  @Column({ default: 1 })
  quantity: number;

  // Snapshot del precio en el momento de agregar al carrito
  // (para comparar si el precio cambió después)
  @Column('decimal', { precision: 10, scale: 2 })
  priceAtAdd: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}