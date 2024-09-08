import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsInt } from 'class-validator';
import { CreateSurveyInput } from './survey.input';
@InputType()
export class updateSurveyInput extends CreateSurveyInput {
  @Field()
  @IsNotEmpty()
  @IsInt()
  id: number;
}
