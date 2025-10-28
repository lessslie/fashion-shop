import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { Product } from '../products/entities/product.entity';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, ProductVariant, Product]),
    CartModule, // Importar CartModule para usar CartService
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService], // Exportar para usar en Reviews si es necesario
})
export class OrdersModule {}