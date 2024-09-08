import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';
import { addSurveyQuestionsInput } from './survey_questions.input';

@InputType()
export class updateSurveyQuestionsInput extends addSurveyQuestionsInput {
  @Field()
  @IsNotEmpty()
  @IsInt()
  id: number;
}
