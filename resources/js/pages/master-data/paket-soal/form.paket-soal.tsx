import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
  
import { CButton } from '@/components/ui/c-button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head, router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';


const formSchema = z.object({
    nama: z.string().min(2, {
        message: 'Inputkan nama kategori ujian',
    }),
    type: z.string().optional(), // Type dari dropdown
    newType: z.string().optional(), // Type baru
    jenis_ujian: z.string().min(2, {
        message: 'Inputkan jenis ujian',
    }),
}).refine((data) => data.type || data.newType, {
    message: 'Pilih type atau masukkan type baru',
    path: ['type'], // Error akan ditampilkan di field type
});

export default function Dashboard() {
    const { bidang, typeOptions = [], jenisUjianOptions } = usePage<{
        bidang?: { kode: number; nama: string; type: string; jenis_ujian: string; };
        allCategories: { kode: string; name: string; }[];
        typeOptions: string[]; 
        jenisUjianOptions: string[];
        
    }>().props;
    const isEdit = !!bidang;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Paket Soal',
            href: '/master-data/paket-soal',
        },
        {
            title: isEdit ? 'Edit' : 'Create',
            href: isEdit ? '/edit' : '/create',
        },
    ];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nama: bidang?.nama ?? '',
            type: bidang?.type ?? '',
            jenis_ujian: bidang?.jenis_ujian ?? '', 
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const typeToSubmit = values.newType ? values.newType : values.type;
        const jenisUjianToSubmit = values.jenis_ujian;

        if (isEdit) {
            router.put(
                route('master-data.paket-soal.update', bidang.kode),
                {
                    nama: values.nama,
                    type: typeToSubmit,
                    jenis_ujian: jenisUjianToSubmit, // Kirim jenis ujian
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Kategori ujian berhasil diperbarui!');
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                    },
                }
            );
        } else {
            router.post(
                route('master-data.paket-soal.store'),
                {
                    nama: values.nama,
                    type: typeToSubmit,
                    jenis_ujian: jenisUjianToSubmit, 
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success('Kategori ujian berhasil ditambahkan!');
                    },
                    onError: (errors) => {
                        console.error('Error:', errors);
                    },
                }
            );
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="space-between flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{isEdit ? 'Edit' : 'Create'} User</h1>
                    <CButton type="primary" className="md:w-24" onClick={() => router.visit(route('master-data.paket-soal.manager'))}>
                        Back
                    </CButton>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kategori Ujian</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih atau ketik type ujian" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {typeOptions.map((type: string) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="jenis_ujian"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Jenis Ujian</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Pilih atau ketik jenis ujian" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {jenisUjianOptions.map((jenis_ujian: string) => (
                                                    <SelectItem key={jenis_ujian} value={jenis_ujian}>
                                                        {jenis_ujian}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nama"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nama paket ujian</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your username" {...field} />
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