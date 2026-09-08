import { PaginatedResponse } from '~/types/api';

/**
 * Wraps a plain array in a PaginatedResponse structure.
 * Used when the backend returns an array instead of a paginated wrapper.
 */
export function wrapAsPaginated<T>(items: T[], page = 0, pageSize?: number): PaginatedResponse<T> {
  const size = pageSize ?? items.length;
  return {
    content: items,
    totalElements: items.length,
    totalPages: 1,
    size,
    number: page,
    first: true,
    last: true,
    empty: items.length === 0,
    numberOfElements: items.length,
    pageable: {
      offset: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      pageNumber: page,
      pageSize: size,
      paged: true,
      unpaged: false,
    },
    sort: { empty: true, sorted: false, unsorted: true },
  };
}
