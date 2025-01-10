import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FarmService } from './farm.service';
import { Farm } from './entities/farm.entity';
import { Repository } from 'typeorm';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

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
    it('should create a new farm', async () => {
      const createFarmDto: CreateFarmDto = {
        total_area: 100,
        arable_area: 50,
        vegetation_area: 30,
        harvests: [],
        name: '',
        city: '',
        state: '',
        user: new User(),
      };
      const savedFarm = { id: 1, ...createFarmDto };
      jest.spyOn(repository, 'save').mockResolvedValue(savedFarm as Farm);
      jest.spyOn(repository, 'findOne').mockResolvedValue(savedFarm as Farm);

      const result = await service.createFarm(createFarmDto);
      expect(result).toEqual(savedFarm);
    });

    it('should throw BadRequestException if arable and vegetation area exceed total area', async () => {
      const createFarmDto: CreateFarmDto = {
        total_area: 100,
        arable_area: 60,
        vegetation_area: 50,
        harvests: [],
        name: '',
        city: '',
        state: '',
        user: new User(),
      };

      await expect(service.createFarm(createFarmDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllFarms', () => {
    it('should return an array of farms', async () => {
      const farms = [{ id: 1 }, { id: 2 }];
      jest.spyOn(repository, 'find').mockResolvedValue(farms as Farm[]);

      const result = await service.findAllFarms();
      expect(result).toEqual(farms);
    });
  });

  describe('viewFarm', () => {
    it('should return a farm by id', async () => {
      const farm = { id: 1 };
      jest.spyOn(repository, 'findOne').mockResolvedValue(farm as Farm);

      const result = await service.viewFarm(1);
      expect(result).toEqual(farm);
    });

    it('should return an empty object if farm not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.viewFarm(1);
      expect(result).toEqual({});
    });
  });

  describe('updateFarm', () => {
    it('should update a farm', async () => {
      const updateFarmDto: UpdateFarmDto = {
        total_area: 100,
        arable_area: 50,
        vegetation_area: 30,
        harvests: [],
        id: 0,
        active: false,
        crops: [],
      };
      const farm = { id: 1, ...updateFarmDto };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(farm as unknown as Farm);
      jest.spyOn(repository, 'save').mockResolvedValue(farm as unknown as Farm);

      const result = await service.updateFarm(1, updateFarmDto);
      expect(result).toEqual(farm);
    });

    it('should throw NotFoundException if farm not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateFarm(1, {} as UpdateFarmDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if arable and vegetation area exceed total area', async () => {
      const updateFarmDto: UpdateFarmDto = {
        total_area: 100,
        arable_area: 60,
        vegetation_area: 50,
        harvests: [],
        id: 0,
        active: false,
        crops: [],
      };
      const farm = { id: 1, ...updateFarmDto };
      jest
        .spyOn(repository, 'findOne')
        .mockResolvedValue(farm as unknown as Farm);

      await expect(service.updateFarm(1, updateFarmDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a farm', async () => {
      const farm = { id: 1, active: true, deleted_on: null };
      const removedFarm = { ...farm, active: false, deleted_on: new Date() };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(farm as Farm);
      jest.spyOn(repository, 'save').mockResolvedValue(removedFarm as Farm);

      const result = await service.remove(1);
      expect(result).toEqual(removedFarm);
    });

    it('should throw NotFoundException if farm not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
