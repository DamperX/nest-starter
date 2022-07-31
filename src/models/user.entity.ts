import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Session } from './session.entity';
import { Role } from './role.entity';
import { Exclude } from 'class-transformer';

@Entity()
@ObjectType()
export class User {
  @Field(() => String, { description: 'id of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'login of the user' })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Field()
  @Column({ nullable: true })
  firstName: string;

  @Field()
  @Column({ nullable: true })
  lastName: string;

  @Field()
  @Column({ nullable: true })
  age: number;

  @Field()
  @Column({ nullable: true })
  avatar: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Session, (session) => session.userConnection)
  sessionConnection: Promise<Session[]>;

  @OneToMany(() => Role, (session) => session.userConnection)
  roleConnection: Promise<Role[]>;
}
