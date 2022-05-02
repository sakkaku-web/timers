import { add, Duration, format, intervalToDuration, isValid } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { IoMdPause, IoMdPlay, IoMdRefresh, IoMdTrash } from 'react-icons/io';
import './timer.module.scss';

export interface TimerData {
  name: string;
  timeInSec: number;
}

export interface TimerProps {
  name: string;
  onDelete: (name: string) => void;
}

const prefixZero = (num?: number): string => {
  if (!num) {
    return '00';
  }
  return num > 9 ? `${num}` : `0${num}`;
};

const TIMER_KEY_PREFIX = 'sakkaku-web-timers-timer-';
const TIMER_START_KEY_PREFIX = 'sakkaku-web-timers-timerStart-';

export function Timer({ name, onDelete }: TimerProps) {
  const saveKey = TIMER_KEY_PREFIX + name;
  const startTimeKey = TIMER_START_KEY_PREFIX + name;

  const loadSavedTime = (): number => {
    const time = parseInt(localStorage.getItem(saveKey) || '0');
    return isNaN(time) ? 0 : time;
  };

  const loadStartTime = (): Date | null => {
    const time = new Date(localStorage.getItem(startTimeKey) || '');
    return isValid(time) ? time : null;
  };

  const [paused, setPaused] = useState(true);
  const [timeInSec, setTimeInSec] = useState(loadSavedTime());
  const [startTime, setStartTime] = useState(loadStartTime());

  const updateStartTime = (time: Date | null) => {
    setStartTime(time);
    if (time) {
      localStorage.setItem(startTimeKey, time.toISOString());
    } else {
      localStorage.removeItem(startTimeKey);
    }
  };

  const updatePaused = (paused: boolean) => {
    setPaused(paused);
  };

  const resetTime = () => {
    setPaused(true);
    setTimeInSec(0);
    updateStartTime(null);
  };

  const saveTime = useCallback(() => {
    localStorage.setItem(saveKey, `${timeInSec}`);
  }, [saveKey, timeInSec]);

  const increaseTime = () => {
    setTimeInSec((t) => t + 1);
  };

  const deleteTimer = () => {
    onDelete(name);
    localStorage.removeItem(saveKey);
  };

  useEffect(() => saveTime(), [saveTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const clear = () => {
      if (interval) {
        clearInterval(interval);
      }
    };

    if (!paused) {
      if (timeInSec === 0) {
        updateStartTime(new Date());
      }
      interval = setInterval(() => increaseTime(), 1000);
    } else {
      clear();
    }

    return () => clear();
  }, [paused]);

  const start = new Date(0);
  const end = add(start, { seconds: timeInSec });

  const duration: Duration = intervalToDuration({ start, end });
  const durationStr = `${prefixZero(duration.hours)}:${prefixZero(
    duration.minutes
  )}:${prefixZero(duration.seconds)}`;

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="font-bold text-3xl flex flex-col">
        {name}
        {startTime && (
          <span className="text-xs text-slate-500">
            {format(startTime, 'dd.MM.yyyy')}
          </span>
        )}
      </h2>
      <span>{durationStr}</span>
      <div className="flex flex-row gap-1">
        {!paused && (
          <button aria-label="pause" onClick={() => updatePaused(true)}>
            <IoMdPause />
          </button>
        )}

        {paused && (
          <button aria-label="play" onClick={() => updatePaused(false)}>
            <IoMdPlay />
          </button>
        )}

        <button aria-label="reset" onClick={() => resetTime()}>
          <IoMdRefresh />
        </button>

        <button aria-label="delete" onClick={() => deleteTimer()}>
          <IoMdTrash />
        </button>
      </div>
    </div>
  );
}

export default Timer;
