import { render } from '@testing-library/react';

import TimerLaps from './timer-laps';

describe('TimerLaps', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TimerLaps />);
    expect(baseElement).toBeTruthy();
  });
});
