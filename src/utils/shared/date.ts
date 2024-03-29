/**
 *
 * @param startDate
 * @param endDate
 * @returns total time in seconds
 */
export const getTimeDiffInSeconds = (startDate: Date, endDate: Date) => {
  return (new Date(endDate).getTime() - new Date(startDate).getTime()) / 1000;
};

/**
 *
 * @param time - total time in seconds
 * @returns Output like "1:01" or "h:mm:ss"
 */
export const fancyTimeFormat = (time: number): string => {
  // Hours, minutes and seconds
  const hrs = ~~(time / 3600);
  const mins = ~~((time % 3600) / 60);
  const secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
};

export const getWeekDays = () => {
  const currDate = new Date();
  const lastWeekDates = last7DaysDate();
  const week: DateWithLibelle[] = [];
  for (let index = 0; index < lastWeekDates.length; index++) {
    const day = lastWeekDates[index];
    week.push({
      libelle: day.toLocaleDateString('fr', { weekday: 'short' }),
      date: day.getDate(),
      fullDate: day,
      isToday: day.getDate() === currDate.getDate(),
    });
  }
  return week;
};

function last7DaysDate() {
  return [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  });
}

export interface DateWithLibelle {
  libelle: string;
  date: number;
  fullDate?: Date;
  isToday: boolean;
}

export const getDateString = (date: Date) => {
  return `${date.toLocaleDateString('fr', {
    weekday: 'short',
  })} ${date.getDate()} ${date.toLocaleDateString('fr', { month: 'short' })}`;
};

export const getDayPartString = (date: Date) => {
  let partString = 'journée';
  switch (true) {
    case date.getHours() < 12 && date.getHours() > 5:
      partString = 'du matin';
      break;
    case date.getHours() > 12 && date.getHours() < 14:
      partString = 'du midi';
      break;
    case date.getHours() > 11 && date.getHours() < 14:
      partString = 'du midi';
      break;
    case date.getHours() > 13 && date.getHours() < 19:
      partString = "de l'après midi";
      break;
    default:
      partString = 'du soir';
      break;
  }
  return partString
};
