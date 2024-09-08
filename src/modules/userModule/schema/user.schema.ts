import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/modules/roleModule/schema/role.schema';
import { Survey } from 'src/modules/surveyModule/schema/survey.schema';
import { SurveyQuestions } from 'src/modules/survey_questionsModule/schema/survey_questions.schema';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { UserStatusType } from './user_statusType';
import { SurveyQuestionAnswers } from 'src/modules/survey_question_answersModule/schema/survey_question_answers.schema';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 50 })
  @Field()
  first_name: string;

  @Column({ length: 50 })
  @Field()
  last_name: string;

  @Column({ length: 50, unique: true })
  @Field()
  email: string;

  @Column({ length: 255, nullable: true })
  @Field()
  password: string;

  @Column({ length: 150, default: UserStatusType?.ACTIVE })
  @Field()
  status: string;

  @Column()
  @Field(() => Int)
  role_id: number;

  @Column({ default: 0 })
  @Field(() => Int)
  is_deleted: number;

  @Column({ length: 100 })
  @Field()
  login_with: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Field()
  created_at: Date;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  @Field(() => Role)
  role: Role;

  @OneToMany(() => Survey, (survey) => survey.createdBy)
  survey: Survey[];

  @OneToMany(() => SurveyQuestions, (survey_questions) => survey_questions.user)
  survey_questions: SurveyQuestions[];

  @OneToMany(
    () => SurveyQuestionAnswers,
    (surveyQuestionAnswers) => surveyQuestionAnswers.user,
  )
  survey_question_answers: SurveyQuestionAnswers;
}
