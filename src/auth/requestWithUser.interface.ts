import { Request } from 'express';
import { User } from '../models/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

export default RequestWithUser;
