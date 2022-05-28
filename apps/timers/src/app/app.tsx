import React, { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import TextInput from './text-input/text-input';

import { Timer } from './timer/timer';

const TIMERS_KEY = 'sakkaku-web-timers';

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

  const timerComponents = timers.map((timer, i) => (
    <Timer key={timer} name={timer} onDelete={deleteTimer} />
  ));

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4 text-slate-900 bg-slate-50 dark:bg-slate-900 dark:text-slate-50">
      {timerComponents}
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
    </div>
  );
}

export default App;
