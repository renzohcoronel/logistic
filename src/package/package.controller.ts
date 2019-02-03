import {
  Post,
  Controller,
  Body,
  HttpException,
  HttpStatus,
  UseFilters,
} from '@nestjs/common';
import { PackageDTO } from './../dtos/package.dto';
import { PackageService } from './package.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post('package')
  @ApiOperation({ title: 'Create package' })
  savePackage(@Body() packageDto: PackageDTO) {
    return this.packageService.savePackage(packageDto).catch(e => {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: e,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    });
  }
}
