import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import useDebounce from '@/shared/hooks/useDebounce';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, ArrowDown, ArrowUp, ArrowUpDown, Edit2, Landmark, Loader2, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SecretariatFormModal } from '../components/SecretariatFormModal';
import { useSecretariats } from '../hooks/useSecretariats';
import type { GetSecretariatsParams, Secretariat } from '../types/secretariat';

type SortableField = NonNullable<GetSecretariatsParams['sort']>;

const SORTABLE_COLUMNS: { field: SortableField; label: string }[] = [
  { field: 'name', label: 'Nome' },
  { field: 'acronym', label: 'Sigla' },
  { field: 'created_at', label: 'Data de Criação' },
];

export default function SecretariatsList() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSecretariat, setEditingSecretariat] = useState<Secretariat | null>(null);
  const [secretariatToDelete, setSecretariatToDelete] = useState<Secretariat | null>(null);

  const { register, watch, setValue } = useForm({
    defaultValues: { search: '' },
  });

  const searchValue = watch('search');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const perPage = 10;

  const debouncedSetSearch = useDebounce((val: string) => {
    setDebouncedSearch(val);
    setPage(1);
  }, 500);

  useEffect(() => {
    debouncedSetSearch(searchValue);
  }, [searchValue]);

  const [sort, setSort] = useState<SortableField>();
  const [order, setOrder] = useState<'asc' | 'desc'>();

  const handleSort = (field: SortableField) => {
    if (sort === field) setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    else {
      setSort(field);
      setOrder('asc');
    }
  };

  const {
    data: secretariatsResponse,
    isLoading,
    isFetching,
    isPlaceholderData,
    deleteMutation,
  } = useSecretariats({
    page,
    per_page: perPage,
    search: debouncedSearch,
    sort,
    order,
  });

  const isDeleting = deleteMutation.isPending;
  const queryClient = useQueryClient();
  const toast = useToastLoading();

  const pagination = secretariatsResponse?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const totalEntries = pagination?.totalEntries || 0;
  const secretariats = secretariatsResponse?.items || [];

  const handlePreviousPage = () => setPage((old) => Math.max(old - 1, 1));
  const handleNextPage = () => !isPlaceholderData && page < totalPages && setPage((old) => old + 1);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardAction>
            <Button
              variant="ghost"
              onClick={() => setValue('search', '')}
              disabled={!searchValue}
            >
              Limpar Filtros
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Input
            label="Busca"
            placeholder="Pesquise pelo nome da secretaria..."
            iconPreffix={<Search className="h-4 w-4" />}
            {...register('search')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Secretarias</CardTitle>
          <CardDescription>
            Gerencie as secretarias cadastradas no sistema.
          </CardDescription>
          <CardAction>
            <Button
              onClick={() => {
                setEditingSecretariat(null);
                setIsModalOpen(true);
              }}
              className="px-3 sm:px-4"
            >
              <Landmark className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Nova Secretaria</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table loading={isLoading}>
            <TableHeader>
              <TableRow>
                {SORTABLE_COLUMNS.map(({ field, label }) => (
                  <TableHead key={field}>
                    <button
                      type="button"
                      onClick={() => handleSort(field)}
                      disabled={isFetching}
                      className="flex items-center gap-1 hover:text-foreground disabled:cursor-not-allowed disabled:hover:text-inherit"
                    >
                      {label}
                      {sort === field && isFetching ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : sort === field ? (
                        order === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
                      )}
                    </button>
                  </TableHead>
                ))}
                <TableHead className="w-24 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={isFetching ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
              {secretariats.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Nenhuma secretaria encontrada.
                  </TableCell>
                </TableRow>
              ) : (
                secretariats.map((secretariat) => (
                  <TableRow key={secretariat.id}>
                    <TableCell className="font-medium">
                      {secretariat.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {secretariat.acronym}
                    </TableCell>
                    <TableCell> {secretariat.created_at} </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            setEditingSecretariat(secretariat);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setSecretariatToDelete(secretariat)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="text-sm text-muted-foreground text-center sm:text-left">
              {secretariatsResponse ? (
                <span>
                  Mostrando {totalEntries === 0 ? 0 : (page - 1) * perPage + 1} a{' '}
                  {Math.min(page * perPage, totalEntries)} de{' '}
                  {totalEntries} secretarias
                </span>
              ) : (
                <span>Carregando informações...</span>
              )}
            </div>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) handlePreviousPage();
                    }}
                    className={
                      page === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                    text="Anterior"
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="text-sm font-medium px-4">
                    Página {page} de {totalPages || 1}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isPlaceholderData && page < totalPages)
                        handleNextPage();
                    }}
                    className={
                      isPlaceholderData || page >= totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                    text="Próximo"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      <SecretariatFormModal
        open={isModalOpen}
        onOpenChange={(val) => {
          setIsModalOpen(val);
          if (!val) setEditingSecretariat(null);
        }}
        secretariatToEdit={editingSecretariat}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['secretariats'] });
        }}
      />

      <AlertDialog
        open={!!secretariatToDelete}
        onOpenChange={(val) => !val && setSecretariatToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <AlertTriangle />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir secretaria?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a secretaria{' '}
              <strong>{secretariatToDelete?.name}</strong>? Usuários vinculados a
              esta secretaria podem ser afetados. Essa ação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={async (e) => {
                e.preventDefault();
                if (!secretariatToDelete) return;
                toast({ message: 'Excluindo secretaria...' });
                const res = await deleteMutation.mutateAsync(
                  secretariatToDelete.id
                );
                if (res.success) {
                  setSecretariatToDelete(null);
                  queryClient.invalidateQueries({ queryKey: ['secretariats'] });
                }
                toast({ type: res.type, message: res.message });
              }}
            >
              {isDeleting ? 'Excluindo...' : 'Sim, excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
