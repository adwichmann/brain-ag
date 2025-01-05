import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Create user',
    description: 'Endpoint to create user on database',
  })
  @ApiResponse({ status: 201, description: 'User created.' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * Retrieves all users.
   * @returns An array of users.
   */
  @ApiOperation({
    summary: 'Find all users',
    description: 'Find all active users',
  })
  @ApiResponse({ status: 200, description: 'List os users.', isArray: true })
  @Get()
  findAll() {
    return this.userService.findAllUser();
  }

  /**
   * Retrieves a user by ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user with the specified ID.
   */
  @ApiOperation({
    summary: 'Find user by ID',
    description: 'Find user by ID',
  })
  @ApiResponse({ status: 200, description: 'The user found by ID.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the user to be found',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.viewUser(+id);
  }

  /**
   * Updates a user by ID.
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data transfer object containing user update details.
   * @returns The updated user.
   */
  @ApiOperation({
    summary: 'Update user',
    description: 'Update existing user by ID',
  })
  @ApiResponse({ status: 201, description: 'User updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the user to be updated',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   * @returns A confirmation message.
   */
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete existing user by ID',
  })
  @ApiResponse({ status: 201, description: 'User inactive.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'The ID of the user to be deleted',
    schema: { oneOf: [{ type: 'string' }, { type: 'integer' }] },
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }
}
