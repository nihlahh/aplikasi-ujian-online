import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import CButtonIcon from '@/components/ui/c-button-icon';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { CAlertDialog } from '@/components/c-alert-dialog';
import { ChevronsLeftIcon, ChevronsRightIcon, Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { EntriesSelector } from '@/components/ui/entries-selector';
import { SearchInputMenu } from '@/components/ui/search-input-menu';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Manager',
        href: '/user',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
}

interface UserFilter {
    search: string;
    pages: number;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface FlashProps {
    success?: string;
    error?: string;
}

type PageProps = {
    users: PaginatedUsers;
    filters: UserFilter;
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
                <h1 className="text-xl font-bold">User List</h1>
                <div className="flex items-center justify-between">
                    <EntriesSelector currentValue={users.per_page} options={[10, 12, 25, 50, 100]} routeName="user-management.user.manager" />
                    <SearchInputMenu defaultValue={filters.search} routeName="user-management.user.manager" />
                </div>
                <UserTable props={users} />
            </div>
        </AppLayout>
    );
}

function RoleDecorator(role: string) {
    switch (role) {
        case 'super_admin':
            return <span className="bg-button-danger rounded p-2 text-white shadow">{role}</span>;
        case 'admin':
            return <span className="rounded bg-yellow-500 p-2 text-white shadow">{role}</span>;
        default:
            return <span className="text-white">{role}</span>;
    }
}

