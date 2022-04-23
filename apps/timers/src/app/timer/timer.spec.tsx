import { render } from '@testing-library/react';
import { add } from 'date-fns';
import { act } from 'react-dom/test-utils';

import Timer from './timer';

describe('Timer', () => {
  const initialDate = new Date('2020-01-01T11:00:00');

  beforeEach(() => {
    jest.useFakeTimers();
    Date.now = jest.fn(() => initialDate.getTime());
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const tick = (diff = 1) => {
    const newTime = add(new Date(Date.now()), { seconds: diff });
    Date.now = jest.fn(() => newTime.getTime());
    jest.runOnlyPendingTimers();
  };

  it('should show diff duration', () => {
    const { baseElement } = render(
      <Timer start={new Date('2020-01-01T10:00:00')} name="" />
    );
    expect(baseElement.textContent).toContain('01:00:00');
  });

  it('should show name', () => {
    const { baseElement } = render(
      <Timer start={new Date('2020-01-01T10:00:00')} name="Drawing" />
    );

    expect(baseElement.textContent).toContain('Drawing');
  });

  it('should increase time', () => {
    const { baseElement } = render(
      <Timer start={new Date('2020-01-01T10:00:00')} name="" />
    );

    act(() => tick());
    expect(baseElement.textContent).toContain('01:00:01');

    act(() => tick());
    expect(baseElement.textContent).toContain('01:00:02');

    act(() => tick(20));
    expect(baseElement.textContent).toContain('01:00:22');
  });

  it('should pause and resume timer', () => {
    const { baseElement, getByRole } = render(
      <Timer start={new Date('2020-01-01T10:00:00')} name="Drawing" />
    );

    act(() => {
      getByRole('button', { name: /pause/i }).click();
      // tick();
      jest.runOnlyPendingTimers();
    });

    expect(baseElement.textContent).toContain('01:00:00');
  });
});
