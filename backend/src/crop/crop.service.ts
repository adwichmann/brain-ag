import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Crop } from './entities/crop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CropService {
  private readonly logger = new Logger(CropService.name);

  constructor(
    @InjectRepository(Crop)
    private readonly cropRepository: Repository<Crop>,
  ) {}

  /**
   * this is function is used to create Crop in database.
   * @param createCropDto this will type of createCropDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of crop
   */
  async createCrop(createCropDto: CreateCropDto): Promise<Crop> {
    try {
      return await this.cropRepository.save(createCropDto);
    } catch (error) {
      const message = error?.message ? error.message : 'Error on create crop';
      this.logger.error(`[createCrop]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function used to get data of crop whose id is passed in parameter
   * @param id is type of number, which represent the id of crop.
   * @returns promise of crop
   */
  async viewCrop(id: number): Promise<Crop | {}> {
    try {
      const crop = await this.cropRepository.findOne({
        where: { id: id },
        relations: ['harvest'],
      });
      return crop || {};
    } catch (error) {
      const message = error?.message
        ? error.message
        : 'Error on get crop by id';
      this.logger.error(`[viewCrop]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function is used to get all the crops list
   * @returns promise of array of crops
   */
  async findAllCrops(): Promise<Crop[]> {
    try {
      return await this.cropRepository.find();
    } catch (error) {
      const message = error?.message ? error.message : 'Error on get all crops';
      this.logger.error(`[findAllCrops]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function is used to updated specific crop whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of crop.
   * @param updateCropDto this is partial type of createCroptDto.
   * @returns promise of udpate crop
   */
  async updateCrop(
    id: number,
    updateCropDto: UpdateCropDto,
  ): Promise<Crop | {}> {
    try {
      const cropFound = await this.cropRepository.findOneBy({ id });

      if (!cropFound) {
        throw new NotFoundException(`Could not find crop with id: ${id}`);
      }
      updateCropDto.id = id;

      await this.cropRepository.save(updateCropDto);
      return await this.cropRepository.findOneBy({ id });
    } catch (error) {
      const message = error?.message ? error.message : 'Error on update crop';
      this.logger.error(`[updateCrop]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function is used to remove or delete crop from database.
   * @param id is the type of number, which represent id of crop
   * @returns promise of udpate crop
   */
  async remove(id: number): Promise<Crop> {
    try {
      const cropFound = await this.cropRepository.findOneBy({ id });

      if (!cropFound) {
        throw new NotFoundException(`Could not find crop with id: ${id}`);
      }
      cropFound.active = false;
      cropFound.deleted_on = new Date();
      return await this.cropRepository.save(cropFound);
    } catch (error) {
      const message = error?.message ? error.message : 'Error on delete crop';
      this.logger.error(`[remove]: ${message}`);
      throw new NotFoundException(message);
    }
  }
}
