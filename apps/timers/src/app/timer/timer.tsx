import { add, format, isValid } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IoMdFlag,
  IoMdPause,
  IoMdPlay,
  IoMdRefresh,
  IoMdTrash,
} from 'react-icons/io';
import { GiTomato } from 'react-icons/gi';
import TimerLaps, { TimerLap } from '../timer-laps/timer-laps';
import { timeStr } from '../utils';
import './timer.module.scss';
import { useStopwatch } from 'react-timer-hook';

export interface TimerProps {
  name: string;
  onDelete: (name: string) => void;
}

const TIMER_KEY_PREFIX = 'sakkaku-web-timers-timer-';
const TIMER_START_KEY_PREFIX = 'sakkaku-web-timers-timerStart-';
const TIMER_LAPS_KEY_PREFIX = 'sakkaku-web-timers-timerLaps-';

// TODO: make configurable
const POMODORO_MINUTES = 25;

export function Timer({ name, onDelete }: TimerProps) {
  const saveKey = TIMER_KEY_PREFIX + name;
  const startTimeKey = TIMER_START_KEY_PREFIX + name;
  const lapsKey = TIMER_LAPS_KEY_PREFIX + name;

  const loadSavedTime = (): Date => {
    const time = parseInt(localStorage.getItem(saveKey) || '0');
    return isNaN(time) ? new Date() : add(new Date(), { seconds: time });
  };

  const loadStartTime = (): Date | null => {
    const time = new Date(localStorage.getItem(startTimeKey) || '');
    return isValid(time) ? time : null;
  };

  const loadLaps = (): TimerLap[] => {
    const laps = JSON.parse(localStorage.getItem(lapsKey) || '[]');
    return laps;
  };

  const [startTime, setStartTime] = useState(loadStartTime());
  const [timerLaps, setTimerLaps] = useState(loadLaps());
  const [pomodoroStart, setPomodoroStart] = useState(null as number | null);

  const soundRef = useRef<HTMLAudioElement>(null);

  const { seconds, minutes, hours, days, isRunning, start, pause, reset } =
    useStopwatch({ offsetTimestamp: loadSavedTime() });
  const timeInSec =
    seconds + minutes * 60 + hours * 60 * 60 + days * 24 * 60 * 60;

  const resetPomodoroTime = () => setPomodoroStart(null);
  const stopPomodoro = () => {
    pause();
    resetPomodoroTime();
  };

  const resetTime = () => {
    reset();
    pause();
    setTimerLaps([]);
    resetPomodoroTime();
    updateStartTime(null);
  };

  const deleteTimer = () => {
    onDelete(name);
    localStorage.removeItem(saveKey);
    localStorage.removeItem(startTimeKey);
    localStorage.removeItem(lapsKey);
  };

  const togglePomodoroTimer = () => {
    if (pomodoroStart == null) {
      setPomodoroStart(timeInSec);
      if (!isRunning) {
        start();
      }
    } else {
      stopPomodoro();
    }
  };

  const addLap = () => {
    setTimerLaps([...timerLaps, { name: 'Lap', time: timeInSec }]);
  };

  const saveLaps = (laps: TimerLap[]) => {
    setTimerLaps(laps);
  };

  useEffect(
    () => localStorage.setItem(lapsKey, JSON.stringify(timerLaps || [])),
    [lapsKey, timerLaps]
  );

  useEffect(
    () => localStorage.setItem(saveKey, `${timeInSec}`),
    [saveKey, timeInSec]
  );

  const sendNotifiation = async (msg: string) => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(msg);
      soundRef.current?.play();
    }
  };
  useEffect(() => {
    if (pomodoroStart) {
      const elapsedPomodoroMinutes = (timeInSec - pomodoroStart) / 60;
      if (elapsedPomodoroMinutes >= POMODORO_MINUTES) {
        sendNotifiation('Take a break!');
        stopPomodoro();
      }
    }
  }, [timeInSec, pomodoroStart, pause]);

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
    if (isRunning && timeInSec === 0) {
      updateStartTime(new Date());
    }
  }, [isRunning, timeInSec, updateStartTime]);

  return (
    <div className="flex flex-col items-center gap-2">
      <audio ref={soundRef} src="assets/notification.wav" />
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
        {isRunning && (
          <button aria-label="pause" onClick={() => pause()}>
            <IoMdPause />
          </button>
        )}

        {!isRunning && (
          <button aria-label="play" onClick={() => start()}>
            <IoMdPlay />
          </button>
        )}

        <button
          aria-label="start pomodoro timer"
          onClick={() => togglePomodoroTimer()}
          className={pomodoroStart != null ? 'text-red-500' : ''}
        >
          <GiTomato />
        </button>

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
