import { useEffect, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';

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

  const addTimer = () => {
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
    <div className="flex flex-col items-center gap-4 text-slate-900">
      {timerComponents}
      <div className="flex flex-row gap-1">
        <input
          className="ring-1 ring-slate-900/30 hover:ring-slate-500 rounded outline-0"
          type="text"
          value={newTimerName}
          onChange={(e) => setNewTimerName(e.target.value)}
        />
        <button
          aria-label="add timer"
          disabled={!newTimerName || timers.includes(newTimerName)}
          onClick={() => addTimer()}
        >
          <IoMdAdd />
        </button>
      </div>
    </div>
  );
}

export default App;
