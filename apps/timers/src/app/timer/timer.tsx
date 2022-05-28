import { format, isValid } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import {
  IoMdFlag,
  IoMdPause,
  IoMdPlay,
  IoMdRefresh,
  IoMdTrash,
} from 'react-icons/io';
import TimerLaps, { TimerLap } from '../timer-laps/timer-laps';
import { timeStr } from '../utils';
import './timer.module.scss';

export interface TimerProps {
  name: string;
  onDelete: (name: string) => void;
}

const TIMER_KEY_PREFIX = 'sakkaku-web-timers-timer-';
const TIMER_START_KEY_PREFIX = 'sakkaku-web-timers-timerStart-';
const TIMER_LAPS_KEY_PREFIX = 'sakkaku-web-timers-timerLaps-';

export function Timer({ name, onDelete }: TimerProps) {
  const saveKey = TIMER_KEY_PREFIX + name;
  const startTimeKey = TIMER_START_KEY_PREFIX + name;
  const lapsKey = TIMER_LAPS_KEY_PREFIX + name;

  const loadSavedTime = (): number => {
    const time = parseInt(localStorage.getItem(saveKey) || '0');
    return isNaN(time) ? 0 : time;
  };

  const loadStartTime = (): Date | null => {
    const time = new Date(localStorage.getItem(startTimeKey) || '');
    return isValid(time) ? time : null;
  };

  const loadLaps = (): TimerLap[] => {
    const laps = JSON.parse(localStorage.getItem(lapsKey) || '[]');
    return laps;
  };

  const [paused, setPaused] = useState(true);
  const [timeInSec, setTimeInSec] = useState(loadSavedTime());
  const [startTime, setStartTime] = useState(loadStartTime());
  const [timerLaps, setTimerLaps] = useState(loadLaps());

  const resetTime = () => {
    setPaused(true);
    setTimeInSec(0);
    setTimerLaps([]);
    updateStartTime(null);
  };

  const deleteTimer = () => {
    onDelete(name);
    localStorage.removeItem(saveKey);
    localStorage.removeItem(startTimeKey);
    localStorage.removeItem(lapsKey);
  };

  const addLap = () => {
    setTimerLaps([...timerLaps, { name: 'Lap', time: timeInSec }]);
  };

  const saveLaps = (laps: TimerLap[]) => {
    setTimerLaps(laps);
  };

  useEffect(() => {
    localStorage.setItem(lapsKey, JSON.stringify(timerLaps || []));
  }, [lapsKey, timerLaps]);

  const saveTime = useCallback(() => {
    localStorage.setItem(saveKey, `${timeInSec}`);
  }, [saveKey, timeInSec]);
  useEffect(() => saveTime(), [saveTime]);

  const increaseTime = () => {
    setTimeInSec((t) => t + 1);
  };
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

  const updateStartTime = useCallback(
    (time: Date | null) => {
      setStartTime(time);
      if (time) {
        localStorage.setItem(startTimeKey, time.toISOString());
      } else {
        localStorage.removeItem(startTimeKey);
      }
    },
    [startTimeKey]
  );
  useEffect(() => {
    if (!paused && timeInSec === 0) {
      updateStartTime(new Date());
    }
  }, [paused, timeInSec, updateStartTime]);

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="font-bold text-3xl flex flex-col items-center">
        {name}
        {startTime && (
          <span className="text-xs text-slate-500 dark:text-slate-300">
            {format(startTime, 'dd.MM.yyyy')}
          </span>
        )}
      </h2>
      <div className="flex flex-col items-center">
        <span className="font-bold">{timeStr(timeInSec)}</span>
        <TimerLaps laps={timerLaps} onChange={saveLaps} />
      </div>
      <div className="flex flex-row gap-1">
        {!paused && (
          <button aria-label="pause" onClick={() => setPaused(true)}>
            <IoMdPause />
          </button>
        )}

        {paused && (
          <button aria-label="play" onClick={() => setPaused(false)}>
            <IoMdPlay />
          </button>
        )}

        <button aria-label="lap" onClick={() => addLap()}>
          <IoMdFlag />
        </button>

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
