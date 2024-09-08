import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RoleInput {
  @Field()
  role: string;
}