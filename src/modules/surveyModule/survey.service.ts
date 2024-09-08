import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './schema/survey.schema';
import { CreateSurveyInput } from './dto/survey.input';
import { saveFile } from 'src/shared/savefile';
import { SurveyQuestionsService } from '../survey_questionsModule/survey_questions.service';
import { CurrentUserData } from 'src/shared/currentuserdata';
import { updateSurveyInput } from './dto/update_survey.input';
import { deleteFileAsync } from 'src/shared/removeFile';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
    private surveyQuestionsService: SurveyQuestionsService,
  ) {}

  // create new survey
  async createSurvey(surveyData: CreateSurveyInput) {
    try {
      const survey = await this.surveyRepository.findOne({
        where: { name: surveyData.name },
      });
      if (survey) {
        return new BadRequestException('survey name already exist');
      }
      // save file paths
      let imagePath: string | undefined;
      let videoPath: string | undefined;
      // save image
      if (surveyData.image_url !== undefined) {
        const { createReadStream: imageReadStream, filename: imageFilename } =
          await surveyData.image_url;
        imagePath = await saveFile(imageReadStream, imageFilename);
      }
      // save video
      if (surveyData.video_url !== undefined) {
        const { createReadStream: videoReadStream, filename: videoFilename } =
          await surveyData.video_url;
        videoPath = await saveFile(videoReadStream, videoFilename);
      }
      // save survey
      const newSurvey = this.surveyRepository.create({
        ...surveyData,
        image_url: imagePath,
        video_url: videoPath,
      });
      const result: any = await this.surveyRepository.save(newSurvey);
      //save primary question
      if (surveyData.primary_question) {
        await this.surveyQuestionsService.addSurveyQuestions({
          survey_id: result?.id,
          question: surveyData.primary_question?.question,
          options: surveyData?.primary_question?.options,
          option_type: surveyData?.primary_question?.option_type,
          option_range:
            surveyData?.primary_question?.option_range ??
            surveyData?.primary_question?.option_range,
          is_primary: true,
          created_by: surveyData?.created_by,
        });
      }
      //save primary a question
      if (surveyData.option_a_question.length > 0) {
        for (const item of surveyData.option_a_question) {
          await this.surveyQuestionsService.addSurveyQuestions({
            survey_id: result?.id,
            question: item?.question,
            options: item?.options,
            option_type: item?.option_type,
            option_range: item?.option_range ?? item?.option_range,
            created_by: result?.created_by,
            is_primary_a: true,
          });
        }
      }
      //save survey b question
      if (surveyData.option_b_question.length > 0) {
        for (const item of surveyData.option_b_question) {
          await this.surveyQuestionsService.addSurveyQuestions({
            survey_id: result?.id,
            question: item?.question,
            options: item?.options,
            option_type: item?.option_type,
            option_range: item?.option_range ?? item?.option_range,
            created_by: result?.created_by,
            is_primary_b: true,
          });
        }
      }
      //add survey question
      if (surveyData?.survey_questions?.length > 0) {
        for (const item of surveyData?.survey_questions) {
          await this.surveyQuestionsService.addSurveyQuestions({
            survey_id: result?.id,
            question: item?.question,
            options: item?.options,
            option_type: item?.option_type,
            option_range: item?.option_range ?? item?.option_range,
            created_by: result?.created_by,
          });
        }
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add survey');
    }
  }

  //get all survey
  async getSurveys(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
    filterBy?: string,
    filterValue?: string,
    current_user?: CurrentUserData,
  ) {
    const queryBuilder = this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.survey_questions', 'survey_questions')
      .loadRelationCountAndMap(
        'survey.questionCount',
        'survey.survey_questions',
      )
      .where(current_user?.role_id === 1 ? '1=1' : 'survey.status = :status', {
        status: current_user?.role_id === 1 ? undefined : 'active',
      });

    if (search) {
      queryBuilder.andWhere('survey.name LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (sortBy && sortOrder) {
      queryBuilder.orderBy(`survey.${sortBy}`, sortOrder);
    }

    if (filterBy && filterValue) {
      queryBuilder.andWhere(`survey.${filterBy} = :filterValue`, {
        filterValue,
      });
    }

    const [surveys, totalCount] = await Promise.all([
      queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .getMany(),
      queryBuilder.getCount(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const result = surveys.map(({ survey_questions, ...rest }) => ({
      ...rest,
      questionCount: survey_questions.length,
    }));

    return {
      totalCount,
      totalPages,
      currentPage: page,
      data: JSON.stringify(result),
    };
  }

  //edit survey details
  async updateSurvey(updateSurveyData: updateSurveyInput) {
    try {
      // find survey to update
      const surveyToUpdate = await this.surveyRepository.findOne({
        where: { id: updateSurveyData.id },
      });

      if (!surveyToUpdate) {
        throw new BadRequestException('Survey not found');
      }
      // save file paths
      let imagePath: string | undefined;
      let videoPath: string | undefined;
      // save image
      if (updateSurveyData.image_url !== undefined) {
        const { createReadStream: imageReadStream, filename: imageFilename } =
          await updateSurveyData.image_url;
        imagePath = await saveFile(imageReadStream, imageFilename);
        //remove existing service image from folder
        if (surveyToUpdate?.image_url) {
          await deleteFileAsync(surveyToUpdate?.image_url);
        }
      }
      // save video
      if (updateSurveyData.video_url !== undefined) {
        const { createReadStream: videoReadStream, filename: videoFilename } =
          await updateSurveyData.video_url;
        videoPath = await saveFile(videoReadStream, videoFilename);
        if (surveyToUpdate?.video_url) {
          await deleteFileAsync(surveyToUpdate?.video_url);
        }
      }
      // update survey data
      Object.assign(surveyToUpdate, updateSurveyData);
      surveyToUpdate.image_url = imagePath ?? surveyToUpdate.image_url;
      surveyToUpdate.video_url = videoPath ?? surveyToUpdate.video_url;
      // save updated survey
      const result: any = await this.surveyRepository.save(surveyToUpdate);
      //save primary question
      if (updateSurveyData.primary_question) {
        await this.surveyQuestionsService.updateSurveyQuestions({
          id: updateSurveyData?.primary_question?.id,
          question: updateSurveyData.primary_question?.question,
          options: updateSurveyData?.primary_question?.options,
          option_type: updateSurveyData?.primary_question?.option_type,
          option_range: updateSurveyData?.primary_question?.option_range,
          is_primary: true,
          created_by: updateSurveyData?.created_by,
        });
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'An internal server error occurred',
        error.message,
      );
    }
  }

  //get survey details
  async getSurveyDetailsById(id: number) {
    const survey = await this.surveyRepository
      .createQueryBuilder('survey')
      .leftJoinAndSelect('survey.survey_questions', 'survey_questions')
      .where('survey.id = :surveyId', { surveyId: id })
      .getOne();
    return JSON.stringify(survey);
  }

  //Trash survey
  async trashSurvey(id: number, status: string) {
    const surveyToTrash = await this.surveyRepository.findOne({
      where: { id },
    });
    surveyToTrash.status = status;
    return await this.surveyRepository.save(surveyToTrash);
  }

  //delete survey questions
  async deleteSurvey(id: number) {
    try {
      const surveyToDelete = await this.surveyRepository.findOne({
        where: { id },
      });
      await this.surveyRepository.remove(surveyToDelete);
      return {
        success: true,
        message: 'Survey deleted successfully',
        status: 202,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete survey questions',
      );
    }
  }

  // get survey status count
  async getSurveyStatusCount(search?: string) {
    const query = this.surveyRepository
      .createQueryBuilder('survey')
      .select('survey.status')
      .addSelect('COUNT(survey.id)', 'count')
      .groupBy('survey.status');

    if (search) {
      query.where('survey.name LIKE :search', { search: `%${search}%` });
    }

    const counts = await query.getRawMany();

    // Calculate total count
    const totalCount = counts.reduce(
      (sum, item) => sum + parseInt(item.count, 10),
      0,
    );

    // Add total count to the result
    const result = {
      counts: counts,
      totalCount: totalCount,
    };

    return JSON.stringify(result);
  }
}
