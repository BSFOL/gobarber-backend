import { Request, Response } from 'express';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();

    const user_id = request.user.id;

    const listProviders = new ListProvidersService(usersRepository);

    const providers = await listProviders.execute({
      user_id
    });

    return response.json(providers);
  }
}