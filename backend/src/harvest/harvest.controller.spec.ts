import { Test, TestingModule } from '@nestjs/testing';
import { HarvestController } from './harvest.controller';
import { HarvestService } from './harvest.service';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { Harvest } from './entities/harvest.entity';
import { Farm } from '../farm/entities/farm.entity';

describe('HarvestController', () => {
  let controller: HarvestController;
  let service: HarvestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HarvestController],
      providers: [
        {
          provide: HarvestService,
          useValue: {
            createHarvest: jest.fn(),
            findAllHarvests: jest.fn(),
            viewHarvest: jest.fn(),
            updateHarvest: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HarvestController>(HarvestController);
    service = module.get<HarvestService>(HarvestService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a harvest', async () => {
      const dto: CreateHarvestDto = {
        name: 'Segunda parte',
        year: '2009',
      };

      const result = { id: 1, ...dto } as Harvest;
      jest.spyOn(service, 'createHarvest').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(service.createHarvest).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of harvests', async () => {
      const result: Harvest[] = [
        {
          id: 0,
          name: 'Segunda parte',
          year: '2009',
          farm: new Farm(),
          crops: [],
          active: false,
          created_on: undefined,
          updated_on: undefined,
          deleted_on: undefined,
        },
      ];
      jest.spyOn(service, 'findAllHarvests').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAllHarvests).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single harvest', async () => {
      const result = { id: 1, name: 'Segunda parte' };

      jest.spyOn(service, 'viewHarvest').mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(service.viewHarvest).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a harvest', async () => {
      const dto: UpdateHarvestDto = {
        id: 1,
        name: 'Terceira parte',
        active: true,
      };
      const result = {
        ...dto,
      };
      jest.spyOn(service, 'updateHarvest').mockResolvedValue(result);

      expect(await controller.update('1', dto)).toBe(result);
      expect(service.updateHarvest).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a harvest', async () => {
      const result = {
        id: 1,
        name: 'Terceira parte',
        active: false,
      } as Harvest;
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
