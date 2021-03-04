import { Request, Response } from 'express';

import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import HashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();

    const user_id = request.user.id;

    const showProfile = new ShowProfileService(usersRepository);

    const user = await showProfile.execute({
      user_id
    });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();
    const hashProvider = new HashProvider();
    
    const user_id = request.user.id;
    const { name, email, old_password, password } = request.body;

    const updateProfile = new UpdateProfileService(usersRepository, hashProvider);

    const user = await updateProfile.execute({
      user_id,
      name,
      email,
      old_password,
      password
    });

    return response.json(classToClass(user));
  }
}