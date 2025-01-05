import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Harvest } from './entities/harvest.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HarvestService {
  private readonly logger = new Logger(HarvestService.name);

  constructor(
    @InjectRepository(Harvest)
    private readonly harvestRepository: Repository<Harvest>,
  ) {}

  /**
   * this is function is used to create Harvest in Harvest Entity.
   * @param createHarvestDto this will type of createHarvestDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of harvest
   */
  async createHarvest(createHarvestDto: CreateHarvestDto): Promise<Harvest> {
    try {
      return await this.harvestRepository.save(createHarvestDto);
    } catch (error) {
      const message = error?.message
        ? error.message
        : 'Error on create harvest';
      this.logger.error(`[createHarvest]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function is used to get all the harvests list
   * @returns promise of array of harversts
   */
  async findAllHarvests(): Promise<Harvest[]> {
    try {
      return await this.harvestRepository.find();
    } catch (error) {
      const message = error?.message
        ? error.message
        : 'Error on get all harvests';
      this.logger.error(`[findAllHarvests]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function used to get data of harvest whose id is passed in parameter
   * @param id is type of number, which represent the id of harvest.
   * @returns promise of harvest
   */
  async viewHarvest(id: number): Promise<Harvest | {}> {
    try {
      const harvest = await this.harvestRepository.findOne({
        where: { id: id },
        relations: ['crops'],
      });

      return harvest || {};
    } catch (error) {
      const message = error?.message
        ? error.message
        : 'Error on get harvest by id';
      this.logger.error(`[viewHarvest]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function is used to updated specific harvest whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of harvest.
   * @param updateHarvestDto this is partial type of createHarvestDto.
   * @returns promise of udpate harvest
   */
  async updateHarvest(
    id: number,
    updateHarvestDto: UpdateHarvestDto,
  ): Promise<Harvest | {}> {
    try {
      const harvestFound = await this.harvestRepository.findOneBy({ id });

      if (!harvestFound) {
        throw new NotFoundException(`Could not find harvest with id: ${id}`);
      }
      updateHarvestDto.id = id;
      return await this.harvestRepository.save({
        ...harvestFound,
        ...updateHarvestDto,
      });
    } catch (error) {
      const message = error?.message
        ? error.message
        : 'Error on update harvest';
      this.logger.error(`[updateHarvest]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function is used to remove or delete harvest from database.
   * @param id is the type of number, which represent id of harvest
   * @returns promise of udpate harvest
   */
  async remove(id: number): Promise<Harvest> {
    try {
      const harvestFound = await this.harvestRepository.findOneBy({ id });

      if (!harvestFound) {
        throw new NotFoundException(`Could not find harvest with id: ${id}`);
      }
      harvestFound.active = false;
      harvestFound.deleted_on = new Date();
      return await this.harvestRepository.save(harvestFound);
    } catch (error) {
      const message = error?.message
        ? error.message
        : 'Error on delete harvest';
      this.logger.error(`[remove]: ${message}`);
      throw new NotFoundException(message);
    }
  }
}
