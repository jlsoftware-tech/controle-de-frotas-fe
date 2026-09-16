import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, ShieldCheck, UserCog } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { usePermissions } from '../hooks/usePermissions';
import { useProfiles } from '../hooks/useProfiles';
import { profileSchema, type ProfileFormValues } from '../schemas/profile.schema';
import type { Permission, Profile } from '../types/profile';

interface ProfileFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  profileToEdit?: Profile | null;
}

const MODULE_LABELS: Record<string, string> = {
  users: 'Usuários',
  profiles: 'Perfis de Acesso',
  secretariats: 'Secretarias',
};

const ACTION_LABELS: Record<string, string> = {
  view: 'Visualizar',
  create: 'Criar',
  update: 'Editar',
  delete: 'Excluir',
};

function groupPermissionsByModule(permissions: Permission[]) {
  const groups = new Map<string, Permission[]>();
  for (const permission of permissions) {
    const list = groups.get(permission.module) ?? [];
    list.push(permission);
    groups.set(permission.module, list);
  }
  return Array.from(groups.entries());
}

export function ProfileFormModal({ open, onOpenChange, onSuccess, profileToEdit }: ProfileFormModalProps) {
  const toast = useToastLoading();
  const { createMutation, updateMutation } = useProfiles();
  const { data: permissions = [], isLoading: isLoadingPermissions } = usePermissions();
  const isEditing = !!profileToEdit;
  const isSubmittingMutation = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  useEffect(() => {
    if (!open) return;

    if (profileToEdit) {
      reset({
        name: profileToEdit.name,
        description: profileToEdit.description ?? '',
        permissions: (profileToEdit.permissions ?? []).map((p) => p.id),
      });
    } else {
      reset({ name: '', description: '', permissions: [] });
    }
  }, [profileToEdit, open, reset]);

  const groupedPermissions = groupPermissionsByModule(permissions);

  const onSubmit = async (data: ProfileFormValues) => {
    toast({
      message: isEditing ? 'Atualizando perfil...' : 'Salvando perfil...',
    });

    const payload = {
      name: data.name,
      description: data.description || '',
      permissions: data.permissions,
    };

    const res = isEditing
      ? await updateMutation.mutateAsync({ id: profileToEdit.id, data: payload })
      : await createMutation.mutateAsync(payload);

    if (res.success) {
      reset();
      onSuccess?.();
      onOpenChange(false);
    }

    toast({ type: res.type, message: res.message });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Perfil de Acesso' : 'Novo Perfil de Acesso'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere o nome, descrição e as permissões deste perfil.'
              : 'Preencha os dados e selecione as permissões deste perfil.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 pt-4 pb-2 px-1 -mx-1 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
            <Input
              label="Nome do Perfil"
              placeholder="Ex: Administrador"
              iconPreffix={<UserCog className="h-4 w-4" />}
              message={errors.name?.message}
              {...register('name')}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Descrição
              </label>
              <Textarea
                placeholder="Descreva a finalidade deste perfil de acesso"
                {...register('description')}
              />
              {errors.description?.message && (
                <span className="text-xs text-destructive">{errors.description.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                Permissões
              </label>

              {isLoadingPermissions ? (
                <div className="text-sm text-muted-foreground">Carregando permissões...</div>
              ) : (
                <Controller
                  name="permissions"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-3 rounded-lg border border-input p-3">
                      {groupedPermissions.map(([module, modulePermissions]) => (
                        <div key={module} className="flex flex-col gap-1.5">
                          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {MODULE_LABELS[module] ?? module}
                          </span>
                          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                            {modulePermissions.map((permission) => {
                              const checked = field.value.includes(permission.id);
                              return (
                                <label
                                  key={permission.id}
                                  className="flex items-center gap-2 text-sm cursor-pointer select-none"
                                >
                                  <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-input accent-primary cursor-pointer"
                                    checked={checked}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        field.onChange([...field.value, permission.id]);
                                      } else {
                                        field.onChange(field.value.filter((id) => id !== permission.id));
                                      }
                                    }}
                                  />
                                  {ACTION_LABELS[permission.name] ?? permission.name}
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {groupedPermissions.length === 0 && (
                        <span className="text-sm text-muted-foreground">
                          Nenhuma permissão cadastrada.
                        </span>
                      )}
                    </div>
                  )}
                />
              )}
            </div>
          </div>
          <DialogFooter className="mt-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmittingMutation}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmittingMutation}>
              {isSubmittingMutation ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
