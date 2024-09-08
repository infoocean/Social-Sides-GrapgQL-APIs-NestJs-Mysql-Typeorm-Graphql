import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { SurveyQuestions } from './schema/survey_questions.schema';
import { addSurveyQuestionsInput } from './dto/survey_questions.input';
import { updateSurveyQuestionsInput } from './dto/update_survay_question.input';

@Injectable()
export class SurveyQuestionsService {
  constructor(
    @InjectRepository(SurveyQuestions)
    private surveyQuestionRepository: Repository<SurveyQuestions>,
  ) {}

  //add
  async addSurveyQuestions(addSurveyQuestionsData: addSurveyQuestionsInput) {
    try {
      return await this.surveyQuestionRepository.save(addSurveyQuestionsData);
    } catch (error) {
      throw new InternalServerErrorException('Failed to add survey questions');
    }
  }

  //get surveyQuestions
  async getSurveyQuestions(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
    filterBy?: string,
    filterValue?: string,
  ) {
    let query =
      this.surveyQuestionRepository.createQueryBuilder('survey_questions');
    if (search) {
      query.where('survey_questions.name LIKE :search', {
        search: `%${search}%`,
      });
    }
    if (sortBy && sortOrder) {
      query = query.orderBy(`survey_questions.${sortBy}`, sortOrder);
    }

    if (filterBy && filterValue) {
      query = query.andWhere(`survey_questions.${filterBy} = :filterValue`, {
        filterValue,
      });
    }
    const totalCount = await query.getCount();
    const totalPages = Math.ceil(totalCount / limit);
    const surveyQuestions = await query
      .skip((page - 1) * limit)
      .take(limit)
      .leftJoinAndSelect('survey_questions.survey', 'survey')
      .select([
        'survey_questions.id',
        'survey_questions.question',
        'survey_questions.created_at',
        'survey.name',
      ])
      .getMany();
    return {
      totalCount,
      totalPages,
      currentPage: page,
      data: JSON.stringify(surveyQuestions),
    };
  }

  //edit
  async updateSurveyQuestions(
    updateSurveyQuestions: updateSurveyQuestionsInput,
  ) {
    try {
      const SurveyQuestionsToUpdate =
        await this.surveyQuestionRepository.findOne({
          where: { id: updateSurveyQuestions?.id },
        });
      Object.assign(SurveyQuestionsToUpdate, updateSurveyQuestions);
      await this.surveyQuestionRepository.save(SurveyQuestionsToUpdate);
      return SurveyQuestionsToUpdate;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update survey question',
      );
    }
  }

  //get survey questions details
  async getSurveyQuestionDetailsById(id: number) {
    return await this.surveyQuestionRepository.findOne({ where: { id } });
  }

  //delete survey questions
  async deleteSurveyQuestions(ids: number[]) {
    try {
      const surveyQuestionsToDelete = await this.surveyQuestionRepository.find({
        where: {
          id: In(ids),
        },
      });
      await this.surveyQuestionRepository.remove(surveyQuestionsToDelete);
      return {
        success: true,
        message: 'Survey questions deleted successfully',
        status: 202,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete survey questions',
      );
    }
  }
}
