import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

describe('EmptyState', () => {
  it('shows the provided title and message', () => {
    render(<EmptyState title="No products" message="Try another search" />);
    expect(screen.getByText('No products')).toBeInTheDocument();
    expect(screen.getByText('Try another search')).toBeInTheDocument();
  });
});

describe('ErrorState', () => {
  it('calls onRetry when the retry button is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorState message="Failed to load" onRetry={onRetry} />);
    fireEvent.click(screen.getByText('Try Again'));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('does not render a retry button when onRetry is not provided', () => {
    render(<ErrorState message="Failed to load" />);
    expect(screen.queryByText('Try Again')).not.toBeInTheDocument();
  });
});
