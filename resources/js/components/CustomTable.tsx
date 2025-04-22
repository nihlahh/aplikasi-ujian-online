import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Column<T> {
    key: keyof T | string;
    title: string;
    render?: (item: T) => React.ReactNode;
}

interface CustomTableProps<T> {
    columns: Column<T>[];
    data: T[];
}

export default function CustomTable<T>({ columns, data }: CustomTableProps<T>) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((col, idx) => (
                        <TableHead key={idx}>{col.title}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, rowIdx) => (
                    <TableRow key={rowIdx}>
                        {columns.map((col, colIdx) => (
                            <TableCell key={colIdx}>
                                {col.render ? col.render(item) : (item as any)[col.key]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
