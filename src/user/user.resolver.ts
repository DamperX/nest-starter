import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/user.entity';
import { UserInput } from './user.input';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getUser(@Args('getUserData') id: string): Promise<User> {
    return this.userService.getUser(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserData') createUserInput: UserInput,
  ): Promise<User> {
    return this.userService.createUser(createUserInput);
  }
}
