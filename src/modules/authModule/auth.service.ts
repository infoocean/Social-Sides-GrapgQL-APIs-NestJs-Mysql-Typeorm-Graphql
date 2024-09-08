import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { UserService } from '../userModule/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import configuration from 'config/configuration';
import { ChangePasswordInput } from './dto/change_password.input';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  //login Admin
  async login(userLoginInput: LoginInput) {
    const user = await this.userService.findByEmail(userLoginInput.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(
      userLoginInput.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const accessToken = jwt.sign(
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
    return {
      success: true,
      message:
        'Login successfully, this is your login token you can use this to access APIs',
      status: HttpStatus.OK,
      token: accessToken,
      token_type: 'x-access-token',
    };
  }

  //get user details by token
  async getUserDetailsByToken(login_token: string) {
    const result: any = JSON.stringify(this.jwtService.decode(login_token));
    const res: any = await this.userService.findById(result?.id);
    const user = {
      id: res?.id,
      name: res.first_name + ' ' + res.last_name,
      email: res?.email,
      role_id: res?.role_id,
    };
    return JSON.stringify(user);
  }

  //change password
  async changepassword(ChangePasswordInput: ChangePasswordInput) {
    const user = await this.userService.findByEmail(ChangePasswordInput?.email);
    if (
      !(await bcrypt.compare(ChangePasswordInput?.old_password, user.password))
    ) {
      throw new UnauthorizedException('Invalid old password');
    }
    const newpassHash = await bcrypt.hash(ChangePasswordInput?.password, 12);
    user.password = newpassHash;
    await this.userService.changePassword(user);
    return {
      success: true,
      message: 'Password changed successfully',
      status: 200,
    };
  }
}
