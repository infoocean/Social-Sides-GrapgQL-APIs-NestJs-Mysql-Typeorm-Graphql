import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './schema/user.schema';
import { UserInput } from './dto/user.input';
import configuration from 'config/configuration';
import * as jwt from 'jsonwebtoken';
import { UpdateUserInput } from './dto/user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  //get all Users
  async getUsers(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortBy: string = 'created_at',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    filterByRole?: string,
    status?: string,
  ) {
    let query = this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.role', 'role');

    // Search functionality
    if (search) {
      query.where(
        'users.first_name LIKE :search OR users.last_name LIKE :search OR users.email LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    // Filter by role
    if (filterByRole) {
      query.andWhere('role.role = :filterByRole', { filterByRole });
    }

    // Sort by status
    if (status) {
      query.andWhere('users.status = :status', { status });
    }

    // Sorting
    if (sortBy && sortOrder) {
      query = query.orderBy(`users.${sortBy}`, sortOrder);
    } else {
      query = query.orderBy('users.created_at', 'DESC');
    }

    // Pagination
    const totalCount = await query.getCount();
    const totalPages = Math.ceil(totalCount / limit);
    const users = await query
      .skip((page - 1) * limit)
      .take(limit)
      .select([
        'users.id',
        'users.first_name',
        'users.last_name',
        'users.email',
        'users.created_at',
        'users.status',
        'role.role',
      ])
      .getMany();

    return {
      totalCount,
      totalPages,
      currentPage: page,
      data: JSON.stringify(users),
    };
  }

  //find user by email
  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  //find user by id
  async findById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
  }

  //update user status
  async updateUserStatus(id: number, status: string) {
    const userToUpdate = await this.userRepository.findOne({
      where: { id },
    });
    userToUpdate.status = status;
    return await this.userRepository.save(userToUpdate);
  }

  //find login with social media account
  async userLoginWithSocialmedia(userInput: UserInput) {
    try {
      const user = await this.findByEmail(userInput?.email);
      if (user) {
        if (user.login_with === userInput?.login_with) {
          return {
            success: true,
            message:
              'login successfully. This is your login token, which you can use to access your account.',
            status: HttpStatus.OK,
            token: this.generateAccessToken(user),
            token_type: 'x-access-token',
            login_with: user?.login_with,
          };
        } else {
          return {
            success: true,
            message: `You are allready registerd(login) in our platform using ${user?.login_with}. can you please try to login with ${user?.login_with} to access your account.`,
            status: HttpStatus.BAD_REQUEST,
          };
        }
      } else {
        const result = await this.userRepository.save(userInput);
        return {
          success: true,
          message:
            'You have successfully logged in. This is your login token, which you can use to access your account.',
          status: HttpStatus.OK,
          token: this.generateAccessToken(result),
          token_type: 'x-access-token',
          login_with: result?.login_with,
        };
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  private generateAccessToken(user: User) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        role_id: user.role_id,
      },
      configuration().jwtSecret,
      {
        expiresIn: configuration().jwtExpiration,
      },
    );
  }

  //update user
  async updateUser(updateUserData: UpdateUserInput) {
    try {
      const userToUpdate = await this.findById(updateUserData?.id);
      Object.assign(userToUpdate, updateUserData);
      await this.userRepository.save(userToUpdate);
      return userToUpdate;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  //delete user
  async deleteUser(id: number) {
    const userTodelete = await this.findById(id);
    userTodelete.is_deleted = 1;
    await this.userRepository.save(userTodelete);
    return {
      success: true,
      message: 'User deleted sucessfully.',
      status: HttpStatus.ACCEPTED,
    };
  }

  //change password
  async changePassword(user) {
    const userToUpdate = await this.findById(user?.id);
    Object.assign(userToUpdate, user);
    await this.userRepository.save(userToUpdate);
  }
}
