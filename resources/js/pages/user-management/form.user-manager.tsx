import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger,
} from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { CButton } from '@/components/ui/c-button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, Role, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'User Manager',
        href: '/user-management/user',
    },
    {
        title: 'Edit',
        href: '/edit',
    },
];

const formSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
    email: z.string().min(2, {
        message: 'Email must be at least 2 characters.',
    }),
    roles: z.array(z.string()).nonempty('Please at least one item'),
});

export default function Dashboard() {
    const { user, allRoles } = usePage<{ user: User; allRoles: Role[] }>().props;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: user.name,
            email: user.email,
            roles: user.roles,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        router.put(
            route('user-management.user.update', user.id),
            {
                name: values.username,
                email: values.email,
                roles: values.roles,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('User updated successfully!');
                },
                onError: (errors) => {
                    console.error('Error:', errors);
                },
            },
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-between flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit User</h1>
                    <CButton type="primary" className="md:w-24" onClick={() => router.visit(route('user-management.user.manager'))}>
                        Back
                    </CButton>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Roles</FormLabel>
                                    <FormControl>
                                        <MultiSelector values={field.value} onValuesChange={field.onChange} loop className="max-w-xs">
                                            <MultiSelectorTrigger>
                                                <MultiSelectorInput placeholder="Select roles" />
                                            </MultiSelectorTrigger>
                                            <MultiSelectorContent>
                                                <MultiSelectorList>
                                                    {allRoles.map((role) => (
                                                        <MultiSelectorItem key={role.id} value={role.name}>
                                                            {role.name}
                                                        </MultiSelectorItem>
                                                    ))}
                                                </MultiSelectorList>
                                            </MultiSelectorContent>
                                        </MultiSelector>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="bg-button-primary cursor-pointer text-white shadow transition-colors hover:bg-[#475873]">
                            Save
                        </Button>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
