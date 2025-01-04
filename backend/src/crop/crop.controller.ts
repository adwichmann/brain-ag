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

@Controller('crop')
export class CropController {
  constructor(private readonly cropService: CropService) {}

  @Post()
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropService.createCrop(createCropDto);
  }

  @Get()
  findAll() {
    return this.cropService.findAllCrops();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cropService.viewCrop(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropService.updateCrop(+id, updateCropDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cropService.remove(+id);
  }
}
