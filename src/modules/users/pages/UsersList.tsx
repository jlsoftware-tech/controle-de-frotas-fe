import { useUsers } from '@/modules/users/hooks/useUsers';
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
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/shared/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import useDebounce from '@/shared/hooks/useDebounce';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { useQueryClient } from '@tanstack/react-query';
import { Edit2, Search, Trash2, UserCog, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserFormModal } from '../components/UserFormModal';
import type { User } from '../types/user';

export default function UsersList() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const { register, watch, setValue } = useForm({
    defaultValues: {
      search: '',
    },
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

  const {
    data: usersResponse,
    isLoading,
    isPlaceholderData,
    deleteMutation,
  } = useUsers({
    page,
    per_page: perPage,
    search: debouncedSearch,
  });


  const isDeleting = deleteMutation.isPending;
  const queryClient = useQueryClient();
  const toast = useToastLoading();

  const pagination = usersResponse?.pagination;
  const totalPages = pagination?.totalPages || 0;
  const totalEntries = pagination?.totalEntries || 0;
  const users = usersResponse?.items || [];

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
            placeholder="Pesquise por nome..."
            iconPreffix={<Search className="h-4 w-4" />}
            {...register('search')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Gerencie os usuários do sistema.</CardDescription>
          <CardAction>
            <Button
              onClick={() => {
                setEditingUser(null);
                setIsModalOpen(true);
              }}
              className="px-3 sm:px-4"
            >
              <UserCog className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Novo Usuário</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table loading={isLoading}>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Perfil de Acesso</TableHead>
                <TableHead>Secretaria</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="w-24 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum usuário encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user?.profile?.name ?? '-'}</TableCell>
                    <TableCell>{user?.secretariat?.name ?? '-'}</TableCell>
                    <TableCell>{user.created_at}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            setEditingUser(user);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setUserToDelete(user)}
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
              {usersResponse ? (
                <span>
                  Mostrando {totalEntries === 0 ? 0 : (page - 1) * perPage + 1} a{' '}
                  {Math.min(page * perPage, totalEntries)} de{' '}
                  {totalEntries} usuários
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

      <UserFormModal
        open={isModalOpen}
        onOpenChange={(val) => {
          setIsModalOpen(val);
          if (!val) setEditingUser(null);
        }}
        userToEdit={editingUser}
        onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['users'] }); }}
      />

      <AlertDialog
        open={!!userToDelete}
        onOpenChange={(val) => !val && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <AlertTriangle />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o usuário{' '}
              <strong>{userToDelete?.name}</strong>? Essa ação não poderá ser
              desfeita.
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
                if (!userToDelete) return;
                toast({ message: 'Excluindo usuário...' });
                const res = await deleteMutation.mutateAsync(userToDelete.id);
                if (res.success) {
                  setUserToDelete(null);
                  queryClient.invalidateQueries({ queryKey: ['users'] });
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
