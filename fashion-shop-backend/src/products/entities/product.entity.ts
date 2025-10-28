import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

// Enums
export enum ProductCategory {
  ROPA = 'ROPA',
  CARTERAS = 'CARTERAS',
  ACCESORIOS = 'ACCESORIOS',
  CALZADOS = 'CALZADOS',
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE', // Descuento porcentual (ej: 20%)
  FIXED = 'FIXED', // Descuento fijo (ej: $5000)
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string; // URL-friendly name (ej: "saco-whole")

  @Column('text')
  description: string;

  // Categorización
  @Column({
    type: 'enum',
    enum: ProductCategory,
  })
  category: ProductCategory;

  @Column({ nullable: true })
  subcategory?: string; // "remeras", "camperas", etc.

  @Column({ nullable: true })
  brand?: string;

  // Precio base
  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  // Descuentos
  @Column({ default: false })
  hasDiscount: boolean;

  @Column({
    type: 'enum',
    enum: DiscountType,
    nullable: true,
  })
  discountType?: DiscountType;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountValue?: number;

  @Column({ type: 'timestamp', nullable: true })
  discountStartDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  discountEndDate?: Date;

  // Imágenes (array de URLs de Cloudinary)
  @Column('simple-array')
  images: string[];

  // Tags predefinidos
  @Column('simple-array', { default: '' })
  styleTags: string[]; // ["urban", "elegant", "kids"]

  @Column('simple-array', { default: '' })
  categoryTags: string[]; // ["remeras", "camperas", "jeans", etc.]

  // Estados
  @Column({
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT,
  })
  status: ProductStatus;

  @Column({ default: false })
  isFeatured: boolean; // Para destacar en home

  @Column({ default: false })
  isNew: boolean; // Badge "NEW"

  // Estadísticas
  @Column({ default: 0 })
  totalSold: number;

  @Column({ default: 0 })
  viewCount: number;

  // Relación con variantes
  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
  })
  variants: ProductVariant[];

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date; // Soft delete
}