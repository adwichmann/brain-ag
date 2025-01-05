import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('crop')
@ApiTags('Crop')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @ApiOperation({
    summary: 'Create crop',
    description: 'Endpoint to create crop on database',
  })
  @ApiResponse({ status: 201, description: 'Crop created.' })
  @Post()
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropService.createCrop(createCropDto);
  }

  @ApiOperation({
    summary: 'Find all crops',
    description: 'Find all active crops',
  })
  @ApiResponse({ status: 200, description: 'List os crops.', isArray: true })
  @Get()
  findAll() {
    return this.cropService.findAllCrops();
  }

  @ApiOperation({
    summary: 'Find crop by ID',
    description: 'Find crop by ID',
  })
  @ApiResponse({ status: 200, description: 'The crop found by ID.' })
  @ApiResponse({ status: 404, description: 'Crop not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cropService.viewCrop(+id);
  }

  @ApiOperation({
    summary: 'Update crop',
    description: 'Update existing crop by ID',
  })
  @ApiResponse({ status: 201, description: 'Crop updated.' })
  @ApiResponse({ status: 404, description: 'Crop not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropService.updateCrop(+id, updateCropDto);
  }

  @ApiOperation({
    summary: 'Delete crop',
    description: 'Delete existing crop by ID',
  })
  @ApiResponse({ status: 201, description: 'Crop inactive.' })
  @ApiResponse({ status: 404, description: 'Crop not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cropService.remove(+id);
  }
}
