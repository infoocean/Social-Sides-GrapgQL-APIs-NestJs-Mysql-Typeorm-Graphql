import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SurveyQuestions } from './schema/survey_questions.schema';
import { SurveyQuestionsService } from './survey_questions.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/middleware/authentication';
import { addSurveyQuestionsInput } from './dto/survey_questions.input';
import { CommonResponse, DataListResponse } from 'src/shared/common.response';
import { updateSurveyQuestionsInput } from './dto/update_survay_question.input';

@Resolver(() => SurveyQuestions)
export class SurveyQuestionsResolver {
  constructor(private surveyQuestionsService: SurveyQuestionsService) {}

  // add survey questions
  @Mutation(() => SurveyQuestions)
  @UseGuards(AuthGuard)
  async addSurveyQuestions(
    @Args('addSurveyQuestionsData')
    addSurveyQuestionsData: addSurveyQuestionsInput,
  ) {
    return this.surveyQuestionsService.addSurveyQuestions(
      addSurveyQuestionsData,
    );
  }

  //get survey questions
  @Query(() => DataListResponse)
  @UseGuards(AuthGuard)
  async getSurveyQuestions(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args({ name: 'limit', type: () => Int, defaultValue: 10 }) limit: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('sortBy', { nullable: true }) sortBy?: string,
    @Args('sortOrder', { nullable: true, defaultValue: 'ASC' })
    sortOrder?: 'ASC' | 'DESC',
    @Args('filterBy', { nullable: true }) filterBy?: string,
    @Args('filterValue', { nullable: true }) filterValue?: string,
  ) {
    return this.surveyQuestionsService.getSurveyQuestions(
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filterBy,
      filterValue,
    );
  }

  //edit survey questions
  @Mutation(() => SurveyQuestions)
  @UseGuards(AuthGuard)
  async updateSurveyQuestions(
    @Args('updateSurveyQuestionsData')
    updateSurveyQuestionsData: updateSurveyQuestionsInput,
  ) {
    return this.surveyQuestionsService.updateSurveyQuestions(
      updateSurveyQuestionsData,
    );
  }

  //get survey questions by id
  @Query(() => SurveyQuestions)
  @UseGuards(AuthGuard)
  async getSurveyQuestionDetailsById(
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.surveyQuestionsService.getSurveyQuestionDetailsById(id);
  }

  //delete survey questions single or bulk delete
  @Query(() => CommonResponse)
  @UseGuards(AuthGuard)
  async deleteSurveyQuestions(
    @Args('ids', { type: () => [Int] }) ids: number[],
  ) {
    return this.surveyQuestionsService.deleteSurveyQuestions(ids);
  }
}
