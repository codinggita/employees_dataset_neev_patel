import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  TableSortLabel,
  Pagination,
  Box,
  Skeleton,
  Typography,
} from '@mui/material';

/**
 * Custom DataTable component in Modern SaaS style.
 * Includes sortable headers, pagination, skeleton loader, and empty state.
 */
export default function DataTable({
  columns,
  rows = [],
  loading = false,
  page = 1,
  totalPages = 1,
  onPageChange,
  onSortChange,
  sortField,
  sortOrder = 'asc',
  sx = {},
  ...props
}) {
  const handleSort = (field) => {
    if (!onSortChange) return;
    const isAsc = sortField === field && sortOrder === 'asc';
    onSortChange(field, isAsc ? 'desc' : 'asc');
  };

  const handlePageChange = (event, value) => {
    if (onPageChange) onPageChange(value);
  };

  const renderSkeletons = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {columns.map((col, colIndex) => (
          <TableCell key={`col-skeleton-${colIndex}`} sx={{ py: 2.5 }}>
            <Skeleton variant="text" width="80%" height={24} />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '16px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          ...sx,
        }}
        {...props}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light' ? '#F8F9FC' : 'rgba(255, 255, 255, 0.02)',
              }}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.field}
                  sx={{
                    fontWeight: 600,
                    color: 'text.secondary',
                    py: 2,
                  }}
                >
                  {onSortChange && col.sortable !== false ? (
                    <TableSortLabel
                      active={sortField === col.field}
                      direction={sortField === col.field ? sortOrder : 'asc'}
                      onClick={() => handleSort(col.field)}
                    >
                      {col.headerName}
                    </TableSortLabel>
                  ) : (
                    col.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              renderSkeletons()
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    No records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id || rowIndex}
                  hover
                  sx={{
                    transition: 'background-color 0.2s',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell key={`${rowIndex}-${col.field}`} sx={{ py: 2 }}>
                      {col.render ? col.render(row) : row[col.field]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="large"
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '8px',
                fontWeight: 600,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
