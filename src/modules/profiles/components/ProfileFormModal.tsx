import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { cn } from '@/shared/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  Check,
  Eye,
  FileText,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserCog,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

const MODULE_ICONS: Record<string, typeof Users> = {
  users: Users,
  profiles: ShieldCheck,
  secretariats: Building2,
};

const ACTION_LABELS: Record<string, string> = {
  view: 'Visualizar',
  create: 'Criar',
  update: 'Editar',
  delete: 'Excluir',
};

const ACTION_ICONS: Record<string, typeof Eye> = {
  view: Eye,
  create: Plus,
  update: Pencil,
  delete: Trash2,
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
  const { createMutation, updateMutation } = useProfiles(undefined, { enabled: false });
  const { data: permissions = [], isLoading: isLoadingPermissions } = usePermissions();
  const [permissionSearch, setPermissionSearch] = useState('');
  const [prevOpen, setPrevOpen] = useState(open);
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

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setPermissionSearch('');
  }

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

  const normalizedSearch = permissionSearch.trim().toLowerCase();
  const filteredGroupedPermissions = useMemo(() => {
    if (!normalizedSearch) return groupedPermissions;

    return groupedPermissions
      .map(([module, modulePermissions]) => {
        const moduleLabel = (MODULE_LABELS[module] ?? module).toLowerCase();
        if (moduleLabel.includes(normalizedSearch)) return [module, modulePermissions] as const;

        const matchingPermissions = modulePermissions.filter((permission) =>
          (ACTION_LABELS[permission.name] ?? permission.name).toLowerCase().includes(normalizedSearch)
        );
        return [module, matchingPermissions] as const;
      })
      .filter(([, modulePermissions]) => modulePermissions.length > 0);
  }, [groupedPermissions, normalizedSearch]);

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
          <div className="flex flex-col gap-5 pt-4 pb-2 px-1 -mx-1 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
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
              <div className="flex items-center justify-between gap-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  Permissões
                </label>
                {!isLoadingPermissions && permissions.length > 0 && (
                  <div className="w-48">
                    <Input
                      placeholder="Buscar permissão..."
                      iconPreffix={<Search className="h-3.5 w-3.5" />}
                      value={permissionSearch}
                      onChange={(e) => setPermissionSearch(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                )}
              </div>

              {isLoadingPermissions ? (
                <div className="text-sm text-muted-foreground">Carregando permissões...</div>
              ) : (
                <Controller
                  name="permissions"
                  control={control}
                  render={({ field }) => {
                    const allIds = permissions.map((p) => p.id);
                    const allChecked = allIds.length > 0 && allIds.every((id) => field.value.includes(id));

                    return (
                      <div className="rounded-xl border border-input overflow-hidden shadow-sm">
                        {permissions.length > 0 && (
                          <label className="flex items-center justify-between gap-3 bg-primary/5 border-b border-input px-4 py-3 cursor-pointer select-none">
                            <span className="flex items-center gap-3 text-sm font-semibold text-foreground">
                              <span
                                className={cn(
                                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                                  allChecked
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-input bg-background'
                                )}
                              >
                                {allChecked && <Check className="h-3.5 w-3.5" />}
                              </span>
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={allChecked}
                                onChange={(e) => {
                                  field.onChange(e.target.checked ? allIds : []);
                                }}
                              />
                              Selecionar todas as permissões
                            </span>
                            <span className="text-xs font-medium text-muted-foreground bg-background rounded-full px-2.5 py-1 border border-input">
                              {field.value.length} de {allIds.length}
                            </span>
                          </label>
                        )}
                        <div className="flex flex-col divide-y divide-input">
                          {filteredGroupedPermissions.map(([module, modulePermissions]) => {
                            const moduleIds = modulePermissions.map((p) => p.id);
                            const moduleSelectedCount = moduleIds.filter((id) => field.value.includes(id)).length;
                            const moduleChecked = moduleSelectedCount === moduleIds.length;
                            const ModuleIcon = MODULE_ICONS[module] ?? ShieldCheck;

                            return (
                              <div key={module} className="p-4">
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                    <span
                                      className={cn(
                                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors',
                                        moduleChecked
                                          ? 'border-primary bg-primary text-primary-foreground'
                                          : 'border-input bg-background'
                                      )}
                                    >
                                      {moduleChecked && <Check className="h-3 w-3" />}
                                    </span>
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={moduleChecked}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          field.onChange([...new Set([...field.value, ...moduleIds])]);
                                        } else {
                                          field.onChange(field.value.filter((id) => !moduleIds.includes(id)));
                                        }
                                      }}
                                    />
                                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                      <ModuleIcon className="h-3.5 w-3.5" />
                                    </span>
                                    <span className="text-sm font-semibold text-foreground">
                                      {MODULE_LABELS[module] ?? module}
                                    </span>
                                  </label>
                                  <span className="text-[11px] font-medium text-muted-foreground">
                                    {moduleSelectedCount}/{moduleIds.length}
                                  </span>
                                </div>
                                <div className="flex flex-wrap gap-2 pl-9">
                                  {modulePermissions.map((permission) => {
                                    const checked = field.value.includes(permission.id);
                                    const ActionIcon = ACTION_ICONS[permission.name];
                                    return (
                                      <button
                                        key={permission.id}
                                        type="button"
                                        aria-pressed={checked}
                                        onClick={() => {
                                          if (checked) {
                                            field.onChange(field.value.filter((id) => id !== permission.id));
                                          } else {
                                            field.onChange([...field.value, permission.id]);
                                          }
                                        }}
                                        className={cn(
                                          'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all select-none',
                                          checked
                                            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                                            : 'border-input bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
                                        )}
                                      >
                                        {ActionIcon && <ActionIcon className="h-3.5 w-3.5" />}
                                        {ACTION_LABELS[permission.name] ?? permission.name}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                          {filteredGroupedPermissions.length === 0 && (
                            <span className="text-sm text-muted-foreground p-4">
                              {permissions.length === 0
                                ? 'Nenhuma permissão cadastrada.'
                                : `Nenhuma permissão encontrada para "${permissionSearch}".`}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  }}
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
