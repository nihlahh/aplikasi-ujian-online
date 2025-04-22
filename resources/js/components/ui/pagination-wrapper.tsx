import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { ChevronsLeftIcon, ChevronsRightIcon } from 'lucide-react';

interface PaginationWrapperProps {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    onNavigate: (page: number) => void;
}

export default function PaginationWrapper({
    currentPage,
    lastPage,
    perPage,
    total,
    onNavigate,
}: PaginationWrapperProps) {
    const renderPages = () => {
        const pages = [];

        if (lastPage <= 3) {
            for (let i = 1; i <= lastPage; i++) {
                pages.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate(i);
                            }}
                            isActive={currentPage === i}
                        >
                            {i}
                        </PaginationLink>
                    </PaginationItem>,
                );
            }
        } else {
            if (currentPage === 1) {
                pages.push(
                    <PaginationItem key={1}>
                        <PaginationLink isActive>{1}</PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key={2}>
                        <PaginationLink onClick={() => onNavigate(2)}>{2}</PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key="ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            } else if (currentPage === lastPage) {
                pages.push(
                    <PaginationItem key="ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>,
                    <PaginationItem key={lastPage - 1}>
                        <PaginationLink onClick={() => onNavigate(lastPage - 1)}>{lastPage - 1}</PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key={lastPage}>
                        <PaginationLink isActive>{lastPage}</PaginationLink>
                    </PaginationItem>,
                );
            } else {
                pages.push(
                    <PaginationItem key={currentPage - 1}>
                        <PaginationLink onClick={() => onNavigate(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key={currentPage}>
                        <PaginationLink isActive>{currentPage}</PaginationLink>
                    </PaginationItem>,
                    <PaginationItem key={currentPage + 1}>
                        <PaginationLink onClick={() => onNavigate(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                    </PaginationItem>,
                );
            }
        }

        return pages;
    };

    return (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground sm:order-1">
                Showing {Math.min(currentPage * perPage, total)} of {total} entries
            </div>

            <div className="flex w-full justify-end sm:order-2 sm:w-auto">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage > 1) onNavigate(currentPage - 1);
                                }}
                                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate(1);
                                }}
                            >
                                <ChevronsLeftIcon />
                            </PaginationLink>
                        </PaginationItem>

                        {renderPages()}

                        <PaginationItem>
                            <PaginationLink
                                onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate(lastPage);
                                }}
                            >
                                <ChevronsRightIcon />
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (currentPage < lastPage) onNavigate(currentPage + 1);
                                }}
                                className={currentPage >= lastPage ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
