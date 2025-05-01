import AppLayout from '@/layouts/app-layout';
import { PageFilter, PageProps, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import { Pencil, Trash2, List} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { CAlertDialog } from '@/components/c-alert-dialog';
import { ContentTitle } from '@/components/content-title';
import { CButtonIcon } from '@/components/ui/c-button';
import { CustomTable } from '@/components/ui/c-table';
import { EntriesSelector } from '@/components/ui/entries-selector';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { SearchInputMenu } from '@/components/ui/search-input-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori Ujian',
        href: '/master-data/kategori-ujian',
    },
];

interface User {
    kode: number;
    nama: string;
    email: string;
    roles: { nam: string }[];
    [x: string]: number | string | { nam: string }[]; // Adjusted index signature
}

export default function UserManager() {
    const { data: userData, filters, flash } = usePage<PageProps<User>>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Paket Soal" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ContentTitle title="Data Paket Soal" showButton onButtonClick={() => router.visit(route('master-data.kategori-ujian.create'))} />
                <div className="mt-4 flex items-center justify-between">
                    <EntriesSelector currentValue={userData.per_page} options={[10, 12, 25, 50, 100]} routeName="master-data.kategori-ujian.manager" />
                    <SearchInputMenu defaultValue={filters.search} routeName="master-data.kategori-ujian.manager" />
                </div>
                <UserTable data={userData} pageFilters={filters} />
            </div>
        </AppLayout>
    );
}



function UserTable({ data: userData, pageFilters: filters }: { data: PaginatedResponse<User>; pageFilters: PageFilter }) {
    const [open, setOpen] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const handleDelete = (kode: number) => {
        setTargetId(kode);
        setOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (targetId !== null) {
                router.delete(route('master-data.kategori-ujian.destroy', targetId), {
                    preserveState: true,
                    preserveScroll: true,
                });                
            }
        } catch {
            toast.error('Unexpected error occurred');
        } finally {
            setOpen(false);
        }
    };

    // Helper function to navigate with preserved search parameters
    const navigateToPage = (page: number) => {
        router.visit(route('master-data.kategori-ujian.manager'), {
            data: {
                page: page,
                search: filters.search,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const columns = [
        {
            label: 'No',
            className: 'w-[100px] text-center',
            render: (row: User) => (
                <div className="text-center font-medium">{(userData.current_page - 1) * userData.per_page + userData.data.indexOf(row) + 1}</div>
            ),
        },
        {
            label: 'Paket Soal',
            className: 'w-[800px] text-center',
            render: (user: User) => user.nama,
        },
        {
            label: 'Total Soal', // Tambahkan kolom baru
            className: 'w-[200px] text-center',
            render: (user: User) => (
                <div className="text-center font-medium">
                    {Array.isArray(user.match_soal_count)
                        ? user.match_soal_count.map(item => item.nam).join(', ')
                        : user.match_soal_count}
                </div>
        ),
        },
        {
            label: 'Action',
            className: 'w-[100px] text-center',
            render: (user: User) => (
                <div className="flex justify-center gap-2">
                    <CButtonIcon icon={List} type="primary" onClick={() => router.visit(route('master-data.kategori-ujian.show', user.kode))} className="bg-yellow-500" />
                    <CButtonIcon icon={Pencil} onClick={() => router.visit(route('master-data.kategori-ujian.edit', user.kode))} />
                    <CButtonIcon icon={Trash2} type="danger" onClick={() => handleDelete(user.kode)} />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex flex-col gap-4">
                <CustomTable columns={columns} data={userData.data} />

                <PaginationWrapper
                    currentPage={userData.current_page}
                    lastPage={userData.last_page}
                    perPage={userData.per_page}
                    total={userData.total}
                    onNavigate={navigateToPage}
                />
            </div>

            <CAlertDialog open={open} setOpen={setOpen} onContinue={confirmDelete} />
        </>
    );
}
