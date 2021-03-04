import { Request, Response } from 'express';
import { parseISO } from 'date-fns';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const appointmentsRepository = new AppointmentsRepository();
    const notificationsRepository = new NotificationsRepository();

    const user_id = request.user.id;
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService(appointmentsRepository, notificationsRepository);
    
    const appointment =  await createAppointment.execute({ provider_id, user_id, date: parsedDate});

    return response.json(appointment);
  }
}