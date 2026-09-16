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
import { AlertTriangle, Edit2, Search, ShieldPlus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProfileFormModal } from '../components/ProfileFormModal';
import { useProfiles } from '../hooks/useProfiles';
import type { Profile } from '../types/profile';

export default function ProfilesList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

  const { register, watch, setValue } = useForm({
    defaultValues: { search: '' },
  });

  const searchValue = watch('search');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const debouncedSetSearch = useDebounce((val: string) => { setDebouncedSearch(val); }, 500);

  useEffect(() => {
    debouncedSetSearch(searchValue);
  }, [searchValue]);

  const {
    data: profiles = [],
    isLoading,
    deleteMutation,
  } = useProfiles({ search: debouncedSearch });

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
            placeholder="Pesquise pelo nome do perfil..."
            iconPreffix={<Search className="h-4 w-4" />}
            {...register('search')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Perfis de Acesso</CardTitle>
          <CardDescription>
            Gerencie os perfis e permissões do sistema.
          </CardDescription>
          <CardAction>
            <Button
              onClick={() => {
                setEditingProfile(null);
                setIsModalOpen(true);
              }}
              className="px-3 sm:px-4"
            >
              <ShieldPlus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Novo Perfil</span>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Table loading={isLoading}>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Permissões</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="w-24 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum perfil encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {profile.description || '-'}
                    </TableCell>
                    <TableCell>
                      {profile.permissions?.length ?? 0} permissões
                    </TableCell>
                    <TableCell> {profile.created_at} </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => {
                            setEditingProfile(profile);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setProfileToDelete(profile)}
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

      <ProfileFormModal
        open={isModalOpen}
        onOpenChange={(val) => {
          setIsModalOpen(val);
          if (!val) setEditingProfile(null);
        }}
        profileToEdit={editingProfile}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['profiles'] });
        }}
      />

      <AlertDialog  open={!!profileToDelete} onOpenChange={(val) => !val && setProfileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <AlertTriangle />
            </AlertDialogMedia>
            <AlertDialogTitle>Excluir perfil?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o perfil{' '}
              <strong>{profileToDelete?.name}</strong>? Usuários vinculados a
              este perfil podem ser afetados. Essa ação não poderá ser desfeita.
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
                if (!profileToDelete) return;
                toast({ message: 'Excluindo perfil...' });
                const res = await deleteMutation.mutateAsync(
                  profileToDelete.id
                );
                if (res.success) {
                  setProfileToDelete(null);
                  queryClient.invalidateQueries({ queryKey: ['profiles'] });
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
