import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './schema/user.schema';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserResolver, UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
