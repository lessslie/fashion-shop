import { PaginatedResponse, PaginationMeta } from '../interfaces/pagination.interface';
import { PaginationDto } from '../dto/pagination.dto';

export function createPaginatedResponse<T>(
  data: T[],
  totalItems: number,
  paginationDto: PaginationDto,
): PaginatedResponse<T> {
  const { page, limit } = paginationDto;
  const totalPages = Math.ceil(totalItems / limit);

  const meta: PaginationMeta = {
    currentPage: page,
    itemsPerPage: limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };

  return {
    data,
    meta,
  };
}
