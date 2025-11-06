'use client';

import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface VirtualTableProps<T> {
  data: T[];
  height: number;
  itemHeight: number;
  columns: {
    key: keyof T;
    header: string;
    width?: string;
    render?: (item: T) => React.ReactNode;
  }[];
  onItemClick?: (item: T, index: number) => void;
}

const VirtualTableRow = React.memo(function VirtualTableRow<T>({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    items: T[];
    columns: VirtualTableProps<T>['columns'];
    onItemClick?: (item: T, index: number) => void;
  };
}) {
  const { items, columns, onItemClick } = data;
  const item = items[index];

  const handleClick = useCallback(() => {
    onItemClick?.(item, index);
  }, [item, index, onItemClick]);

  return (
    <div style={style}>
      <TableRow onClick={handleClick} className="cursor-pointer hover:bg-muted/50">
        {columns.map((column) => (
          <TableCell key={String(column.key)} className={column.width}>
            {column.render ? column.render(item) : String(item[column.key])}
          </TableCell>
        ))}
      </TableRow>
    </div>
  );
});

export function VirtualTable<T>({
  data,
  height,
  itemHeight,
  columns,
  onItemClick,
}: VirtualTableProps<T>) {
  const itemData = useMemo(
    () => ({
      items: data,
      columns,
      onItemClick,
    }),
    [data, columns, onItemClick]
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.width}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>
      <div style={{ height }}>
        <List
          height={height}
          itemCount={data.length}
          itemSize={itemHeight}
          itemData={itemData}
        >
          {VirtualTableRow}
        </List>
      </div>
    </div>
  );
}