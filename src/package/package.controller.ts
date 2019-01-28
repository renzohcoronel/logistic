
import { Post, Controller, Body} from '@nestjs/common';
import { PackageDTO } from 'dtos/package.dto';
import { PackageService } from './package.service';

@Controller('api')
export class PackageController {
  
  constructor( private readonly packageService: PackageService) {}

  @Post('package')
  savePackage(@Body() packageDto: PackageDTO): any {
    console.log(packageDto);
    this.packageService.savePackage(packageDto); 
    return '';
  }
}
