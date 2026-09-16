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
import { AlertTriangle, Edit2, Landmark, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { SecretariatFormModal } from '../components/SecretariatFormModal';
import { useSecretariats } from '../hooks/useSecretariats';
import type { Secretariat } from '../types/secretariat';

export default function SecretariatsList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSecretariat, setEditingSecretariat] = useState<Secretariat | null>(null);
  const [secretariatToDelete, setSecretariatToDelete] = useState<Secretariat | null>(null);

  const { register, watch, setValue } = useForm({
    defaultValues: { search: '' },
  });

  const searchValue = watch('search');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const debouncedSetSearch = useDebounce((val: string) => {
    setDebouncedSearch(val);
  }, 500);

  useEffect(() => {
    debouncedSetSearch(searchValue);
  }, [searchValue]);

  const {
    data: secretariats = [],
    isLoading,
    deleteMutation,
  } = useSecretariats({ search: debouncedSearch });

  const isDeleting = deleteMutation.isPending;
  const queryClient = useQueryClient();
  const toast = useToastLoading();

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
                <TableHead>Nome</TableHead>
                <TableHead>Sigla</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="w-24 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
