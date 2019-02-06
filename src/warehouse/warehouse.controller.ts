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
import {
  ApiImplicitQuery,
  ApiImplicitParam,
  ApiOperation,
} from '@nestjs/swagger';
import { WarehouseDTO } from './../dtos/warehouse.dto';

@Controller('api')
export class WarehouseController {
  private readonly logger = new Logger(WarehouseController.name);

  constructor(private serviceWarehouse: WarehouseService) {}

  @ApiOperation({
    title: 'Update warehouse decision action when it is 95% occupied ',
  })
  @ApiImplicitParam({ name: 'id', description: 'id of the warehouses' })
  @ApiImplicitQuery({
    name: 'actionLimit',
    enum: ['ACCEPT', 'ACCEPT_DELAYED', 'NARBY_NEXT_WAREHOUSE'],
  })
  @Put('warehouse/:id')
  async updateWarehouseActionLimit(@Param() params, @Query() query) {
    return new Promise<WarehouseDTO>((resolve, reject) =>
      this.serviceWarehouse
        .changeWarehouseAction(params.id, query.actionLimit)
        .then(({id, city, name}) => {
          const whDto = new WarehouseDTO();
          whDto.id = id;
          whDto.city = city;
          whDto.name = name;

          this.logger.log(`Updated warehouse ${whDto.name}`);

          resolve(whDto);
        })
        .catch(e => {
          reject(
            new HttpException(
              {
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: e.message,
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        }),
    );
  }
}
