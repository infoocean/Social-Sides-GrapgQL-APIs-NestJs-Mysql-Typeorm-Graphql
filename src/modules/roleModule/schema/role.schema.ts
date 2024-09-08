import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "src/modules/userModule/schema/user.schema"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"

@Entity({ name: 'user_roles' })
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column({ length: 30 })
  @Field()
  role: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}