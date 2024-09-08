import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyQuestionsResolver } from './survey_questions.resolver';
import { SurveyQuestionsService } from './survey_questions.service';
import { SurveyQuestions } from './schema/survey_questions.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([SurveyQuestions])],
  providers: [SurveyQuestionsResolver, SurveyQuestionsService, JwtService],
  exports: [SurveyQuestionsService],
})
export class SurveyQuestionsModule {}
