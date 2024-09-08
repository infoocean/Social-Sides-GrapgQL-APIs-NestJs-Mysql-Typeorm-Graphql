import { Optional } from '@nestjs/common';
import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { UserStatusType } from '../schema/user_statusType';
import { SocialMediaType } from './socialmediaType';

@InputType()
export class UserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  @Optional()
  password: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  role_id: number;

  @Field(() => String, { defaultValue: UserStatusType?.ACTIVE })
  status?: string;

  @Field()
  @IsEnum(SocialMediaType, {
    message: 'Invalid type. Must be "google" or "apple".',
  })
  login_with: SocialMediaType;
}

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @Optional()
  first_name?: string;

  @Field({ nullable: true })
  @Optional()
  last_name?: string;

  @Field({ nullable: true })
  @Optional()
  email?: string;
}
