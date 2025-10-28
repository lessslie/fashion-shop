import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  // Relación Many-to-One con Product
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  // SKU único (generado automáticamente)
  @Column({ unique: true })
  sku: string; // Ej: "SACO-WHOLE-BEIGE-M"

  // Atributos de la variante (opcionales)
  @Column({ nullable: true })
  color?: string; // "Beige", "Negro", etc.

  @Column({ nullable: true })
  size?: string; // "S", "M", "L", etc.

  // Stock
  @Column({ default: 0 })
  stock: number;

  @Column({ default: 5 })
  lowStockThreshold: number; // Para avisar cuando está bajo

  // Imagen destacada (opcional)
  // Si existe, reemplaza la primera imagen del producto en la galería
  @Column({ nullable: true })
  featuredImage?: string;

  // Estado
  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isOutOfStock: boolean; // Se calcula cuando stock = 0

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}