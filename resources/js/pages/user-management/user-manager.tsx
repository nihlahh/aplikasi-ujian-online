import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Manager',
        href: '/user',
    },
];

type User = {
    id: number;
    name: string;
    email: string;
    roles: { name: string }[];
};

type PageProps = {
    users: User[];
};

export default function MasterMatakuliah() {
    const { users } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Manager" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <UserTable props={users} />
                {/* <button className="rounded bg-yellow-200 p-8" onClick={() => router.visit(route('monitoring.ujian'))}>
                    Click Me
                </button> */}
            </div>
        </AppLayout>
    );
}

function RoleDecorator(role: string) {
    switch (role) {
        case 'super_admin':
            return <span className="rounded bg-red-600 p-2 text-white shadow">{role}</span>;
        case 'admin':
            return <span className="rounded bg-yellow-500 p-2 text-white shadow">{role}</span>;
        default:
            return <span className="text-white">{role}</span>;
    }
}

function UserTable({ props: users }: { props: User[] }) {
    return (
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
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="text-center font-medium">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{RoleDecorator(user.roles.map((role) => role.name).join(', '))}</TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <button className="cursor-pointer rounded bg-blue-300 p-2 text-white shadow">
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button className="cursor-pointer rounded bg-red-800 p-2 text-white shadow">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
