import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Role {
  @Field(() => String, { description: 'id of the role' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  userId: string;

  @Field(() => String, { description: 'role name' })
  @Column()
  name: string;

  @Field(() => String, { description: 'role description' })
  @Column({ nullable: true })
  description: string;

  @Field(() => User, { description: 'user' })
  user: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => User, (user) => user.roleConnection)
  @JoinColumn({ name: 'userId' })
  userConnection: Promise<User>;
}
