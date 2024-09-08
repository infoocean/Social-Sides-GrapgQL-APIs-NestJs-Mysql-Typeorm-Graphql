import { InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
} from 'class-validator';

import { FileUpload } from 'graphql-upload';
import { SurveyStatus } from '../schema/surveyStatus';
import { FileOrNullScalar } from './fileUploadType';
import { RangeInput } from 'src/modules/survey_questionsModule/dto/survey_questions.input';

@InputType()
export class SurveyQuestionInput {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  question?: string;

  @Field({ nullable: true })
  options?: string;

  @Field({ nullable: true })
  option_type?: string;

  @Field({ nullable: true })
  option_range?: RangeInput;
}

@InputType()
export class CreateSurveyInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ defaultValue: SurveyStatus.ACTIVE })
  @IsEnum(SurveyStatus, {
    message:
      'Invalid service status. Must be "active", "inactive", or "trash".',
  })
  @IsOptional()
  status?: SurveyStatus;

  @Field(() => FileOrNullScalar, {
    nullable: true,
    description:
      'The image file to upload in filename, mimetype, encoding, createReadStream format, or a URL string.',
  })
  @IsOptional()
  image_url?: FileUpload | null;

  @Field(() => FileOrNullScalar, {
    nullable: true,
    description:
      'The video file to upload in filename, mimetype, encoding, createReadStream format, or a URL string.',
  })
  @IsOptional()
  video_url?: FileUpload | null;

  @Field(() => SurveyQuestionInput!, { nullable: true })
  @IsOptional()
  primary_question?: SurveyQuestionInput;

  @Field(() => [SurveyQuestionInput!]!, { nullable: true })
  @IsOptional()
  option_a_question?: SurveyQuestionInput[];

  @Field(() => [SurveyQuestionInput!]!, { nullable: true })
  @IsOptional()
  option_b_question?: SurveyQuestionInput[];

  @Field(() => [SurveyQuestionInput!]!, { nullable: true })
  @IsOptional()
  survey_questions?: SurveyQuestionInput[];

  @Field()
  @IsNotEmpty()
  @IsInt()
  created_by: number;
}
