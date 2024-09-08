import { Resolver, Mutation, Args, Int, Query } from '@nestjs/graphql';
import { AuthGuard } from 'src/middleware/authentication';
import { UseGuards } from '@nestjs/common';
import { SurveyQuestionAnswersService } from './survey_question_answers.service';
import { SurveyQuestionAnswerInput } from './dto/survey_question_answer_input';
import { SurveyQuestionAnswers } from './schema/survey_question_answers.schema';

@Resolver(() => SurveyQuestionAnswers)
export class SurveyQuestionAnswersResolver {
  constructor(
    private surveyQuestionAnswersService: SurveyQuestionAnswersService,
  ) {}

  //save survey question answers
  @Mutation(() => SurveyQuestionAnswers)
  @UseGuards(AuthGuard)
  async saveSurveyQuestionAnswer(
    @Args('surveyQuestionAnswerData')
    saveSurveyQuestionAnswerData: SurveyQuestionAnswerInput,
  ) {
    return this.surveyQuestionAnswersService.saveSurveyQuestionAnswer(
      saveSurveyQuestionAnswerData,
    );
  }

  //get survey question answers details by id
  @Query(() => SurveyQuestionAnswers)
  @UseGuards(AuthGuard)
  async getSurveyQuestionAnswerDetailsById(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.surveyQuestionAnswersService.getSurveyQuestionAnswerDetails(id);
  }
}
