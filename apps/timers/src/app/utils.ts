import { add, intervalToDuration } from 'date-fns';

const prefixZero = (num?: number): string => {
  if (!num) {
    return '00';
  }
  return num > 9 ? `${num}` : `0${num}`;
};

export const timeStr = (timeInSec: number) => {
  const start = new Date(0);
  const end = add(start, { seconds: timeInSec });

  const duration: Duration = intervalToDuration({ start, end });
  return `${prefixZero(duration.hours)}:${prefixZero(
    duration.minutes
  )}:${prefixZero(duration.seconds)}`;
};
