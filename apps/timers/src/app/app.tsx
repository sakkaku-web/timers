import React, { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import TextInput from './text-input/text-input';

import { Timer } from './timer/timer';
import { timeStr } from './utils';

const TIMERS_KEY = 'sakkaku-web-timers';
const POMODORO_MINUTES = 25;

export function App() {
  const loadSavedTimers = (): string[] => {
    const timerStr = localStorage.getItem(TIMERS_KEY);
    if (timerStr) {
      return JSON.parse(timerStr);
    }

    return [];
  };

  const [newTimerName, setNewTimerName] = useState('');
  const [timers, setTimers] = useState(loadSavedTimers());
  const [elapsedTimes, setElapsedTimes] = useState([] as number[]);
  const [currentTimeName, setCurrentTimeName] = useState('');
  const [pomodoroMinutes, setPomodoroMinutes] = useState(POMODORO_MINUTES);
  const [showDetails, setShowDetails] = useState(false);

  const isCreateDisabled = !newTimerName || timers.includes(newTimerName);
  const addTimer = () => {
    if (isCreateDisabled) return;

    setTimers([...timers, newTimerName]);
    setNewTimerName('');
  };

  const deleteTimer = (name: string) => {
    setTimers(timers.filter((timer) => timer !== name));
  };

  useEffect(
    () => localStorage.setItem(TIMERS_KEY, JSON.stringify(timers)),
    [timers]
  );

  useEffect(() => {
    if (elapsedTimes.length === 2) {
      const time = elapsedTimes[elapsedTimes[1] !== -1 ? 1 : 0];
      document.title = `${timeStr(time)} - ${currentTimeName}`;
    } else {
      document.title = 'Timers';
    }
  }, [elapsedTimes, currentTimeName]);

  const onTime = (elapsed: number, elapsedPomodoro: number, name: string) => {
    console.log('OnTime', name);
    if (elapsedTimes.length !== 2) {
      setCurrentTimeName(name);
      setElapsedTimes([elapsed, elapsedPomodoro]);
      return;
    }

    const currentTime = elapsedTimes[0];
    const currentPomodoro = elapsedTimes[1];
    const isNewPomodoro = currentPomodoro === -1 && elapsedPomodoro !== -1;
    const isNewPomodoroSmaller =
      currentPomodoro !== -1 &&
      elapsedPomodoro !== -1 &&
      elapsedPomodoro < currentPomodoro;
    const isNewTimeLarger =
      currentPomodoro === -1 && elapsedPomodoro === -1 && elapsed > currentTime;

    if (currentPomodoro !== -1 && elapsedPomodoro === -1) {
      return;
    }

    if (isNewPomodoro || isNewPomodoroSmaller || isNewTimeLarger) {
      setCurrentTimeName(name);
      setElapsedTimes([elapsed, elapsedPomodoro]);
      return;
    }
  };

  const onStateChange = (running: boolean, name: string) => {
    console.log(running, name);
    if (!running && currentTimeName === name) {
      setElapsedTimes([]);
    }
  };

  const timerComponents = timers.map((timer, i) => (
    <Timer
      key={timer}
      name={timer}
      countdownTime={pomodoroMinutes}
      showDetails={showDetails}
      onDelete={deleteTimer}
      onStateChange={(r) => onStateChange(r, timer)}
      onTime={(e, ep) => onTime(e, ep, timer)}
    />
  ));

  return (
    <div className="h-full flex flex-wrap items-start gap-12 p-4 text-slate-900 bg-slate-50 dark:bg-slate-900 dark:text-slate-50">
      {timerComponents}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-1">
          <TextInput
            placeholder="Name"
            value={newTimerName}
            onChange={setNewTimerName}
            onEnter={addTimer}
          />
          <button
            aria-label="add timer"
            className="disabled:text-slate-200 dark:disabled:text-slate-700"
            disabled={isCreateDisabled}
            onClick={() => addTimer()}
          >
            <IoMdAdd />
          </button>
        </div>

        <input
          className="rounded outline-0 ring-inset ring-1 ring-slate-200 bg-slate-50 hover:ring-slate-400 dark:ring-slate-700 dark:bg-slate-900 w-1/2"
          placeholder="Default Pomodoro Minutes"
          type="number"
          value={pomodoroMinutes}
          onChange={(e) => setPomodoroMinutes(e.target.valueAsNumber)}
        />

        <div className='flex gap-2 items-center'>
          <input
            type="checkbox"
            checked={showDetails}
            onChange={(e) => setShowDetails(e.target.checked)}
          />
          <label>Detailed Tracking</label>
        </div>
      </div>
    </div>
  );
}

export default App;
