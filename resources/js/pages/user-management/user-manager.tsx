import AppLayout from '@/layouts/app-layout';
import { FlashProps, PageFilter, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import { CAlertDialog } from '@/components/c-alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { ContentTitle } from '@/components/content-title';
import { CButtonIcon } from '@/components/ui/c-button';
import { CustomTable } from '@/components/ui/c-table';
import { EntriesSelector } from '@/components/ui/entries-selector';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { SearchInputMenu } from '@/components/ui/search-input-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Manager',
        href: '/user-management/user',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
}

type PageProps = {
    users: PaginatedResponse<User>;
    filters: PageFilter;
    flash: FlashProps;
};

export default function UserManager() {
    const { users, filters, flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Manager" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <ContentTitle title="User Manager" showButton />
                <div className="mt-4 flex items-center justify-between">
                    <EntriesSelector currentValue={users.per_page} options={[10, 12, 25, 50, 100]} routeName="user-management.user.manager" />
                    <SearchInputMenu defaultValue={filters.search} routeName="user-management.user.manager" />
                </div>
                <UserTable props={users} />
            </div>
        </AppLayout>
    );
}

const RoleDecorator: React.FC<{ role: string }> = ({ role }) => {
    switch (role) {
        case 'super_admin':
            return <span className="bg-button-danger mr-2 rounded p-2 text-white shadow">{role}</span>;
        case 'admin':
            return <span className="mr-2 rounded bg-yellow-500 p-2 text-white shadow">{role}</span>;
        default:
            return <span className="mr-2 text-white">{role}</span>;
    }
};

function UserTable({ props: users }: { props: PaginatedResponse<User> }) {
    const { filters } = usePage<PageProps>().props;

    const [open, setOpen] = useState(false);
    const [targetId, setTargetId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setTargetId(id);
        setOpen(true);
    };

    const confirmDelete = async () => {
        try {
            if (targetId !== null) {
                await router.delete(route('user-management.user.destroy', targetId), {
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
        router.visit(route('user-management.user.manager'), {
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
            label: 'Number',
            className: 'w-[100px]',
            render: (user: User) => <div className="text-center font-medium">{user.id}</div>,
        },
        {
            label: 'Name',
            className: 'w-[400px]',
            render: (user: User) => user.name,
        },
        {
            label: 'Email',
            className: 'w-[400px]',
            render: (user: User) => user.email,
        },
        {
            label: 'Roles',
            render: (user: User) => (
                <div className="flex flex-wrap gap-1">
                    {user.roles.map((r) => (
                        <RoleDecorator key={r.name} role={r.name} />
                    ))}
                </div>
            ),
        },
        {
            label: 'Action',
            className: 'w-[100px]',
            render: (user: User) => (
                <div className="flex justify-center gap-2">
                    <CButtonIcon icon={Pencil} onClick={() => router.visit(route('user-management.user.edit', user.id))} />
                    <CButtonIcon icon={Trash2} type="danger" onClick={() => handleDelete(user.id)} />
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="flex flex-col gap-4">
                <CustomTable columns={columns} data={users.data} />

                <PaginationWrapper
                    currentPage={users.current_page}
                    lastPage={users.last_page}
                    perPage={users.per_page}
                    total={users.total}
                    onNavigate={navigateToPage}
                />
            </div>

            <CAlertDialog open={open} setOpen={setOpen} onContinue={confirmDelete} />
        </>
    );
}
