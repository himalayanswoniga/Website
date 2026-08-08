import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Pagination from '../components/common/Pagination';

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(<Pagination meta={{ page: 1, totalPages: 1 }} onPageChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('calls onPageChange with the clicked page number', () => {
    const onPageChange = vi.fn();
    render(<Pagination meta={{ page: 1, totalPages: 3 }} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('disables Prev on the first page and Next on the last page', () => {
    render(<Pagination meta={{ page: 1, totalPages: 3 }} onPageChange={() => {}} />);
    expect(screen.getByText('Prev')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
  });
});
