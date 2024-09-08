import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SurveyQuestions } from 'src/modules/survey_questionsModule/schema/survey_questions.schema';
import { User } from 'src/modules/userModule/schema/user.schema';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { SurveyStatus } from './surveyStatus';
import { SurveyQuestionAnswers } from 'src/modules/survey_question_answersModule/schema/survey_question_answers.schema';

@ObjectType()
export class Range {
  @Field({ nullable: true })
  min?: number;

  @Field({ nullable: true })
  max?: number;
}

@Entity({ name: 'surveys' })
@ObjectType()
export class Survey {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 255 })
  @Field()
  name: string;

  @Column({ length: 255, default: SurveyStatus?.ACTIVE })
  @Field()
  status: string;

  @Column({ length: 255, nullable: true })
  @Field({ nullable: true })
  image_url: string;

  @Column({ length: 255, nullable: true })
  @Field({ nullable: true })
  video_url: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  created_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.survey)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => SurveyQuestions, (surveyQuestions) => surveyQuestions.survey)
  @Field(() => [SurveyQuestions])
  survey_questions: SurveyQuestions[];

  @OneToMany(
    () => SurveyQuestionAnswers,
    (surveyQuestionAnswers) => surveyQuestionAnswers.survey,
  )
  survey_answer: SurveyQuestionAnswers;
}
