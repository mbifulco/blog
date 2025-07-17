import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import PaginationWrapper from './Pagination';

describe('PaginationWrapper', () => {
  const defaultProps = {
    currentPage: 2,
    totalPages: 5,
    hasNextPage: true,
    hasPreviousPage: true,
    basePath: '',
  };

  it('should render pagination navigation', () => {
    render(<PaginationWrapper {...defaultProps} />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });

  it('should render page numbers correctly', () => {
    render(<PaginationWrapper {...defaultProps} />);

    // Should show pages 1, 2, 3, 4, 5 (totalPages <= 7)
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should highlight current page', () => {
    render(<PaginationWrapper {...defaultProps} />);

    const currentPageLink = screen.getByText('2').closest('a');
    expect(currentPageLink).toHaveAttribute('data-active', 'true');
  });

  it('should generate correct URLs for pages', () => {
    render(<PaginationWrapper {...defaultProps} />);

    const page1Link = screen.getByText('1').closest('a');
    const page3Link = screen.getByText('3').closest('a');

    expect(page1Link).toHaveAttribute('href', '/');
    expect(page3Link).toHaveAttribute('href', '/page/3');
  });

  it('should generate correct URLs with basePath', () => {
    render(<PaginationWrapper {...defaultProps} basePath="/newsletter" />);

    const page1Link = screen.getByText('1').closest('a');
    const page3Link = screen.getByText('3').closest('a');

    expect(page1Link).toHaveAttribute('href', '/newsletter');
    expect(page3Link).toHaveAttribute('href', '/newsletter/page/3');
  });

  it('should show previous button when hasPreviousPage is true', () => {
    render(<PaginationWrapper {...defaultProps} hasPreviousPage={true} />);

    const previousLink = screen.getByLabelText('Go to previous page');
    expect(previousLink).toBeInTheDocument();
    expect(previousLink).toHaveAttribute('href', '/');
  });

  it('should show next button when hasNextPage is true', () => {
    render(<PaginationWrapper {...defaultProps} hasNextPage={true} />);

    const nextLink = screen.getByLabelText('Go to next page');
    expect(nextLink).toBeInTheDocument();
    expect(nextLink).toHaveAttribute('href', '/page/3');
  });

  it('should not show previous button when hasPreviousPage is false', () => {
    render(<PaginationWrapper {...defaultProps} hasPreviousPage={false} />);

    expect(screen.queryByLabelText('Go to previous page')).not.toBeInTheDocument();
  });

  it('should not show next button when hasNextPage is false', () => {
    render(<PaginationWrapper {...defaultProps} hasNextPage={false} />);

    expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument();
  });


  it('should not render when totalPages is 1', () => {
    render(<PaginationWrapper {...defaultProps} totalPages={1} />);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should not render when totalPages is 0', () => {
    render(<PaginationWrapper {...defaultProps} totalPages={0} />);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('should handle first page correctly', () => {
    render(
      <PaginationWrapper
        {...defaultProps}
        currentPage={1}
        hasPreviousPage={false}
      />
    );

    expect(screen.queryByLabelText('Go to previous page')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });

  it('should handle last page correctly', () => {
    render(
      <PaginationWrapper
        {...defaultProps}
        currentPage={5}
        hasNextPage={false}
      />
    );

    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument();
  });

  it('should handle edge case with currentPage at beginning of large range', () => {
    render(
      <PaginationWrapper
        {...defaultProps}
        currentPage={2}
        totalPages={10}
      />
    );

    // Should show: 1 2 3 4 ... 10
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should handle edge case with currentPage at end of large range', () => {
    render(
      <PaginationWrapper
        {...defaultProps}
        currentPage={9}
        totalPages={10}
      />
    );

    // Should show: 1 ... 7 8 9 10
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
