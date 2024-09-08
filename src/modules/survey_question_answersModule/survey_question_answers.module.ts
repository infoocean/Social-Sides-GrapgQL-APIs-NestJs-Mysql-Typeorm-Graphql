import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyQuestionAnswersResolver } from './survey_question_answers_resolver';
import { SurveyQuestionAnswers } from './schema/survey_question_answers.schema';
import { SurveyQuestionAnswersService } from './survey_question_answers.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyQuestionAnswers])],
  providers: [
    SurveyQuestionAnswersResolver,
    SurveyQuestionAnswersService,
    JwtService,
  ],
})
export class SurveyQuestionAnswersModule {}
