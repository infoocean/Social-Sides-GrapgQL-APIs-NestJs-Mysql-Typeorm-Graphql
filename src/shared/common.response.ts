import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommonResponse {
  @Field()
  message: string;

  @Field()
  status: number;

  @Field()
  success: boolean;

  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  token_type?: string;

  @Field({ nullable: true })
  login_with?: string;
}

@ObjectType()
export class DataListResponse {
  @Field()
  totalCount: number;

  @Field()
  totalPages: number;

  @Field()
  currentPage: number;

  @Field({ nullable: true })
  data?: string;
}
