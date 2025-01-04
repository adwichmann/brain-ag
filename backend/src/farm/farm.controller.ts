import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';

@Controller('farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @Post()
  createFarm(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createFarm(createFarmDto);
  }

  @Get()
  findAllFarms() {
    return this.farmService.findAllFarms();
  }

  @Get(':id')
  viewFarm(@Param('id') id: string) {
    return this.farmService.viewFarm(+id);
  }

  @Patch(':id')
  updateFarm(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmService.updateFarm(+id, updateFarmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmService.remove(+id);
  }
}
