import AppLogoIcon from '@/components/app-logo-icon';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-background relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <img className="absolute inset-0 z-0 m-auto h-auto w-[100vh] object-cover" src="assets/images/login-bg.png" alt="background" />
            <div className="relative z-10 w-full max-w-sm">
                <div className="flex flex-col gap-8 rounded-4xl border-2 border-gray-300 bg-white p-10 shadow-xl">
                    <div className="flex flex-col items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                <AppLogoIcon src="assets/images/logo-polines.png" alt="Ujian Logo" width={36} height={36} />
                            </div>
                            <span className="sr-only">{title}</span>
                            <h1 className="text-3xl font-semibold">UJIAN</h1>
                        </div>

                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
