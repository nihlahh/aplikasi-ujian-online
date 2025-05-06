import React, { useState } from 'react';
import { router } from '@inertiajs/react';

const ImportDosen = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        router.post('/import-dosen', formData);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Import Excel Data Dosen</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">File Excel</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required
                        className="block w-full border px-3 py-2 rounded"
                    />
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Import
                    </button>

                    <a
                        href="/sample-import-dosen.xlsx"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Sample
                    </a>
                </div>
            </form>
        </div>
    );
};

export default ImportDosen;
