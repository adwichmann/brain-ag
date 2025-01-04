import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockUserRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
});

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User),
    ) as jest.Mocked<Repository<User>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const createUserDto = { code: '123abc' } as any;
      const savedUser = { id: 1, code: '123' } as User;

      (userRepository.save as jest.Mock).mockResolvedValue(savedUser);

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(savedUser);
      expect(userRepository.save).toHaveBeenCalledWith({ code: '123' });
    });

    it('should throw a NotFoundException', async () => {
      const createUserDto = { code: '123abc' } as any;

      userRepository.save.mockRejectedValue(new Error('Error on create user'));

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllUser', () => {
    it('should return an array of users', async () => {
      const users = [{ id: 1 }, { id: 2 }] as User[];

      userRepository.find.mockResolvedValue(users);

      const result = await service.findAllUser();
      expect(result).toEqual(users);
      expect(userRepository.find).toHaveBeenCalled();
    });

    it('should throw a NotFoundException', async () => {
      userRepository.find.mockRejectedValue(
        new Error('Error on get all users'),
      );

      await expect(service.findAllUser()).rejects.toThrow(NotFoundException);
    });
  });

  describe('viewUser', () => {
    it('should return a user', async () => {
      const user = { id: 1 } as User;

      userRepository.findOne.mockResolvedValue(user);

      const result = await service.viewUser(1);
      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['farms'],
      });
    });

    it('should return an empty object if user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.viewUser(1);
      expect(result).toEqual({});
    });

    it('should throw a NotFoundException', async () => {
      userRepository.findOne.mockRejectedValue(
        new Error('Error on get user by id'),
      );

      await expect(service.viewUser(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const updateUserDto = { name: 'Updated Name' } as any;
      const user = { id: 1, name: 'Updated Name' } as User;

      userRepository.findOneBy.mockResolvedValue(user);
      userRepository.save.mockResolvedValue(user);

      const result = await service.updateUser(1, updateUserDto);
      expect(result).toEqual(user);
      expect(userRepository.save).toHaveBeenCalledWith({
        id: 1,
        name: 'Updated Name',
      });
    });

    it('should throw a NotFoundException if user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.updateUser(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a NotFoundException on error', async () => {
      userRepository.findOneBy.mockRejectedValue(
        new Error('Error on update user'),
      );

      await expect(service.updateUser(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeUser', () => {
    it('should remove a user', async () => {
      const user = { id: 1, active: true, deleted_on: null } as User;

      userRepository.findOneBy.mockResolvedValue(user);
      userRepository.save.mockResolvedValue(user);

      const result = await service.removeUser(1);
      expect(result).toEqual(user);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...user,
        active: false,
        deleted_on: expect.any(Date),
      });
    });

    it('should throw a NotFoundException if user not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.removeUser(1)).rejects.toThrow(NotFoundException);
    });

    it('should throw a NotFoundException on error', async () => {
      userRepository.findOneBy.mockRejectedValue(
        new Error('Error on delete user'),
      );

      await expect(service.removeUser(1)).rejects.toThrow(NotFoundException);
    });
  });
});
