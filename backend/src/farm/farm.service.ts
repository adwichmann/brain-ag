import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Farm } from './entities/farm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FarmService {
  constructor(
    @InjectRepository(Farm) private readonly farmRepository: Repository<Farm>,
  ) {}

  /**
   * Creates a new farm record in the database.
   *
   * @param {CreateFarmDto} createFarmDto - Data Transfer Object containing the details of the farm to be created.
   * @returns {Promise<Farm>} - A promise that resolves to the created farm entity.
   * @throws {NotFoundException} - Throws an exception if there is an error during the creation process.
   */
  async createFarm(createFarmDto: CreateFarmDto): Promise<Farm> {
    try {
      const total_area = +createFarmDto.total_area || 0;
      const arable_area = +createFarmDto.arable_area || 0;
      const vegetation_area = +createFarmDto.vegetation_area || 0;

      if (vegetation_area + arable_area > total_area) {
        throw new BadRequestException(
          'Arable area and vegetation area cannot be greater than total area',
        );
      }

      return await this.farmRepository.save(createFarmDto);
    } catch (error) {
      throw new NotFoundException(
        error.message ? error.message : 'Error on create farm',
      );
    }
  }

  /**
   * this function is used to get all the farm's list
   * @returns promise of array of farms
   */
  async findAllFarms(): Promise<Farm[]> {
    try {
      return await this.farmRepository.find();
    } catch (error) {
      throw new NotFoundException(
        error.message ? error.message : 'Error on get all farms',
      );
    }
  }

  /**
   * this function used to get data of farm whose id is passed in parameter
   * @param id is type of number, which represent the id of farm.
   * @returns promise of farm
   */
  async viewFarm(id: number): Promise<Farm | {}> {
    try {
      const farm = await this.farmRepository.findOne({
        where: { id: id },
        relations: ['user', 'harvests', 'harvests.crops'],
      });

      return farm || {};
    } catch (error) {
      throw new NotFoundException(
        error.message ? error.message : 'Error on get farm by id',
      );
    }
  }

  /**
   * this function is used to updated specific farm whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of farm.
   * @param updateFarmDto this is partial type of createFarmDto.
   * @returns promise of udpate farm
   */
  async updateFarm(
    id: number,
    updateFarmDto: UpdateFarmDto,
  ): Promise<Farm | {}> {
    try {
      const farmFound = await this.farmRepository.findOne({
        where: { id: id },
        relations: ['user', 'harvests'],
      });

      if (!farmFound) {
        throw new NotFoundException(`Could not find farm with id: ${id}`);
      }

      if (updateFarmDto?.harversts && updateFarmDto?.harversts.length > 0) {
        await this.farmRepository
          .createQueryBuilder()
          .limit(1)
          .relation(Farm, 'harvests')
          .of(farmFound)
          .addAndRemove(updateFarmDto.harversts, farmFound.harvests);
      }

      updateFarmDto.id = id;
      await this.farmRepository.save(updateFarmDto);
      return await this.farmRepository.findOne({
        where: { id: id },
        relations: ['user', 'harvests'],
      });
    } catch (error) {
      throw new NotFoundException(
        error.message ? error.message : 'Error on update farm',
      );
    }
  }

  /**
   * this function is used to remove or delete farm from database.
   * @param id is the type of number, which represent id of farm
   * @returns nuber of rows deleted or affected
   */
  async remove(id: number): Promise<Farm | {}> {
    try {
      const farmFound = await this.farmRepository.findOneBy({ id });

      if (!farmFound) {
        throw new NotFoundException(`Could not find farm with id: ${id}`);
      }
      farmFound.active = false;
      farmFound.deleted_on = new Date();
      return await this.farmRepository.save(farmFound);
    } catch (error) {
      throw new NotFoundException(
        error.message ? error.message : 'Error on delete farm',
      );
    }
  }
}
