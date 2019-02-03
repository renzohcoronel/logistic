import {
  Controller,
  HttpException,
  HttpStatus,
  UseFilters,
  Put,
  Param,
  Query,
  Logger,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ActionWhenLimit } from 'models/warehouse.entity';
import { ApiImplicitQuery, ApiImplicitParam } from '@nestjs/swagger';
import { WarehouseDTO } from 'dtos/warehouse.dto';

@Controller('api')
export class WarehouseController {

  private readonly logger = new Logger(WarehouseController.name);

  constructor(private serviceWarehouse: WarehouseService) {}

  @ApiImplicitParam({ name: 'id', description: 'id of the warehouses' })
  @ApiImplicitQuery({
    name: 'actionLimit',
    enum: ['ACCEPT', 'ACCEPT_DELAYED', 'NARBY_NEXT_WAREHOUSE'],
  })
  @Put('warehouse/:id')
  async updateWarehouseActionLimit(@Param() params, @Query() query) {
    return new Promise<WarehouseDTO>( (resolve, reject) => this.serviceWarehouse
      .changeWarehouseActionLimit(params.id, query.actionLimit).then(
        (wh) => {
          this.logger.log(wh);
          const whDto = new WarehouseDTO();
          whDto.id = wh.id;
          whDto.city = wh.city;
          whDto.name = wh.name;
          resolve(whDto);
        })
      .catch(e => {
        reject(new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: e.message,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        ));
      }));
  }
}
