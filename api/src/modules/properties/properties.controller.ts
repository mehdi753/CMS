import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { AddPropertyDto } from './dto/add-property.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { GetPropertiesDto } from './dto/get-properties.dto';
import { EditPropertyDto } from './dto/edit-property.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('properties')
@UseGuards(JwtAuthGuard)
export class PropertiesController {
  constructor(private readonly propertyService: PropertiesService) {}

  @Post()
  async getProperties(@Body() filters: GetPropertiesDto) {
    return await this.propertyService.getProperties(filters);
  }

  @Post('add')
  async addProperty(@Body() property: AddPropertyDto) {
    return await this.propertyService.addProperty(property);
  }

  @Put()
  async updatePropertyDto(@Body() property: EditPropertyDto) {
    return await this.propertyService.updatePropertyDto(property);
  }

  @Delete(':id')
  async deleteProperty(@Param('id') id: string) {
    return await this.propertyService.deleteProperty(id);
  }

  @Post('subscribe')
  async subscribeUser(@Body() data: SubscribeDto) {
    return await this.propertyService.subscribeUser(data);
  }
}
