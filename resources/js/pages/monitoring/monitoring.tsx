import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

// Define interfaces for data types
interface Ujian {
    id: number;
    tipe_ujian: string;
    paket_ujian: string;
    kelas_prodi: string;
    tanggal_ujian: string;
    mulai: string;
    selesai: string;
    kuota: number;
    tipe: string;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    data: Ujian[];
}

interface Props {
    ujianList: PaginationData;
    filters: {
        search: string;
        perPage: number;
        page: number;
    };
}

export default function Monitoring({ ujianList, filters }: Props) {
    const [pageSize, setPageSize] = useState<number>(filters.perPage);
    const [currentPage, setCurrentPage] = useState<number>(filters.page);
    const [searchTerm, setSearchTerm] = useState<string>(filters.search || '');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        router.get('/monitoring-ujian', {
            search: e.target.value,
            perPage: pageSize,
            page: 1
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePageSizeChange = (value: string) => {
        const newSize = parseInt(value);
        setPageSize(newSize);
        router.get('/monitoring-ujian', {
            search: searchTerm,
            perPage: newSize,
            page: 1
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        router.get('/monitoring-ujian', {
            search: searchTerm,
            perPage: pageSize,
            page: page
        }, {
            preserveState: true,
            replace: true,
        });
    };
    
    // Function to render badge based on tipe value
    const renderTipeBadge = (tipe: string) => {
        const badgeClass = tipe === 'Remidi' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800';
        
        return (
            <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${badgeClass}`}>
                {tipe}
            </span>
        );
    };

    const breadcrumbs = [
        {
            title: 'Monitoring Ujian',
            href: '/monitoring-ujian',
        }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Monitoring Ujian" />
            
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Monitoring Ujian</h1>
                    <Link href="/dashboard">
                        <Button variant="default">Kembali</Button>
                    </Link>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span>Show</span>
                        <Select
                            value={pageSize.toString()}
                            onValueChange={handlePageSizeChange}
                        >
                            <SelectTrigger className="w-16">
                                <SelectValue placeholder="10" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                        <span>entries</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Input
                            type="search"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-64"
                        />
                    </div>
                </div>
                
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Tipe Ujian</TableHead>
                                <TableHead>Paket Ujian</TableHead>
                                <TableHead>Kelompok</TableHead>
                                <TableHead>Tanggal Ujian</TableHead>
                                <TableHead>Mulai</TableHead>
                                <TableHead>Selesai</TableHead>
                                <TableHead>Kuota</TableHead>
                                <TableHead>Tipe</TableHead>
                                <TableHead className="text-right w-[80px]">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ujianList.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center p-4">
                                        No data found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                ujianList.data.map((ujian) => (
                                    <TableRow key={ujian.id}>
                                        <TableCell>{ujian.tipe_ujian}</TableCell>
                                        <TableCell>{ujian.paket_ujian}</TableCell>
                                        <TableCell>{ujian.kelas_prodi}</TableCell>
                                        <TableCell>{ujian.tanggal_ujian}</TableCell>
                                        <TableCell>{ujian.mulai}</TableCell>
                                        <TableCell>{ujian.selesai}</TableCell>
                                        <TableCell>{ujian.kuota}</TableCell>
                                        <TableCell>
                                            {renderTipeBadge(ujian.tipe)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link href={`/monitoring-ujian/${ujian.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                        <path d="m9 18 6-6-6-6"/>
                                                    </svg>
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {ujianList.data.length > 0 ? (ujianList.current_page - 1) * ujianList.per_page + 1 : 0} to {Math.min(ujianList.current_page * ujianList.per_page, ujianList.total)} of {ujianList.total} entries
                    </p>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) handlePageChange(currentPage - 1);
                                    }}
                                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            
                            {Array.from({ length: ujianList.last_page }).map((_, index) => {
                                const page = index + 1;
                                // Show current page, first, last, and pages close to current
                                if (
                                    page === 1 || 
                                    page === ujianList.last_page || 
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handlePageChange(page);
                                                }}
                                                isActive={page === currentPage}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                
                                // Add ellipsis for gaps
                                if (
                                    (page === 2 && currentPage > 3) || 
                                    (page === ujianList.last_page - 1 && currentPage < ujianList.last_page - 2)
                                ) {
                                    return (
                                        <PaginationItem key={page}>
                                            <PaginationLink href="#" onClick={(e) => e.preventDefault()}>
                                                ...
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                }
                                
                                return null;
                            })}
                            
                            <PaginationItem>
                                <PaginationNext 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < ujianList.last_page) handlePageChange(currentPage + 1);
                                    }}
                                    className={currentPage === ujianList.last_page ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </AppLayout>
    );
}