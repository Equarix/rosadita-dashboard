import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table as TableHero,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Spinner } from "@heroui/react";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
}

export default function Table<T>({ data, columns, isLoading }: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableHero>
      <TableHeader
        columns={table
          .getHeaderGroups()
          .map((headerGroup) => headerGroup.headers)
          .flat()}
      >
        {(column) => (
          <TableColumn key={column.id}>
            {column.isPlaceholder
              ? null
              : flexRender(column.column.columnDef.header, column.getContext())}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={table.getRowModel().rows}
        isLoading={isLoading}
        loadingContent={<Spinner label="Cargando.." />}
      >
        {(row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        )}
      </TableBody>
    </TableHero>
  );
}
