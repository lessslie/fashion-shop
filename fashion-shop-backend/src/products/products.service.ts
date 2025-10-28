import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  // ==================== CREAR PRODUCTO ====================
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Validar descuentos
    this.validateDiscount(createProductDto);

    // Generar slug único
    const slug = await this.generateUniqueSlug(createProductDto.name);

    // Crear el producto (sin variantes aún)
    const product = this.productRepository.create({
      ...createProductDto,
      slug,
      styleTags: createProductDto.styleTags || [],
      categoryTags: createProductDto.categoryTags || [],
      status: createProductDto.status || ProductStatus.DRAFT,
    });

    // Guardar el producto primero
    const savedProduct = await this.productRepository.save(product);

    // Crear las variantes
    const variants = await this.createVariantsForProduct(
      savedProduct.id,
      createProductDto.variants,
      createProductDto.name,
    );

    // Actualizar el producto con las variantes
    savedProduct.variants = variants;

    // Actualizar estado OUT_OF_STOCK si todas las variantes están sin stock
    await this.updateProductStockStatus(savedProduct.id);

    return this.findOne(savedProduct.id);
  }

  // ==================== CREAR VARIANTES PARA UN PRODUCTO ====================
  private async createVariantsForProduct(
    productId: string,
    variantsDto: CreateProductVariantDto[],
    productName: string,
  ): Promise<ProductVariant[]> {
    const variants: ProductVariant[] = [];

    for (const variantDto of variantsDto) {
      // Generar SKU único
      const sku = await this.generateUniqueSku(
        productName,
        variantDto.color,
        variantDto.size,
      );

      const variant = this.variantRepository.create({
        ...variantDto,
        productId,
        sku,
        isOutOfStock: variantDto.stock === 0,
      });

      const savedVariant: ProductVariant = await this.variantRepository.save(variant);
      variants.push(savedVariant);
    }

    return variants;
  }

  // ==================== GENERAR SLUG ÚNICO ====================
  private async generateUniqueSlug(name: string): Promise<string> {
    // Convertir nombre a slug (ej: "Saco Whole" -> "saco-whole")
    let slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .trim()
      .replace(/\s+/g, '-'); // Reemplazar espacios por guiones

    // Verificar si el slug ya existe
    const existingProduct = await this.productRepository.findOne({
      where: { slug },
    });

    // Si existe, agregar número al final
    if (existingProduct) {
      let counter = 1;
      let newSlug = `${slug}-${counter}`;

      while (await this.productRepository.findOne({ where: { slug: newSlug } })) {
        counter++;
        newSlug = `${slug}-${counter}`;
      }

      slug = newSlug;
    }

    return slug;
  }

  // ==================== GENERAR SKU ÚNICO ====================
  private async generateUniqueSku(
    productName: string,
    color?: string,
    size?: string,
  ): Promise<string> {
    // Generar SKU base (ej: "SACO-WHOLE-BEIGE-M")
    const namePart = productName
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .substring(0, 20); // Limitar longitud

    const colorPart = color
      ? color
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^A-Z0-9]/g, '')
      : '';

    const sizePart = size ? size.toUpperCase() : '';

    let sku = [namePart, colorPart, sizePart].filter(Boolean).join('-');

    // Verificar si el SKU ya existe
    const existingVariant = await this.variantRepository.findOne({
      where: { sku },
    });

    // Si existe, agregar número aleatorio al final
    if (existingVariant) {
      const randomSuffix = Math.floor(Math.random() * 9999)
        .toString()
        .padStart(4, '0');
      sku = `${sku}-${randomSuffix}`;
    }

    return sku;
  }

  // ==================== VALIDAR DESCUENTOS ====================
  private validateDiscount(productDto: CreateProductDto | UpdateProductDto) {
    if (productDto.hasDiscount) {
      if (!productDto.discountType || productDto.discountValue == null) {
        throw new BadRequestException(
          'Si hasDiscount es true, debe especificar discountType y discountValue',
        );
      }

      if (productDto.discountValue <= 0) {
        throw new BadRequestException(
          'El valor del descuento debe ser mayor a 0',
        );
      }

      // Validar fechas
      if (productDto.discountStartDate && productDto.discountEndDate) {
        const startDate = new Date(productDto.discountStartDate);
        const endDate = new Date(productDto.discountEndDate);

        if (startDate >= endDate) {
          throw new BadRequestException(
            'La fecha de inicio debe ser anterior a la fecha de fin',
          );
        }
      }
    }
  }

  // ==================== ACTUALIZAR ESTADO DE STOCK DEL PRODUCTO ====================
  private async updateProductStockStatus(productId: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['variants'],
    });

    if (!product) return;

    // Verificar si todas las variantes están sin stock
    const allOutOfStock = product.variants.every(
      (variant) => variant.stock === 0,
    );

    if (allOutOfStock && product.status !== ProductStatus.OUT_OF_STOCK) {
      product.status = ProductStatus.OUT_OF_STOCK;
      await this.productRepository.save(product);
    } else if (!allOutOfStock && product.status === ProductStatus.OUT_OF_STOCK) {
      // Si había stock nuevamente, volver a ACTIVE
      product.status = ProductStatus.ACTIVE;
      await this.productRepository.save(product);
    }
  }

  // ==================== BUSCAR TODOS LOS PRODUCTOS ====================
  async findAll(filters?: {
    category?: string;
    status?: ProductStatus;
    isFeatured?: boolean;
    isNew?: boolean;
    minPrice?: number;
    maxPrice?: number;
    styleTags?: string[];
    categoryTags?: string[];
  }): Promise<Product[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.deletedAt IS NULL'); // Solo productos no eliminados

    // Filtros opcionales
    if (filters?.category) {
      query.andWhere('product.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.status) {
      query.andWhere('product.status = :status', { status: filters.status });
    }

    if (filters?.isFeatured !== undefined) {
      query.andWhere('product.isFeatured = :isFeatured', {
        isFeatured: filters.isFeatured,
      });
    }

    if (filters?.isNew !== undefined) {
      query.andWhere('product.isNew = :isNew', { isNew: filters.isNew });
    }

    if (filters?.minPrice !== undefined) {
      query.andWhere('product.basePrice >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters?.maxPrice !== undefined) {
      query.andWhere('product.basePrice <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    // Ordenar por fecha de creación (más recientes primero)
    query.orderBy('product.createdAt', 'DESC');

    return query.getMany();
  }

  // ==================== BUSCAR PRODUCTO POR ID ====================
  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Incrementar contador de vistas
    product.viewCount += 1;
    await this.productRepository.save(product);

    return product;
  }

  // ==================== BUSCAR PRODUCTO POR SLUG ====================
  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con slug "${slug}" no encontrado`);
    }

    // Incrementar contador de vistas
    product.viewCount += 1;
    await this.productRepository.save(product);

    return product;
  }

  // ==================== ACTUALIZAR PRODUCTO ====================
  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Validar descuentos
    if (updateProductDto.hasDiscount !== undefined) {
      this.validateDiscount(updateProductDto);
    }

    // Si cambian el nombre, regenerar slug
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      updateProductDto['slug'] = await this.generateUniqueSlug(
        updateProductDto.name,
      );
    }

    // Actualizar producto
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);

    return this.findOne(updatedProduct.id);
  }

  // ==================== ELIMINAR PRODUCTO (SOFT DELETE) ====================
  async remove(id: string): Promise<void> {
    // Verificar que el producto existe (lanza error si no existe)
    await this.findOne(id);
    await this.productRepository.softDelete(id);
  }

  // ==================== RESTAURAR PRODUCTO ====================
  async restore(id: string): Promise<Product> {
    await this.productRepository.restore(id);
    return this.findOne(id);
  }

  // ==================== BUSCAR PRODUCTOS (SEARCH) ====================
  async search(query: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variants')
      .where('product.deletedAt IS NULL')
      .andWhere(
        '(LOWER(product.name) LIKE LOWER(:query) OR LOWER(product.description) LIKE LOWER(:query) OR LOWER(product.brand) LIKE LOWER(:query))',
        { query: `%${query}%` },
      )
      .orderBy('product.viewCount', 'DESC')
      .getMany();
  }
}