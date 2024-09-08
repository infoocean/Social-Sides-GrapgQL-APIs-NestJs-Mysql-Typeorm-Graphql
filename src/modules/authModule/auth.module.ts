import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UserModule } from '../userModule/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule],
  providers: [AuthResolver, AuthService, JwtService],
  exports: [JwtService],
})
export class AuthModule {}
