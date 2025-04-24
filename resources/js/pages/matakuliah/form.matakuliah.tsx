// Import yang diperlukan
import AppLayout from '@/layouts/app-layout';
import { PageProps, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import { toast } from 'sonner';

// Interface untuk data mata kuliah
interface Matakuliah {
  id_mk?: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
  prodi: string;
  id_dosen?: number | null;
  prasyarat?: string | null;
}

// Interface untuk form data
interface MatakuliahFormData {
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester: number;
  prodi: string;
  id_dosen: number | null;
  prasyarat: string | null;
  [key: string]: string | number | null | undefined;
}

// Interface untuk data dosen
interface Dosen {
  id: number;
  name: string;
}

// Objek default untuk matakuliah baru
const defaultMatakuliah: Matakuliah = {
  kode_mk: '',
  nama_mk: '',
  sks: 1,
  semester: 1,
  prodi: '',
  id_dosen: null,
  prasyarat: ''
};

export default function MatakuliahForm() {
  // Ambil data dari props dengan tipe data yang benar untuk dosen_list
  const { isEdit, matakuliah: serverMatakuliah, errors, flash, dosen_list = [] } = usePage<PageProps<{
    isEdit: boolean;
    matakuliah?: Partial<Matakuliah>;
    dosen_list: Dosen[];
  }>>().props;
  
  // Gabungkan data dari server dengan default untuk TypeScript safety
  const matakuliah = {
    ...defaultMatakuliah,
    ...(serverMatakuliah || {}),
  } as Matakuliah;

  // Setup breadcrumb untuk navigasi
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Manajemen Mata Kuliah',
      href: route('master-data.matakuliah.index'),
    },
    {
      title: isEdit ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah',
      href: isEdit ? route('master-data.matakuliah.edit', matakuliah.id_mk!) : route('master-data.matakuliah.create'),
    },
  ];

  // Inisialisasi form
  const form = useForm<MatakuliahFormData>({
    kode_mk: matakuliah.kode_mk,
    nama_mk: matakuliah.nama_mk,
    sks: matakuliah.sks,
    semester: matakuliah.semester,
    prodi: matakuliah.prodi,
    id_dosen: matakuliah.id_dosen ?? null,
    prasyarat: matakuliah.prasyarat ?? '',
  });

  // Tampilkan pesan flash
  useEffect(() => {
    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
  }, [flash]);

  // Handler submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEdit && matakuliah.id_mk) {
      // Update data
      form.put(route('master-data.matakuliah.update', matakuliah.id_mk));
    } else {
      // Simpan data baru
      form.post(route('master-data.matakuliah.store'));
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'} />

      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{isEdit ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="kode_mk">Kode Mata Kuliah</Label>
                <Input 
                  id="kode_mk"
                  type="text"
                  value={form.data.kode_mk}
                  onChange={(e) => form.setData('kode_mk', e.target.value)}
                />
                {errors.kode_mk && <p className="text-sm text-red-500">{errors.kode_mk}</p>}
              </div>
              
              <div>
                <Label htmlFor="nama_mk">Nama Mata Kuliah</Label>
                <Input 
                  id="nama_mk"
                  type="text"
                  value={form.data.nama_mk}
                  onChange={(e) => form.setData('nama_mk', e.target.value)}
                />
                {errors.nama_mk && <p className="text-sm text-red-500">{errors.nama_mk}</p>}
              </div>
              
              <div>
                <Label htmlFor="sks">SKS</Label>
                <Input 
                  id="sks"
                  type="number"
                  min="1"
                  value={form.data.sks}
                  onChange={(e) => form.setData('sks', Number(e.target.value))}
                />
                {errors.sks && <p className="text-sm text-red-500">{errors.sks}</p>}
              </div>
              
              <div>
                <Label htmlFor="semester">Semester</Label>
                <Input 
                  id="semester"
                  type="number"
                  min="1"
                  max="8"
                  value={form.data.semester}
                  onChange={(e) => form.setData('semester', Number(e.target.value))}
                />
                {errors.semester && <p className="text-sm text-red-500">{errors.semester}</p>}
              </div>

              <div>
                <Label htmlFor="prodi">Program Studi</Label>
                <Input 
                  id="prodi"
                  type="text"
                  value={form.data.prodi}
                  onChange={(e) => form.setData('prodi', e.target.value)}
                />
                {errors.prodi && <p className="text-sm text-red-500">{errors.prodi}</p>}
              </div>

              <div>
                <Label htmlFor="id_dosen">Dosen Pengampu</Label>
                <Select 
                  value={form.data.id_dosen?.toString() ?? ''}
                  onValueChange={(value) => form.setData('id_dosen', value ? parseInt(value) : null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Dosen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Dosen</SelectLabel>
                      <SelectItem value="">-- Tidak Ada --</SelectItem>
                      {Array.isArray(dosen_list) && dosen_list.map((dosen) => (
                        <SelectItem key={dosen.id} value={dosen.id.toString()}>
                          {dosen.name} ({dosen.id})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {errors.id_dosen && <p className="text-sm text-red-500">{errors.id_dosen}</p>}
              </div>

              <div>
                <Label htmlFor="prasyarat">Prasyarat</Label>
                <Textarea 
                  id="prasyarat"
                  value={form.data.prasyarat ?? ''}
                  onChange={(e) => form.setData('prasyarat', e.target.value)}
                />
                {errors.prasyarat && <p className="text-sm text-red-500">{errors.prasyarat}</p>}
              </div>
              
              <div className="flex gap-4">
                <Button type="submit" disabled={form.processing}>
                  {isEdit ? 'Update' : 'Simpan'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.visit(route('master-data.matakuliah.index'))}
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}