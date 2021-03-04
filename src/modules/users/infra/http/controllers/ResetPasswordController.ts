import { Request, Response } from 'express';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import HashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();
    const userTokensRepository = new UserTokensRepository();
    const hashProvider = new HashProvider();

    const { token, password } = request.body;

    const resetPassword = new ResetPasswordService(
      usersRepository, 
      userTokensRepository,
      hashProvider
    );

    await resetPassword.execute({
      token,
      password
    });

    return response.status(204).json();
  }
}