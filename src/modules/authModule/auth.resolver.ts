import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { CommonResponse } from 'src/shared/common.response';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/middleware/authentication';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ChangePasswordInput } from './dto/change_password.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}
  //user login
  @Mutation(() => CommonResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<CommonResponse> {
    return this.authService.login(loginInput);
  }

  //get user details by token
  @Query(() => String)
  @UseGuards(AuthGuard)
  async getUserDetailsByToken(@Args('login_token') login_token: string) {
    return this.authService.getUserDetailsByToken(login_token);
  }

  //change password
  @Mutation(() => CommonResponse)
  @UseGuards(AuthGuard)
  async changepasssword(
    @Args('changePasswordInput') ChangePasswordInput: ChangePasswordInput,
  ) {
    return this.authService.changepassword(ChangePasswordInput);
  }
}
