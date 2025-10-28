import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles, UserRole } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ProductStatus } from './entities/product.entity';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ==================== CREAR PRODUCTO (ADMIN) ====================
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear nuevo producto con variantes (ADMIN)' })
  @ApiResponse({
    status: 201,
    description: 'Producto creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Solo ADMIN',
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // ==================== LISTAR TODOS LOS PRODUCTOS (PÚBLICO) ====================
  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todos los productos con filtros opcionales' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrar por categoría (ROPA, CARTERAS, ACCESORIOS, CALZADOS)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por estado (DRAFT, ACTIVE, ARCHIVED, OUT_OF_STOCK)',
  })
  @ApiQuery({
    name: 'isFeatured',
    required: false,
    type: Boolean,
    description: 'Filtrar productos destacados',
  })
  @ApiQuery({
    name: 'isNew',
    required: false,
    type: Boolean,
    description: 'Filtrar productos nuevos',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Precio mínimo',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Precio máximo',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos',
  })
  findAll(
    @Query('category') category?: string,
    @Query('status') status?: ProductStatus,
    @Query('isFeatured') isFeatured?: string,
    @Query('isNew') isNew?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
  ) {
    const filters = {
      category,
      status,
      isFeatured: isFeatured === 'true' ? true : undefined,
      isNew: isNew === 'true' ? true : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    };

    return this.productsService.findAll(filters);
  }

  // ==================== BUSCAR PRODUCTOS POR TEXTO (PÚBLICO) ====================
  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Buscar productos por nombre, descripción o marca' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Texto de búsqueda',
    example: 'saco',
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados de búsqueda',
  })
  search(@Query('q') query: string) {
    return this.productsService.search(query);
  }

  // ==================== VER PRODUCTO POR SLUG (PÚBLICO) ====================
  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Obtener producto por slug (URL amigable)' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  // ==================== VER PRODUCTO POR ID (PÚBLICO) ====================
  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Producto encontrado',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  // ==================== ACTUALIZAR PRODUCTO (ADMIN) ====================
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar producto (ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
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
    description: 'Producto no encontrado',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  // ==================== ELIMINAR PRODUCTO (ADMIN - SOFT DELETE) ====================
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar producto (ADMIN) - Soft delete' })
  @ApiResponse({
    status: 204,
    description: 'Producto eliminado exitosamente',
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
    description: 'Producto no encontrado',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

  // ==================== RESTAURAR PRODUCTO (ADMIN) ====================
  @Post(':id/restore')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Restaurar producto eliminado (ADMIN)' })
  @ApiResponse({
    status: 200,
    description: 'Producto restaurado exitosamente',
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
    description: 'Producto no encontrado',
  })
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.restore(id);
  }
}