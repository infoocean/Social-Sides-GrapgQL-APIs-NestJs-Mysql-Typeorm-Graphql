import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

@InputType()
export class SurveyQuestionAnswerInput {
  @Field()
  @IsNotEmpty()
  @IsInt()
  user_id: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  survey_id: number;

  @Field()
  @IsNotEmpty()
  @IsInt()
  question_id: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  answer: string;
}
