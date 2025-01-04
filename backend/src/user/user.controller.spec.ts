import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findAllUser: jest.fn(),
            viewUser: jest.fn(),
            updateUser: jest.fn(),
            removeUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      code: '9995550053',
    };
    const result = { id: 1, ...createUserDto } as User;
    jest.spyOn(service, 'createUser').mockResolvedValue(result);

    expect(await controller.create(createUserDto)).toBe(result);
    expect(service.createUser).toHaveBeenCalledWith(createUserDto);
  });

  it('should return an array of users', async () => {
    const result: User[] = [
      {
        id: 1,
        name: 'John Doe',
        code: '9999999999',
        farms: [],
        active: false,
        created_on: undefined,
        updated_on: undefined,
        deleted_on: undefined,
      },
    ];
    jest.spyOn(service, 'findAllUser').mockResolvedValue(result);

    expect(await controller.findAll()).toBe(result);
    expect(service.findAllUser).toHaveBeenCalled();
  });

  it('should return a single user', async () => {
    const result = { id: 1, name: 'John Doe' };
    jest.spyOn(service, 'viewUser').mockResolvedValue(result);

    expect(await controller.findOne('1')).toBe(result);
    expect(service.viewUser).toHaveBeenCalledWith(1);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = { name: 'Jane Doe', active: true };
    const result = { id: 1, ...updateUserDto } as User;
    jest.spyOn(service, 'updateUser').mockResolvedValue(result);

    expect(await controller.update('1', updateUserDto)).toBe(result);
    expect(service.updateUser).toHaveBeenCalledWith(1, updateUserDto);
  });

  it('should remove a user', async () => {
    const result = { id: 1, name: 'John Doe', active: false } as User;
    jest.spyOn(service, 'removeUser').mockResolvedValue(result);

    expect(await controller.remove('1')).toBe(result);
    expect(service.removeUser).toHaveBeenCalledWith(1);
  });
});
