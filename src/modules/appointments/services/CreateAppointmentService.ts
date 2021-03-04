import { startOfHour, isBefore, getHours, format } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';  

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
import INotificationsRepository  from '@modules/notifications/repositories/INotificationsRepository';

interface Request {
  provider_id: string;
  user_id: string;
  date: Date;
}

class CreateAppointmentService {
  constructor(
    private appointmentsRepository: IAppointmentsRepository,

    private notificationsRepository: INotificationsRepository
  ) {}

  public async execute({ provider_id, user_id, date }: Request): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself.");
    }

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(appointmentDate, provider_id);

    if(findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only create appontments between 8am and 5pm.');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate
    });

    const dateFormatted = format(appointment.date, "dd/MM/yyyy 'às' HH:mm'h'");

    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para dia ${dateFormatted}`
    });

    return appointment;
  }
}

export default CreateAppointmentService;