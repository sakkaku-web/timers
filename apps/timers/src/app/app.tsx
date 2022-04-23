import styles from './app.module.scss';

import Timer from './timer/timer';

export function App() {
  return (
    <div>
      <Timer start={new Date()} name="Drawing" />
    </div>
  );
}

export default App;
