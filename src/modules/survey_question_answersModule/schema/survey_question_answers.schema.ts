import { Field, Int, ObjectType } from '@nestjs/graphql';
import { SurveyQuestions } from 'src/modules/survey_questionsModule/schema/survey_questions.schema';
import { Survey } from 'src/modules/surveyModule/schema/survey.schema';
// import { Survey } from 'src/modules/surveyModule/schema/survey.schema';
import { User } from 'src/modules/userModule/schema/user.schema';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'suery_question_answers' })
@ObjectType()
export class SurveyQuestionAnswers {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field(() => Int)
  user_id: number;

  @Column()
  @Field(() => Int)
  survey_id: number;

  @Column()
  @Field(() => Int)
  question_id: number;

  @Column({ length: 255, nullable: true })
  @Field({ nullable: true })
  answer: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.survey_question_answers)
  @JoinColumn({ name: 'user_id' })
  @Field(() => User)
  user: User;

  @ManyToOne(
    () => SurveyQuestions,
    (surveyQuestions) => surveyQuestions.question_answer,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'question_id' })
  @Field(() => SurveyQuestions)
  survey_question: SurveyQuestions;

  @ManyToOne(() => Survey, (survey) => survey.survey_answer)
  @JoinColumn({ name: 'survey_id' })
  @Field(() => Survey)
  survey: Survey;
}
