import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurveyResolver } from './survey.resolver';
import { SurveyService } from './survey.service';
import { Survey } from './schema/survey.schema';
import { JwtService } from '@nestjs/jwt';
import { SurveyQuestionsModule } from '../survey_questionsModule/survey_questions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Survey]), SurveyQuestionsModule],
  providers: [SurveyResolver, SurveyService, JwtService],
})
export class SurveyModule {}
