import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

import CButtonIcon from '@/components/ui/c-button-icon';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Search, Trash2 } from 'lucide-react';

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

type PageProps = {
    users: PaginatedUsers;
    filters: UserFilter;
};

function handleDelete(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
        router.delete(route('user-management.user.destroy', id), {
            preserveState: true,
            preserveScroll: true,
        });
    }
}

export default function MasterMatakuliah() {
    const { users, filters } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Manager" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-xl font-bold">User List</h1>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <p>Show</p>
                        <Select
                            value={String(users.per_page)}
                            onValueChange={(value) => {
                                router.visit(route('user-management.user.manager'), {
                                    data: { pages: value },
                                    preserveState: true,
                                    preserveScroll: true,
                                });
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={String(users.per_page)} />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 12, 25, 50, 100].map((option) => (
                                    <SelectItem key={option} value={String(option)}>
                                        {option}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <p>entries</p>
                    </div>
                    <div className="relative w-[300px]">
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-10"
                            defaultValue={filters.search}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    router.visit(route('user-management.user.manager'), {
                                        data: { search: (e.target as HTMLInputElement).value },
                                        preserveState: true,
                                        preserveScroll: true,
                                    });
                                }
                            }}
                            // onChange={(e) => {
                            //     router.visit(route('user-management.user.manager'), {
                            //         data: { search: e.target.value },
                            //         preserveState: true,
                            //         preserveScroll: true,
                            //     });
                            // }}
                        />
                        <Search className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform" />
                    </div>
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

function renderPaginationLinks(links: PaginatedUsers['links'], currentPage: number) {
    const filteredLinks = [];
    const totalPages = links.length - 2;

    // Always include prev link
    filteredLinks.push(links[0]);

    // Show exactly 3 page numbers centered around current page when possible
    let start = Math.max(1, currentPage - 1);
    const end = Math.min(start + 2, totalPages);

    // Adjust start if we hit the end boundary
    if (end - start < 2) {
        start = Math.max(1, end - 2);
    }

    // Add the 3 page numbers (or fewer if totalPages < 3)
    for (let i = start; i <= end; i++) {
        filteredLinks.push(links[i]);
    }

    // Always include next link
    filteredLinks.push(links[links.length - 1]);

    return filteredLinks;
}

function UserTable({ props: users }: { props: PaginatedUsers }) {
    const data = users.data;
    const paginationLinks = renderPaginationLinks(users.links, users.current_page);

    return (
        <div className="flex flex-col gap-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px] text-center">Number</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Roles</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell className="text-center font-medium">{user.id}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{RoleDecorator(user.roles.map((role) => role.name).join(', '))}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
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
                            {paginationLinks.map((link, i) => {
                                if (link.label === '...') {
                                    return (
                                        <PaginationItem key={i}>
                                            <span className="text-muted-foreground flex h-9 w-9 items-center justify-center text-sm">...</span>
                                        </PaginationItem>
                                    );
                                }

                                const isPrev = link.label.toLowerCase().includes('previous');
                                const isNext = link.label.toLowerCase().includes('next');
                                const isDisabled = !link.url;
                                const baseClasses = isDisabled
                                    ? 'pointer-events-none opacity-50 select-none'
                                    : 'cursor-pointer hover:bg-muted select-none';

                                if (isPrev) {
                                    return (
                                        <PaginationItem key={i}>
                                            <PaginationPrevious
                                                onClick={() => link.url && router.visit(link.url)}
                                                className={`${baseClasses} border-border border transition-colors select-none`}
                                            />
                                        </PaginationItem>
                                    );
                                }

                                if (isNext) {
                                    return (
                                        <PaginationItem key={i}>
                                            <PaginationNext
                                                onClick={() => link.url && router.visit(link.url)}
                                                className={`${baseClasses} border-border border transition-colors select-none`}
                                            />
                                        </PaginationItem>
                                    );
                                }

                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            onClick={() => link.url && router.visit(link.url)}
                                            isActive={link.active}
                                            className={
                                                link.active
                                                    ? 'bg-button-primary border-button-primary border text-white select-none'
                                                    : `${baseClasses} border-border border select-none`
                                            }
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    </PaginationItem>
                                );
                            })}
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}
