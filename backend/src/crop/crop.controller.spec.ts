import { Test, TestingModule } from '@nestjs/testing';
import { CropController } from './crop.controller';
import { CropService } from './crop.service';
import { CreateCropDto } from './dto/create-crop.dto';
import { UpdateCropDto } from './dto/update-crop.dto';
import { Harvest } from '../harvest/entities/harvest.entity';
import { Crop } from './entities/crop.entity';

describe('CropController', () => {
  let controller: CropController;
  let service: CropService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CropController],
      providers: [
        {
          provide: CropService,
          useValue: {
            createCrop: jest.fn(),
            findAllCrops: jest.fn(),
            viewCrop: jest.fn(),
            updateCrop: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CropController>(CropController);
    service = module.get<CropService>(CropService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call createCrop with correct parameters', async () => {
      const createCropDto: CreateCropDto = {
        name: 'Milho',
        harvest: new Harvest(),
      };
      await controller.create(createCropDto);
      expect(service.createCrop).toHaveBeenCalledWith(createCropDto);
    });
  });

  describe('findAll', () => {
    it('should call findAllCrops', async () => {
      await controller.findAll();
      expect(service.findAllCrops).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call viewCrop with correct id', async () => {
      const id = '1';
      await controller.findOne(id);
      expect(service.viewCrop).toHaveBeenCalledWith(+id);
    });
  });

  describe('update', () => {
    it('should call updateCrop with correct parameters', async () => {
      const dto: UpdateCropDto = {
        id: 1,
        name: 'Limão',
        active: true,
      };
      const result = {
        ...dto,
      };
      jest.spyOn(service, 'updateCrop').mockResolvedValue(result);

      expect(await controller.update('1', dto)).toBe(result);
      expect(service.updateCrop).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a crop with correct id', async () => {
      const result = {
        id: 1,
        name: 'Limão',
        active: true,
      } as Crop;
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
