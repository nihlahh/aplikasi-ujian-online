import { CButton } from '@/components/ui/c-button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface UserWithPassword extends User {
    nama: string; // Ensure nama is explicitly typed as string
    password: string;
    kategoriUjian: string; // Ensure kategoriUjian is explicitly typed as string
    type: string; // Ensure type is explicitly typed as string
}

const formSchema = z.object({
    nama: z.string().min(2, {
        message: 'Nama harus memiliki minimal 2 karakter.',
    }),
    type: z.string().min(1, {
        message: 'Type harus diisi.',
    }),
    kategoriUjian: z.string().nonempty('Pilih kategori ujian.'), // Ubah menjadi string
});

export default function Dashboard() {
    const { user, allCategories } = usePage<{ user: UserWithPassword; allCategories: { id: string; name: string }[] }>().props;
    const isEdit = !!user;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Kategori Ujian',
            href: '/master-data/kategori-ujian',
        },
        {
            title: isEdit ? 'Edit' : 'Create',
            href: isEdit ? '/edit' : '/create',
        },
    ];

    const form = useForm<{
        nama: string;
        type: string;
        kategoriUjian: string;
    }, undefined, {
        nama: string;
        type: string;
        kategoriUjian: string;
    }>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: user?.nama || '',
            type: user?.type || '',
            kategoriUjian: user?.kategoriUjian || '', // Pastikan nilai default diatur
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        if (isEdit) {
            router.put(
                route('master-data.kategori-ujian.update', user.id),
                {
                    nama: values.nama,
                    type: values.type,
                    kategoriUjian: values.kategoriUjian, // Kirim kategori ujian sebagai string
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Bidang berhasil diperbarui!');
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                        if (errors.kategoriUjian) {
                            toast.error(errors.kategoriUjian);
                        }
                    },
                },
            );
        } else {
            router.post(
                route('master-data.kategori-ujian.store'),
                {
                    nama: values.nama,
                    type: values.type,
                    kategoriUjian: values.kategoriUjian, // Kirim kategori ujian sebagai string
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Bidang berhasil dibuat!');
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                        if (errors.kategoriUjian) {
                            toast.error(errors.kategoriUjian);
                        }
                    },
                },
            );
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-between flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{isEdit ? 'Edit' : ''} Tambah Judul Soal</h1>
                    <CButton type="primary" className="md:w-24" onClick={() => router.visit(route('master-data.kategori-ujian.manager'))}>
                        Back
                    </CButton>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="kategoriUjian"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori Ujian</FormLabel>
                                    <FormControl>
                                        <select
                                            {...field}
                                            className="form-select max-w-xs"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>
                                                Pilih Kategori Ujian
                                            </option>
                                            {allCategories.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <CButton type="submit">Save</CButton>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
}
