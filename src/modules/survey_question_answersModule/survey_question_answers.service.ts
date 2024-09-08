import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurveyQuestionAnswers } from './schema/survey_question_answers.schema';
import { SurveyQuestionAnswerInput } from './dto/survey_question_answer_input';

@Injectable()
export class SurveyQuestionAnswersService {
  constructor(
    @InjectRepository(SurveyQuestionAnswers)
    private surveyQuestionAnswerRepository: Repository<SurveyQuestionAnswers>,
  ) {}

  // save survey question answers
  async saveSurveyQuestionAnswer(
    surveyQuestionAnswer: SurveyQuestionAnswerInput,
  ) {
    try {
      return await this.surveyQuestionAnswerRepository.save(
        surveyQuestionAnswer,
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to add answer');
    }
  }

  //get survey question answers details
  async getSurveyQuestionAnswerDetails(id: number) {
    return await this.surveyQuestionAnswerRepository.findOne({
      where: { id: id },
      relations: ['user', 'survey', 'survey_question'],
    });
  }
}
