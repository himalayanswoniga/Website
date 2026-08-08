import { render, screen, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ToastProvider, useToast } from '../context/ToastContext';
import ToastContainer from '../components/common/ToastContainer';

function Trigger() {
  const toast = useToast();
  return <button onClick={() => toast.success('Saved successfully')}>Trigger</button>;
}

describe('ToastContext', () => {
  it('shows a toast message when triggered and removes it on dismiss', () => {
    render(
      <ToastProvider>
        <Trigger />
        <ToastContainer />
      </ToastProvider>
    );

    act(() => screen.getByText('Trigger').click());
    expect(screen.getByText('Saved successfully')).toBeInTheDocument();

    act(() => screen.getByLabelText('Dismiss').click());
    expect(screen.queryByText('Saved successfully')).not.toBeInTheDocument();
  });
});
