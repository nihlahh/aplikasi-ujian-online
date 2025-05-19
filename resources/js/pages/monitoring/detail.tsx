import { ContentTitle } from '@/components/content-title';
import { StatCard } from '@/components/stat-card';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

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

interface Props {
    ujian: Ujian;
}

export default function Detail({ ujian }: Props) {
    const breadcrumbs = [
        {
            title: 'Monitoring Ujian',
            href: '/monitoring-ujian',
        },
        {
            title: 'Detail',
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail ${ujian.paket_ujian}`} />

            <div className="flex flex-col gap-4 p-4">
                <ContentTitle
                    title="User Manager"
                    showButton
                    showIcon={false}
                    buttonText="Kembali"
                    onButtonClick={() => router.visit(route('monitoring.ujian'))}
                />

                <Card className="flex flex-col gap-4 p-4">
                    <CardHeader>
                        <CardTitle className="text-2xl">{ujian.paket_ujian}</CardTitle>
                        <CardDescription>{ujian.tipe_ujian}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex w-full gap-2">
                            <StatCard title="Total Student" value="500" />
                            <StatCard title="Total Active Student" value="364" />
                            <StatCard title="Total Finished Student" value="200" />
                        </div>
                    </CardContent>
                    <CardFooter />
                </Card>
            </div>
        </AppLayout>
    );
}
