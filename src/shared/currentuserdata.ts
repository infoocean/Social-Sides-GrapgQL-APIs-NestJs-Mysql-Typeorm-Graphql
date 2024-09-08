import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CurrentUserData {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  first_name: string;

  @Field()
  role_id: number;
}
