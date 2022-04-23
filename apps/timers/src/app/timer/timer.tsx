import { intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';
import './timer.module.scss';

export interface TimerProps {
  name: string;
  start: Date;
}

const prefixZero = (num?: number): string => {
  if (!num) {
    return '00';
  }
  return num > 9 ? `${num}` : `0${num}`;
};

export function Timer({ start, name }: TimerProps) {
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const calculateDuration = () => {
      const now = new Date(Date.now());
      const diff = intervalToDuration({ start, end: now });
      const diffStr = `${prefixZero(diff.hours)}:${prefixZero(
        diff.minutes
      )}:${prefixZero(diff.seconds)}`;

      setDuration(diffStr);
    };

    calculateDuration();
    const i = setInterval(() => calculateDuration(), 1000);
    return () => clearInterval(i);
  });

  return (
    <div>
      <h2>{name}</h2>
      <span>{duration}</span>
    </div>
  );
}

export default Timer;
