import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { CommonResponse, DataListResponse } from 'src/shared/common.response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/middleware/authentication';
import { UpdateUserInput, UserInput } from './dto/user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => DataListResponse)
  @UseGuards(AuthGuard)
  async getUsers(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args({ name: 'limit', type: () => Int, defaultValue: 10 }) limit: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('sortBy', { nullable: true }) sortBy?: string,
    @Args('sortOrder', { nullable: true, defaultValue: 'DESC' })
    sortOrder?: 'ASC' | 'DESC',
    @Args('filterByRole', { nullable: true }) filterByRole?: string,
    @Args('status', { nullable: true }) status?: string,
  ) {
    return this.userService.getUsers(
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filterByRole,
      status,
    );
  }

  //get user details by id
  @Query(() => User)
  @UseGuards(AuthGuard)
  async getUserById(@Args('id', { type: () => Int }) id: number) {
    return this.userService.findById(id);
  }

  //get user details by email
  @Query(() => User)
  @UseGuards(AuthGuard)
  async getUserByEmail(@Args('email', { type: () => String }) email: string) {
    return this.userService.findByEmail(email);
  }

  //user login with social media platform
  @Mutation(() => CommonResponse)
  @UseGuards(AuthGuard)
  async userLoginWithSocialmedia(@Args('userInput') userInput: UserInput) {
    return this.userService.userLoginWithSocialmedia(userInput);
  }

  //update user status
  @Query(() => User)
  @UseGuards(AuthGuard)
  async updateUserStatus(
    @Args('id', { type: () => Int }) id: number,
    @Args('status', { type: () => String }) status: string,
  ) {
    return this.userService.updateUserStatus(id, status);
  }

  //update  user
  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUser(@Args('updateUserData') updateUserData: UpdateUserInput) {
    return this.userService.updateUser(updateUserData);
  }

  //delete user
  @Query(() => CommonResponse)
  @UseGuards(AuthGuard)
  async deleteUser(@Args('id', { type: () => Int }) id: number) {
    return this.userService.deleteUser(id);
  }
}