function UserTable({ props: users }: { props: PaginatedUsers }) {
    const data = users.data;

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

    return (
        <>
            <div className="flex flex-col gap-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px] text-center">Number</TableHead>
                            <TableHead className="w-[400px]">Name</TableHead>
                            <TableHead className="w-[400px]">Email</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead className="w-[100px] text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="text-center font-medium">{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{RoleDecorator(user.roles.map((role) => role.name).join(', '))}</TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-2">
                                        <CButtonIcon icon={Pencil} type="primary" />
                                        <CButtonIcon icon={Trash2} type="danger" onClick={() => handleDelete(user.id)} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-muted-foreground text-sm sm:order-1">
                        Showing {Math.min(users.current_page * users.per_page, users.total)} of {users.total} entries
                    </div>

                    <div className="flex w-full justify-end sm:order-2 sm:w-auto">
                        <Pagination>
                            <PaginationContent>
                                {/* Previous Page Link */}
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (users.current_page > 1) {
                                                router.visit(route('user-management.user.manager'), {
                                                    data: { page: users.current_page - 1 },
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }
                                        }}
                                        className={
                                            users.current_page <= 1 ? 'pointer-events-none opacity-50 select-none' : 'cursor-pointer select-none'
                                        }
                                    />
                                </PaginationItem>
                                <PaginationItem key="back-forward">
                                    <PaginationLink
                                        className="cursor-pointer select-none"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.visit(route('user-management.user.manager'), {
                                                data: { page: 1 },
                                                preserveState: true,
                                                preserveScroll: true,
                                            });
                                        }}
                                    >
                                        <ChevronsLeftIcon />
                                    </PaginationLink>
                                </PaginationItem>

                                {/* Render Page Links */}
                                {(() => {
                                    const displayPages = [];
                                    const currentPage = users.current_page;
                                    const lastPage = users.last_page;

                                    // Show only 3 pages at most: current, previous, next
                                    // Or first, current, last if at boundaries

                                    // Case: 3 or fewer total pages - show all
                                    if (lastPage <= 3) {
                                        for (let i = 1; i <= lastPage; i++) {
                                            displayPages.push(
                                                <PaginationItem key={`page-${i}`}>
                                                    <PaginationLink
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.visit(route('user-management.user.manager'), {
                                                                data: { page: i },
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }}
                                                        isActive={currentPage === i}
                                                    >
                                                        {i}
                                                    </PaginationLink>
                                                </PaginationItem>,
                                            );
                                        }
                                    }
                                    // Case: More than 3 pages
                                    else {
                                        // First page
                                        if (currentPage === 1) {
                                            // Show pages 1, 2, and then ellipsis
                                            displayPages.push(
                                                <PaginationItem key="page-1">
                                                    <PaginationLink
                                                        onClick={(e) => e.preventDefault()}
                                                        isActive={true}
                                                        className="bg-button-primary hover:bg-button-primary/90 text-white select-none"
                                                    >
                                                        1
                                                    </PaginationLink>
                                                </PaginationItem>,
                                                <PaginationItem key="page-2">
                                                    <PaginationLink
                                                        className="cursor-pointer select-none"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.visit(route('user-management.user.manager'), {
                                                                data: { page: 2 },
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }}
                                                    >
                                                        2
                                                    </PaginationLink>
                                                </PaginationItem>,
                                                <PaginationItem key="ellipsis">
                                                    <PaginationEllipsis />
                                                </PaginationItem>,
                                            );
                                        }
                                        // Last page
                                        else if (currentPage === lastPage) {
                                            // Show ellipsis and then last-1, last
                                            displayPages.push(
                                                <PaginationItem key="ellipsis">
                                                    <PaginationEllipsis />
                                                </PaginationItem>,
                                                <PaginationItem key={`page-${lastPage - 1}`}>
                                                    <PaginationLink
                                                        className="cursor-pointer select-none"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.visit(route('user-management.user.manager'), {
                                                                data: { page: lastPage - 1 },
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }}
                                                    >
                                                        {lastPage - 1}
                                                    </PaginationLink>
                                                </PaginationItem>,
                                                <PaginationItem key={`page-${lastPage}`}>
                                                    <PaginationLink
                                                        onClick={(e) => e.preventDefault()}
                                                        isActive={true}
                                                        className="bg-button-primary hover:bg-button-primary/90 cursor-pointer text-white select-none"
                                                    >
                                                        {lastPage}
                                                    </PaginationLink>
                                                </PaginationItem>,
                                            );
                                        }
                                        // Middle pages
                                        else {
                                            // Show current-1, current, current+1
                                            displayPages.push(
                                                <PaginationItem key={`page-${currentPage - 1}`}>
                                                    <PaginationLink
                                                        className="cursor-pointer select-none"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.visit(route('user-management.user.manager'), {
                                                                data: { page: currentPage - 1 },
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }}
                                                    >
                                                        {currentPage - 1}
                                                    </PaginationLink>
                                                </PaginationItem>,
                                                <PaginationItem key={`page-${currentPage}`}>
                                                    <PaginationLink
                                                        onClick={(e) => e.preventDefault()}
                                                        isActive={true}
                                                        className="bg-button-primary hover:bg-button-primary/90 cursor-pointer text-white select-none"
                                                    >
                                                        {currentPage}
                                                    </PaginationLink>
                                                </PaginationItem>,
                                                <PaginationItem key={`page-${currentPage + 1}`}>
                                                    <PaginationLink
                                                        className="cursor-pointer select-none"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            router.visit(route('user-management.user.manager'), {
                                                                data: { page: currentPage + 1 },
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            });
                                                        }}
                                                    >
                                                        {currentPage + 1}
                                                    </PaginationLink>
                                                </PaginationItem>,
                                            );
                                        }
                                    }

                                    return displayPages;
                                })()}

                                {/* Next Page Link */}
                                <PaginationItem key="fast-forward">
                                    <PaginationLink
                                        className="cursor-pointer select-none"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            router.visit(route('user-management.user.manager'), {
                                                data: { page: users.last_page },
                                                preserveState: true,
                                                preserveScroll: true,
                                            });
                                        }}
                                    >
                                        <ChevronsRightIcon />
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (users.current_page < users.last_page) {
                                                router.visit(route('user-management.user.manager'), {
                                                    data: { page: users.current_page + 1 },
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }
                                        }}
                                        className={
                                            users.current_page >= users.last_page
                                                ? 'pointer-events-none opacity-50 select-none'
                                                : 'cursor-pointer select-none'
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>

            <CAlertDialog open={open} setOpen={setOpen} onContinue={confirmDelete} />
        </>
    );
}
