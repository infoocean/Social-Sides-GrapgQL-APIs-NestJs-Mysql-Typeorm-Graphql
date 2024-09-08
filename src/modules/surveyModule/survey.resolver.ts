import { Resolver, Mutation, Args, Query, Context, Int } from '@nestjs/graphql';
import { Survey } from './schema/survey.schema';
import { SurveyService } from './survey.service';
import { CreateSurveyInput } from './dto/survey.input';
import { AuthGuard } from 'src/middleware/authentication';
import { UseGuards } from '@nestjs/common';
import { CommonResponse, DataListResponse } from 'src/shared/common.response';
import { updateSurveyInput } from './dto/update_survey.input';

@Resolver(() => Survey)
export class SurveyResolver {
  constructor(private surveyService: SurveyService) {}

  // create survey
  @Mutation(() => Survey)
  @UseGuards(AuthGuard)
  async createSurvey(
    @Args('createSurveyData') createSurveyData: CreateSurveyInput,
  ) {
    return this.surveyService.createSurvey(createSurveyData);
  }

  //get surveys list
  @Query(() => DataListResponse)
  @UseGuards(AuthGuard)
  async getSurveys(
    @Context() context: any,
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args({ name: 'limit', type: () => Int, defaultValue: 10 }) limit: number,
    @Args('search', { nullable: true }) search?: string,
    @Args('sortBy', { nullable: true }) sortBy?: string,
    @Args('sortOrder', { nullable: true, defaultValue: 'ASC' })
    sortOrder?: 'ASC' | 'DESC',
    @Args('filterBy', { nullable: true }) filterBy?: string,
    @Args('filterValue', { nullable: true }) filterValue?: string,
  ) {
    const current_user = context.req.user;
    return this.surveyService.getSurveys(
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      filterBy,
      filterValue,
      current_user,
    );
  }

  //edit survey details
  @Mutation(() => Survey)
  @UseGuards(AuthGuard)
  async updateSurvey(
    @Args('updateSurveyData') updateSurveyData: updateSurveyInput,
  ) {
    return this.surveyService.updateSurvey(updateSurveyData);
  }

  //get survey details by id
  @Query(() => String)
  @UseGuards(AuthGuard)
  async getSurveyDetailsById(@Args('id', { type: () => Int }) id: number) {
    return this.surveyService.getSurveyDetailsById(id);
  }

  //Trash survey
  @Query(() => Survey)
  @UseGuards(AuthGuard)
  async trashSurvey(
    @Args('id', { type: () => Int }) id: number,
    @Args('status', { type: () => String }) status: string,
  ) {
    return this.surveyService.trashSurvey(id, status);
  }

  //Delete survey prrmanently deleted survey
  @Query(() => CommonResponse)
  @UseGuards(AuthGuard)
  async deleteSurvey(@Args('id', { type: () => Int }) id: number) {
    return this.surveyService.deleteSurvey(id);
  }

  //get status count of survey
  @Query(() => String)
  @UseGuards(AuthGuard)
  async getSurveyStatusCount(
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    return this.surveyService.getSurveyStatusCount(search);
  }
}
