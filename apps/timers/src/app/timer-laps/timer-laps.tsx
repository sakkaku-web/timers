import { useState } from 'react';
import { IoMdCheckmark, IoMdTrash } from 'react-icons/io';
import TextInput from '../text-input/text-input';
import { timeStr } from '../utils';
import './timer-laps.module.scss';

export interface TimerLap {
  name: string;
  time: number;
}

export interface TimerLapsProps {
  laps: TimerLap[];
  onChange: (l: TimerLap[]) => void;
}

export function TimerLaps({ laps, onChange }: TimerLapsProps) {
  const [editIndex, setEditIndex] = useState(null as number | null);
  const [editName, setEditName] = useState('');

  const lapTime = (index: number): number => {
    return laps.length > 0 ? laps[index]?.time || 0 : 0;
  };

  const setEditLap = (i: number) => {
    setEditIndex(i);
    setEditName(laps[i].name);
  };

  const updateLapName = () => {
    if (editIndex != null) {
      laps[editIndex].name = editName;
      onChange([...laps]);
      setEditIndex(null);
    }
  };

  const deleteLap = () => {
    if (editIndex != null) {
      onChange(laps.filter((x, i) => i !== editIndex));
      setEditIndex(null);
    }
  };

  return (
    <ul>
      {laps.map((lap, i) => (
        <li
          className="text-xs text-slate-500 dark:text-slate-300"
          key={lap.time}
        >
          {timeStr(lap.time - lapTime(i - 1))} -{' '}
          {(editIndex === i && (
            <div>
              <TextInput
                value={editName}
                onChange={setEditName}
                onEnter={updateLapName}
              />
              <button aria-label="save" onClick={() => updateLapName()}>
                <IoMdCheckmark />
              </button>
              <button aria-label="delete" onClick={() => deleteLap()}>
                <IoMdTrash />
              </button>
            </div>
          )) || <span onClick={() => setEditLap(i)}>{lap.name}</span>}
        </li>
      ))}
    </ul>
  );
}

export default TimerLaps;
