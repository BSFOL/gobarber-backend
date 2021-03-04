import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface Request {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type Response = Array<{
  hour: number;
  available: boolean;
}>;

class ListProviderDayAvailabilityService {
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  public async execute({ provider_id, year, month, day }: Request): Promise<Response> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day
      }
    );

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (value, index) => index + hourStart
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour
      );

      const currentDate = new Date(Date.now());
      const compareDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !hasAppointmentInHour && isAfter(compareDate, currentDate)
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;