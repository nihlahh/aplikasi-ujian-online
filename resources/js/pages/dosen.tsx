import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import CustomTable from '@/components/CustomTable';
import { CAlertDialog } from '@/components/c-alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import CButtonIcon from '@/components/ui/c-button-icon';
import PaginationWrapper from '@/components/ui/pagination-wrapper'; 

interface Lecturer {
    id: number;
    name: string;
    email: string;
}

interface PaginatedLecturers {
    data: Lecturer[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

type PageProps = {
    lecturers: PaginatedLecturers;
    filters: {
        search: string;
    };
    flash: {
        success?: string;
        error?: string;
    };
};

export default function LecturerManager() {
    const { lecturers, filters, flash } = usePage<PageProps>().props;

    const [open, setOpen] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    const confirmDelete = async () => {
        if (targetId !== null) {
            await router.delete(route('user-management.lecturer.destroy', targetId), {
                preserveState: true,
                preserveScroll: true,
            });
            setOpen(false);
        }
    };

    const navigateToPage = (page: number) => {
        router.visit(route('user-management.lecturer.manager'), {
            data: {
                page,
                search: filters.search,
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const columns = [
        { title: 'ID', key: 'id' },
        { title: 'Name', key: 'name' },
        { title: 'Email', key: 'email' },
        {
            title: 'Actions',
            key: 'actions',
            render: (item: Lecturer) => (
                <div className="flex gap-2 justify-center">
                    <CButtonIcon icon={Pencil} type="primary" onClick={() => router.visit(route('user-management.lecturer.edit', item.id))} />
                    <CButtonIcon icon={Trash2} type="danger" onClick={() => { setOpen(true); setTargetId(item.id); }} />
                </div>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Lecturer Manager" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-xl font-bold">Lecturer List</h1>

                <CustomTable columns={columns} data={lecturers.data} />

                <PaginationWrapper
                    currentPage={lecturers.current_page}
                    lastPage={lecturers.last_page}
                    perPage={lecturers.per_page}
                    total={lecturers.total}
                    onNavigate={navigateToPage}
                />
            </div>

            <CAlertDialog open={open} setOpen={setOpen} onContinue={confirmDelete} />
        </AppLayout>
    );
}
