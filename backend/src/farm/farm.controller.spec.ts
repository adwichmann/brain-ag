import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { FarmService } from './farm.service';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { User } from '../user/entities/user.entity';
import { Farm } from './entities/farm.entity';

describe('FarmController', () => {
  let controller: FarmController;
  let service: FarmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: FarmService,
          useValue: {
            createFarm: jest.fn().mockResolvedValue({}),
            findAllFarms: jest.fn().mockResolvedValue([]),
            viewFarm: jest.fn().mockResolvedValue({}),
            updateFarm: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    service = module.get<FarmService>(FarmService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a farm', async () => {
    const createFarmDto: CreateFarmDto = {
      name: 'Fazenda Teste',
      city: 'Goiânia',
      state: 'Goiás',
      total_area: 55,
      arable_area: 10.5,
      vegetation_area: 12.9,
      user: new User(),
      harvests: [],
    };
    await controller.createFarm(createFarmDto);
    expect(service.createFarm).toHaveBeenCalledWith(createFarmDto);
  });

  it('should return all farms', async () => {
    const result: Farm[] = [
      {
        id: 1,
        name: 'Fazenda Teste',
        city: 'Goiânia',
        state: 'Goiás',
        total_area: 55,
        arable_area: 10.5,
        vegetation_area: 12.9,
        user: new User(),
        harvests: [],
        active: true,
        created_on: undefined,
        updated_on: undefined,
        deleted_on: undefined,
      },
    ];
    jest.spyOn(service, 'findAllFarms').mockResolvedValue(result);

    expect(await controller.findAllFarms()).toBe(result);
    expect(service.findAllFarms).toHaveBeenCalled();
  });

  it('should return a single farm', async () => {
    const result = { id: 1, name: 'Fazenda Teste' };

    jest.spyOn(service, 'viewFarm').mockResolvedValue(result);

    expect(await controller.viewFarm('1')).toBe(result);
    expect(service.viewFarm).toHaveBeenCalledWith(1);
  });

  it('should update a farm', async () => {
    const dto: UpdateFarmDto = {
      id: 1,
      name: 'Fazenda Teste',
      active: true,
      harvests: [],
      crops: [],
    };
    const result = {
      ...dto,
    };
    jest.spyOn(service, 'updateFarm').mockResolvedValue(result);

    expect(await controller.updateFarm('1', dto)).toBe(result);
    expect(service.updateFarm).toHaveBeenCalledWith(1, dto);
  });

  it('should remove a farm', async () => {
    const result = {
      id: 1,
      name: 'Fazenda Teste',
      active: false,
    } as Farm;
    jest.spyOn(service, 'remove').mockResolvedValue(result);

    expect(await controller.remove('1')).toBe(result);
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
