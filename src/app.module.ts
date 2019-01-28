import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackagesModule } from 'package/package.module';
import { APP_PIPE } from '@nestjs/core';
import { ValidationDTO } from 'pipes/validationDTO.pipe';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT,10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: ['src/**/**.entity{.ts,.js}'],
      synchronize: true,
    })
    ,
    PackagesModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationDTO,
    },
    AppService],
})
export class AppModule {}
