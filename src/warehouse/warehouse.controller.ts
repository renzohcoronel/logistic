
import { Controller, HttpException, HttpStatus, UseFilters, Put, Param, Query} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { ActionWhenLimit } from 'models/warehouse.entity';

@Controller('api')
export class WarehouseController {
  
  constructor(private serviceWarehouse: WarehouseService) {}

  @Put('warehouse/:id')
  updateWarehouseActionLimit(@Param() params,@Query() query) {
      return this.serviceWarehouse.changeWarehouseActionLimit(params.id, query.actionLimit).catch(e => {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e,
        }, HttpStatus.INTERNAL_SERVER_ERROR);
      });
  }
}