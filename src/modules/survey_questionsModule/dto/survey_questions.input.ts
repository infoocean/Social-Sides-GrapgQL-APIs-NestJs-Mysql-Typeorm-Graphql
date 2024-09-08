import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class RangeInput {
  @Field({ nullable: true })
  min?: number;

  @Field({ nullable: true })
  max?: number;
}
@InputType()
export class addSurveyQuestionsInput {
  @Field()
  @IsOptional()
  survey_id?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  question: string;

  @Field({ nullable: true })
  @IsOptional()
  options?: string;

  @Field({ nullable: true })
  @IsOptional()
  option_type?: string;

  @Field({ nullable: true })
  @IsOptional()
  option_range?: RangeInput;

  @Field({ nullable: true })
  @IsOptional()
  is_primary?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  is_primary_a?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  is_primary_b?: boolean;

  @Field()
  @IsNotEmpty()
  @IsInt()
  created_by: number;
}
