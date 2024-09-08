import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SurveyQuestionAnswers } from 'src/modules/survey_question_answersModule/schema/survey_question_answers.schema';
import { Range, Survey } from 'src/modules/surveyModule/schema/survey.schema';
import { User } from 'src/modules/userModule/schema/user.schema';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'survey_questions' })
@ObjectType()
export class SurveyQuestions {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ default: 0 })
  @Field(() => Int)
  survey_id: number;

  @Column({ length: 255 })
  @Field()
  question: string;

  @Column({ length: 255, nullable: true })
  @Field({ nullable: true })
  options: string;

  @Column({ length: 255, nullable: true })
  @Field({ nullable: true })
  option_type: string;

  @Column('json', { nullable: true })
  @Field(() => Range, { nullable: true })
  option_range: Range;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean, { nullable: true })
  is_primary: boolean;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean, { nullable: true })
  is_primary_a: boolean;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean, { nullable: true })
  is_primary_b: boolean;

  @Column({ type: 'int' })
  @Field(() => Int)
  created_by: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  created_at: Date;

  @ManyToOne(() => Survey, (survey) => survey.survey_questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'survey_id' })
  @Field(() => Survey, { nullable: true })
  survey: Survey;

  @ManyToOne(() => User, (user) => user.survey_questions)
  @JoinColumn({ name: 'created_by' })
  user: User;

  @OneToMany(
    () => SurveyQuestionAnswers,
    (surveyQuestionAnswers) => surveyQuestionAnswers.survey_question,
  )
  question_answer: SurveyQuestionAnswers;
}
