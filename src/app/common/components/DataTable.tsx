// components/DataTable.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  Box,
  alpha,
} from '@mui/material';

type Column<T> = {
  key: keyof T;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: (value: any) => React.ReactNode;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  title?: string;
  noDataMessage?: string;
  defaultRowsPerPage?: number;
  onRowClick?: (row: T) => void;
  actionColumn?: {
    header: string;
    render: (row: T) => React.ReactNode;
  };
};

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  title,
  noDataMessage = 'No data available',
  defaultRowsPerPage = 5,
  onRowClick,
  actionColumn,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // ✅ Reset page to 0 whenever data changes
  useEffect(() => {
    setPage(0);
  }, [data]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // ✅ Paginate data
  const paginatedData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <section className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-xl">
      {/* Title */}
      {title && (
        <Box
          sx={{
            px: 1.5,
            py: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.default',
          }}
        >
          <Typography variant="h6" className="text-base font-semibold text-gray-800">
            {title}
          </Typography>
        </Box>
      )}

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 'none',
          borderRadius: 0,
          maxHeight: 560,
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-track': { background: '#f1f5f9' },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: 3,
          },
        }}
      >
        <Table stickyHeader aria-label="data table">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={String(col.key)}
                  align={col.align || 'left'}
                  sx={{
                    fontWeight: 600,
                    color: '#475569',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backgroundColor: '#f8fafc',
                    padding: '10px 12px',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
              {actionColumn && (
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 600,
                    color: '#475569',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    backgroundColor: '#f8fafc',
                    padding: '10px 12px',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  {actionColumn.header}
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <TableRow
                  key={index}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: `${alpha('#3b82f6', 0.08)} !important`,
                    },
                    // ✅ Alternating Row Shading
                    backgroundColor: index % 2 === 0 ? '#f0f1f2' : 'white',
                    transition: 'background-color 0.2s',
                    height: '50px',
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      align={col.align || 'left'}
                      sx={{
                        padding: '10px 12px',
                        borderBottom: '1px solid #f1f5f9',
                        fontSize: '0.875rem',
                        color: 'text.secondary',
                        fontFamily: col.key === 'accountNumber' ? 'monospace' : 'inherit',
                      }}
                    >
                      {col.render
                        ? col.render(row)
                        : col.format
                        ? col.format(row[col.key])
                        : String(row[col.key] ?? '–')}
                    </TableCell>
                  ))}
                  {actionColumn && (
                    <TableCell
                      align="center"
                      sx={{
                        padding: '10px 12px',
                        borderBottom: '1px solidrgb(69, 107, 146)',
                      }}
                    >
                      {actionColumn.render(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actionColumn ? 1 : 0)}
                  align="center"
                  sx={{
                    py: 5,
                    color: '#64748b',
                    fontStyle: 'italic',
                    fontSize: '0.9rem',
                    backgroundColor: '#808991',
                  }}
                >
                  {noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          fontWeight: 500,
          color: '#475569',
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: '0.875rem',
            fontWeight: 500,
          },
          '& .MuiTablePagination-actions': {
            fontSize: '1.25rem',
          },
        }}
      />
    </section>
  );
}