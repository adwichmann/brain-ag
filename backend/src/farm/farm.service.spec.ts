import { Test, TestingModule } from '@nestjs/testing';
import { FarmService } from './farm.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Farm } from './entities/farm.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

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

  describe('updateFarm', () => {
    it('should update a farm', async () => {
      const updateFarmDto = { name: 'Updated Farm' };
      const farm = { id: 1, ...updateFarmDto };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(farm as Farm);
      jest.spyOn(repository, 'save').mockResolvedValue(farm as Farm);

      expect(await service.updateFarm(1, updateFarmDto as any)).toEqual(farm);
    });

    it('should throw a NotFoundException if farm not found', async () => {
      const updateFarmDto = { name: 'Updated Farm' };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.updateFarm(1, updateFarmDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException on save error', async () => {
      const updateFarmDto = { name: 'Updated Farm' };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue({ id: 1 } as Farm);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Error'));

      await expect(service.updateFarm(1, updateFarmDto as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // describe('remove', () => {
  //   it('should remove a farm', async () => {
  //     jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 });

  //     expect(await service.remove(1)).toEqual({ affected: 1 });
  //   });

  //   it('should throw a NotFoundException', async () => {
  //     jest.spyOn(repository, 'delete').mockRejectedValue(new Error('Error'));

  //     await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  //   });
  // });
});
