import { Test, TestingModule } from '@nestjs/testing';
import { CropService } from './crop.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Crop } from './entities/crop.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCropDto } from './dto/create-crop.dto';
import { Farm } from '../farm/entities/farm.entity';
import { Harvest } from '../harvest/entities/harvest.entity';
import { UpdateCropDto } from './dto/update-crop.dto';

describe('CropService', () => {
  let service: CropService;
  let repository: Repository<Crop>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropService,
        {
          provide: getRepositoryToken(Crop),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CropService>(CropService);
    repository = module.get<Repository<Crop>>(getRepositoryToken(Crop));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCrop', () => {
    const createCropDto: CreateCropDto = {
      name: 'Milho',
      harvest: new Harvest(),
    };
    it('should create a crop', async () => {
      const crop = { id: 1, ...createCropDto };
      jest.spyOn(repository, 'save').mockResolvedValue(crop as Crop);

      expect(await service.createCrop(createCropDto)).toEqual(crop);
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Error'));

      await expect(service.createCrop(createCropDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('viewCrop', () => {
    it('should return a crop', async () => {
      const crop = { id: 1, name: 'Milho' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(crop as Crop);

      expect(await service.viewCrop(1)).toEqual(crop);
    });

    it('should return an empty object if crop not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      expect(await service.viewCrop(1)).toEqual({});
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(repository, 'findOne').mockRejectedValue(new Error('Error'));

      await expect(service.viewCrop(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllCrops', () => {
    it('should return an array of crops', async () => {
      const crops = [{ id: 1, name: 'Milho' }];
      jest.spyOn(repository, 'find').mockResolvedValue(crops as Crop[]);

      expect(await service.findAllCrops()).toEqual(crops);
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(repository, 'find').mockRejectedValue(new Error('Error'));

      await expect(service.findAllCrops()).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCrop', () => {
    const updateCropDto = { id: 1, name: 'Milho', active: true };
    it('should update a crop', async () => {
      const crop = { id: 1, ...updateCropDto };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(crop as Crop);
      jest.spyOn(repository, 'save').mockResolvedValue(crop as Crop);

      expect(await service.updateCrop(1, updateCropDto)).toEqual(crop);
    });

    it('should throw a NotFoundException if crop not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.updateCrop(1, updateCropDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException on save error', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue({ id: 1 } as Crop);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Error'));

      await expect(service.updateCrop(1, updateCropDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a crop', async () => {
      const crop = { id: 1, name: 'Milho', active: true, deleted_on: null };
      const removedCrop = { ...crop, active: false, deleted_on: new Date() };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(crop as Crop);
      jest.spyOn(repository, 'save').mockResolvedValue(removedCrop as Crop);

      expect(await service.remove(1)).toEqual(removedCrop);
    });

    it('should throw a NotFoundException if crop not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw a NotFoundException on save error', async () => {
      const crop = { id: 1, name: 'Milho', active: true, deleted_on: null };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(crop as Crop);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Error'));

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
