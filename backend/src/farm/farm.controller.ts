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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('farm')
@ApiTags('Farm')
export class FarmController {
  constructor(private readonly farmService: FarmService) {}

  @ApiOperation({
    summary: 'Create farm',
    description: 'Endpoint to create farm on database',
  })
  @ApiResponse({ status: 201, description: 'Farm created.' })
  @Post()
  createFarm(@Body() createFarmDto: CreateFarmDto) {
    return this.farmService.createFarm(createFarmDto);
  }

  @ApiOperation({
    summary: 'Find all farms',
    description: 'Find all active farms',
  })
  @ApiResponse({ status: 200, description: 'List os farms.', isArray: true })
  @Get()
  findAllFarms() {
    return this.farmService.findAllFarms();
  }

  @ApiOperation({
    summary: 'Find farm by ID',
    description: 'Find farm by ID',
  })
  @ApiResponse({ status: 200, description: 'The farm found by ID.' })
  @ApiResponse({ status: 404, description: 'Farm not found.' })
  @Get(':id')
  viewFarm(@Param('id') id: string) {
    return this.farmService.viewFarm(+id);
  }

  @ApiOperation({
    summary: 'Update farm',
    description: 'Update existing farm by ID',
  })
  @ApiResponse({ status: 201, description: 'Farm updated.' })
  @ApiResponse({ status: 404, description: 'Farm not found.' })
  @Patch(':id')
  updateFarm(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmService.updateFarm(+id, updateFarmDto);
  }

  @ApiOperation({
    summary: 'Delete farm',
    description: 'Delete existing farm by ID',
  })
  @ApiResponse({ status: 201, description: 'Farm inactive.' })
  @ApiResponse({ status: 404, description: 'Farm not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmService.remove(+id);
  }
}
