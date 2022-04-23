import { Duration } from 'date-fns';
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

export function Timer({ name, onDelete }: TimerProps) {
  const saveKey = TIMER_KEY_PREFIX + name;
  const loadSavedTime = (): number => {
    const time = parseInt(localStorage.getItem(saveKey) || '0');
    return isNaN(time) ? 0 : time;
  };

  const [paused, setPaused] = useState(true);
  const [timeInSec, setTimeInSec] = useState(loadSavedTime());

  const updatePaused = (paused: boolean) => {
    setPaused(paused);
  };

  const resetTime = () => {
    setPaused(true);
    setTimeInSec(0);
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
      interval = setInterval(() => increaseTime(), 1000);
    } else {
      clear();
    }

    return () => clear();
  }, [paused]);

  const duration: Duration = { seconds: timeInSec };
  const durationStr = `${prefixZero(duration.hours)}:${prefixZero(
    duration.minutes
  )}:${prefixZero(duration.seconds)}`;

  return (
    <div>
      <h2>{name}</h2>
      <span>{durationStr}</span>
      <div>
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
