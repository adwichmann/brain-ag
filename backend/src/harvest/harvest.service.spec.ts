import { Test, TestingModule } from '@nestjs/testing';
import { HarvestService } from './harvest.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Harvest } from './entities/harvest.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';

describe('HarvestService', () => {
  let service: HarvestService;
  let repository: Repository<Harvest>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestService,
        {
          provide: getRepositoryToken(Harvest),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<HarvestService>(HarvestService);
    repository = module.get<Repository<Harvest>>(getRepositoryToken(Harvest));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createHarvest', () => {
    it('should create a new harvest', async () => {
      const createHarvestDto: CreateHarvestDto = {
        name: '2° semestre',
      };
      const harvest = { id: 1, ...createHarvestDto };

      jest.spyOn(repository, 'save').mockResolvedValue(harvest as Harvest);

      expect(await service.createHarvest(createHarvestDto)).toEqual(harvest);
    });

    it('should throw a NotFoundException if an error occurs', async () => {
      const createHarvestDto: CreateHarvestDto = {
        name: '2° semestre',
      };

      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Error'));

      await expect(service.createHarvest(createHarvestDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllHarvests', () => {
    it('should return an array of harvests', async () => {
      const harvests = [{ id: 1 }, { id: 2 }];

      jest.spyOn(repository, 'find').mockResolvedValue(harvests as Harvest[]);

      expect(await service.findAllHarvests()).toEqual(harvests);
    });

    it('should throw a NotFoundException if an error occurs', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Error'));

      await expect(service.findAllHarvests()).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('viewHarvest', () => {
    it('should return a harvest by id', async () => {
      const harvest = { id: 1 };

      jest.spyOn(repository, 'findOne').mockResolvedValue(harvest as Harvest);

      expect(await service.viewHarvest(1)).toEqual(harvest);
    });

    it('should return an empty object if no harvest is found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      expect(await service.viewHarvest(1)).toEqual({});
    });

    it('should throw a NotFoundException if an error occurs', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('Error'));

      await expect(service.viewHarvest(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateHarvest', () => {
    const updateHarvestDto: UpdateHarvestDto = {
      name: '3° semestre',
      id: 1,
      active: true,
      crops: [],
    };
    // it('should update a harvest', async () => {
    //   const harvest = { ...updateHarvestDto };

    //   jest.spyOn(repository, 'findOneBy').mockResolvedValue(harvest as Harvest);
    //   jest.spyOn(repository, 'save').mockResolvedValue(harvest as Harvest);

    //   expect(await service.updateHarvest(1, updateHarvestDto)).toEqual(harvest);
    // });

    it('should throw a NotFoundException if no harvest is found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.updateHarvest(1, updateHarvestDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException if an error occurs', async () => {
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error('Error'));

      await expect(service.updateHarvest(1, updateHarvestDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a harvest', async () => {
      const harvest = { id: 1, active: true, deleted_on: null };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(harvest as Harvest);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...harvest,
        active: false,
        deleted_on: new Date(),
      } as Harvest);

      expect(await service.remove(1)).toEqual({
        ...harvest,
        active: false,
        deleted_on: expect.any(Date),
      });
    });

    it('should throw a NotFoundException if no harvest is found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw a NotFoundException if an error occurs', async () => {
      jest.spyOn(repository, 'findOneBy').mockRejectedValue(new Error('Error'));

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
