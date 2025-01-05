import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      createUserDto.code = createUserDto.code.replace(/[^0-9]/g, '');
      return await this.userRepository.save(createUserDto);
    } catch (error) {
      const message = error?.message ? error.message : 'Error on create user';
      this.logger.error(`[createUser]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function is used to get all the user's list
   * @returns promise of array of users
   */
  async findAllUser(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      const message = error?.message ? error.message : 'Error on get all users';
      this.logger.error(`[findAllUser]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function used to get data of use whose id is passed in parameter
   * @param id is type of number, which represent the id of user.
   * @returns promise of user
   */
  async viewUser(id: number): Promise<User | {}> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id },
        relations: ['farms'],
      });

      return user || {};
    } catch (error) {
      const message = error?.message
        ? error.message
        : 'Error on get user by id';
      this.logger.error(`[viewUser]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function is used to updated specific user whose id is passed in
   * parameter along with passed updated data
   * @param id is type of number, which represent the id of user.
   * @param updateUserDto this is partial type of createUserDto.
   * @returns promise of udpate user
   */
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const userFound = await this.userRepository.findOneBy({ id });

      if (!userFound) {
        throw new NotFoundException(`Could not find user with id: ${id}`);
      }
      const user: User = new User();
      user.name = updateUserDto.name;
      user.id = id;
      return this.userRepository.save(user);
    } catch (error) {
      const message = error?.message ? error.message : 'Error on update user';
      this.logger.error(`[updateUser]: ${message}`);
      throw new NotFoundException(message);
    }
  }

  /**
   * this function is used to remove or delete user from database.
   * @param id is the type of number, which represent id of user
   * @returns nuber of rows deleted or affected
   */
  async removeUser(id: number): Promise<User> {
    try {
      const userFound = await this.userRepository.findOneBy({ id });

      if (!userFound) {
        throw new NotFoundException(`Could not find user with id: ${id}`);
      }

      userFound.active = false;
      userFound.deleted_on = new Date();
      return this.userRepository.save(userFound);
    } catch (error) {
      const message = error?.message ? error.message : 'Error on delete user';
      this.logger.error(`[removeUser]: ${message}`);
      throw new NotFoundException(message);
    }
  }
}
