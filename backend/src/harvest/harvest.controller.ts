import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';

@Controller('harvest')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @Post()
  create(@Body() createHarvestDto: CreateHarvestDto) {
    return this.harvestService.createHarvest(createHarvestDto);
  }

  @Get()
  findAll() {
    return this.harvestService.findAllHarvests();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.harvestService.viewHarvest(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHarvestDto: UpdateHarvestDto) {
    return this.harvestService.updateHarvest(+id, updateHarvestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.harvestService.remove(+id);
  }
}