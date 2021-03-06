import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesModule } from './package/package.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationDTO } from './pipes/validationDTO.pipe';
import { WarehouseModule } from './warehouse/warehouse.module';
import { Warehouse } from './models/warehouse.entity';
import { Customer } from './models/customer.entity';
import { Package } from './models/package.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Warehouse, Customer, Package],
      synchronize: true,
    }),
    PackagesModule,
    WarehouseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationDTO,
    },
  ],
})
export class AppModule {
  constructor() {}
}
