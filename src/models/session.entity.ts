import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@Entity()
@ObjectType()
export class Session {
  @Field(() => String, { description: 'id of the session' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  userId: string;

  @Field(() => String, { description: 'refresh token of the user' })
  @Column()
  rt: string;

  @Field(() => String, { description: 'fingerprint device of the user' })
  @Column()
  fp: string;

  @Field(() => User, { description: 'user' })
  user: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.sessionConnection)
  @JoinColumn({ name: 'userId' })
  userConnection: Promise<User>;
}
