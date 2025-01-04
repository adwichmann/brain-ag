import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farm } from './entities/farm.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Harvest } from '../harvest/entities/harvest.entity';

describe('FarmService', () => {
  let service: FarmService;
  let repository: Repository<Farm>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FarmService,
        {
          provide: getRepositoryToken(Farm),
          useClass: Repository,
        },
        { provide: getRepositoryToken(Harvest), useClass: Repository },
      ],
    }).compile();

    service = module.get<FarmService>(FarmService);
    repository = module.get<Repository<Farm>>(getRepositoryToken(Farm));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFarm', () => {
    it('should create a farm', async () => {
      const createFarmDto = { name: 'Test Farm' };
      const farm = { id: 1, ...createFarmDto };
      jest.spyOn(repository, 'save').mockResolvedValue(farm as Farm);

      expect(await service.createFarm(createFarmDto as any)).toEqual(farm);
    });

    it('should throw a NotFoundException', async () => {
      const createFarmDto = { name: 'Test Farm' };
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Error'));

      await expect(service.createFarm(createFarmDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllFarms', () => {
    it('should return an array of farms', async () => {
      const farms = [{ id: 1, name: 'Test Farm' }];
      jest.spyOn(repository, 'find').mockResolvedValue(farms as Farm[]);

      expect(await service.findAllFarms()).toEqual(farms);
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Error'));

      await expect(service.findAllFarms()).rejects.toThrow(NotFoundException);
    });
  });

  describe('viewFarm', () => {
    it('should return a farm', async () => {
      const farm = { id: 1, name: 'Test Farm' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(farm as Farm);

      expect(await service.viewFarm(1)).toEqual(farm);
    });

    it('should return an empty object if farm not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      expect(await service.viewFarm(1)).toEqual({});
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('Error'));

      await expect(service.viewFarm(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a harvest', async () => {
      const farm = { id: 1, active: true, deleted_on: null };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(farm as Farm);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...farm,
        active: false,
        deleted_on: new Date(),
      } as Farm);

      expect(await service.remove(1)).toEqual({
        ...farm,
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
