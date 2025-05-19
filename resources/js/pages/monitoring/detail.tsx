import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

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
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Detail Ujian</h1>
                    <Link href="/monitoring-ujian">
                        <Button variant="default">Kembali</Button>
                    </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-600">Tipe Ujian</h3>
                            <p className="mt-1">{ujian.tipe_ujian}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Paket Ujian</h3>
                            <p className="mt-1">{ujian.paket_ujian}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Kelompok</h3>
                            <p className="mt-1">{ujian.kelas_prodi}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Tanggal Ujian</h3>
                            <p className="mt-1">{ujian.tanggal_ujian}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Waktu Mulai</h3>
                            <p className="mt-1">{ujian.mulai}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Waktu Selesai</h3>
                            <p className="mt-1">{ujian.selesai}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Kuota</h3>
                            <p className="mt-1">{ujian.kuota}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-600">Tipe</h3>
                            <p className="mt-1">
                                <span className={`inline-block rounded-md px-2 py-1 text-xs ${ujian.tipe === 'Remidi' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {ujian.tipe}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}