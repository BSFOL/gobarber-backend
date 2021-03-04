import { Request, Response } from 'express';

import { classToClass } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import DiskStorageProvider from '@shared/providers/StorageProvider/implementations/DiskStorageProvider';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const usersRepository = new UsersRepository();
    const diskStorageProvider = new DiskStorageProvider();
  
    const updateUserAvatar = new UpdateUserAvatarService(usersRepository, diskStorageProvider);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename
    });

    return response.json(classToClass(user));
  }
}