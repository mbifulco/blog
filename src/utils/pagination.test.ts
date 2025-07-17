import { describe, expect, it } from 'vitest';
import { paginate } from './pagination';

describe('paginate', () => {
  const mockItems = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, title: `Item ${i + 1}` }));

  it('should paginate items correctly with default options', () => {
    const result = paginate(mockItems);
    
    expect(result.items).toHaveLength(10);
    expect(result.totalItems).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.items[0]).toEqual({ id: 1, title: 'Item 1' });
    expect(result.items[9]).toEqual({ id: 10, title: 'Item 10' });
  });

  it('should paginate items correctly with custom limit', () => {
    const result = paginate(mockItems, { limit: 5 });
    
    expect(result.items).toHaveLength(5);
    expect(result.totalItems).toBe(25);
    expect(result.totalPages).toBe(5);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('should paginate items correctly for middle page', () => {
    const result = paginate(mockItems, { page: 2, limit: 10 });
    
    expect(result.items).toHaveLength(10);
    expect(result.totalItems).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(2);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.items[0]).toEqual({ id: 11, title: 'Item 11' });
    expect(result.items[9]).toEqual({ id: 20, title: 'Item 20' });
  });

  it('should paginate items correctly for last page', () => {
    const result = paginate(mockItems, { page: 3, limit: 10 });
    
    expect(result.items).toHaveLength(5); // Only 5 items left
    expect(result.totalItems).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(3);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.items[0]).toEqual({ id: 21, title: 'Item 21' });
    expect(result.items[4]).toEqual({ id: 25, title: 'Item 25' });
  });

  it('should handle empty array', () => {
    const result = paginate([]);
    
    expect(result.items).toHaveLength(0);
    expect(result.totalItems).toBe(0);
    expect(result.totalPages).toBe(0);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('should handle single item', () => {
    const result = paginate([{ id: 1, title: 'Single Item' }]);
    
    expect(result.items).toHaveLength(1);
    expect(result.totalItems).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('should handle items that fit exactly in one page', () => {
    const exactItems = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }));
    const result = paginate(exactItems, { limit: 10 });
    
    expect(result.items).toHaveLength(10);
    expect(result.totalItems).toBe(10);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('should handle page number beyond total pages', () => {
    const result = paginate(mockItems, { page: 10, limit: 10 });
    
    expect(result.items).toHaveLength(5); // Returns last page
    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(3); // Clamps to last page
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(true);
  });

  it('should handle page number less than 1', () => {
    const result = paginate(mockItems, { page: 0, limit: 10 });
    
    expect(result.items).toHaveLength(10);
    expect(result.currentPage).toBe(1); // Clamps to first page
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('should handle negative page number', () => {
    const result = paginate(mockItems, { page: -5, limit: 10 });
    
    expect(result.items).toHaveLength(10);
    expect(result.currentPage).toBe(1); // Clamps to first page
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('should handle large limit', () => {
    const result = paginate(mockItems, { limit: 100 });
    
    expect(result.items).toHaveLength(25); // Returns all items
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPreviousPage).toBe(false);
  });

  it('should handle limit of 1', () => {
    const result = paginate(mockItems, { limit: 1 });
    
    expect(result.items).toHaveLength(1);
    expect(result.totalPages).toBe(25);
    expect(result.currentPage).toBe(1);
    expect(result.hasNextPage).toBe(true);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.items[0]).toEqual({ id: 1, title: 'Item 1' });
  });
});