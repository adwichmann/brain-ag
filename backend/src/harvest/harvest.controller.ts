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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('harvest')
@ApiTags('Harvest')
export class HarvestController {
  constructor(private readonly harvestService: HarvestService) {}

  @ApiOperation({
    summary: 'Create harvest',
    description: 'Endpoint to create harvest on database',
  })
  @ApiResponse({ status: 201, description: 'Harvest created.' })
  @Post()
  create(@Body() createHarvestDto: CreateHarvestDto) {
    return this.harvestService.createHarvest(createHarvestDto);
  }

  @ApiOperation({
    summary: 'Find all harvests',
    description: 'Find all active harvests',
  })
  @ApiResponse({ status: 200, description: 'List os harvests.', isArray: true })
  @Get()
  findAll() {
    return this.harvestService.findAllHarvests();
  }

  @ApiOperation({
    summary: 'Find harvest by ID',
    description: 'Find harvest by ID',
  })
  @ApiResponse({ status: 200, description: 'The harvest found by ID.' })
  @ApiResponse({ status: 404, description: 'Harvest not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.harvestService.viewHarvest(+id);
  }

  @ApiOperation({
    summary: 'Update harvest',
    description: 'Update existing harvest by ID',
  })
  @ApiResponse({ status: 201, description: 'Harvest updated.' })
  @ApiResponse({ status: 404, description: 'Harvest not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHarvestDto: UpdateHarvestDto) {
    return this.harvestService.updateHarvest(+id, updateHarvestDto);
  }

  @ApiOperation({
    summary: 'Delete harvest',
    description: 'Delete existing harvest by ID',
  })
  @ApiResponse({ status: 201, description: 'Harvest inactive.' })
  @ApiResponse({ status: 404, description: 'Harvest not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.harvestService.remove(+id);
  }
}
