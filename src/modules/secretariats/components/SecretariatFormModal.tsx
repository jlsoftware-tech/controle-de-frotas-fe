import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { zodResolver } from '@hookform/resolvers/zod';
import { Landmark, Tag } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSecretariats } from '../hooks/useSecretariats';
import { secretariatSchema, type SecretariatFormValues } from '../schemas/secretariat.schema';
import type { Secretariat } from '../types/secretariat';

interface SecretariatFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  secretariatToEdit?: Secretariat | null;
}

export function SecretariatFormModal({
  open,
  onOpenChange,
  onSuccess,
  secretariatToEdit,
}: SecretariatFormModalProps) {
  const toast = useToastLoading();
  const { createMutation, updateMutation } = useSecretariats();
  const isEditing = !!secretariatToEdit;
  const isSubmittingMutation = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SecretariatFormValues>({
    resolver: zodResolver(secretariatSchema),
    defaultValues: { name: '', acronym: '' },
  });

  useEffect(() => {
    if (!open) return;

    if (secretariatToEdit) {
      reset({
        name: secretariatToEdit.name,
        acronym: secretariatToEdit.acronym,
      });
    } else {
      reset({ name: '', acronym: '' });
    }
  }, [secretariatToEdit, open, reset]);

  const onSubmit = async (data: SecretariatFormValues) => {
    toast({
      message: isEditing ? 'Atualizando secretaria...' : 'Salvando secretaria...',
    });

    const res = isEditing
      ? await updateMutation.mutateAsync({ id: secretariatToEdit.id, data })
      : await createMutation.mutateAsync(data);

    if (res.success) {
      reset();
      onSuccess?.();
      onOpenChange(false);
    }

    toast({ type: res.type, message: res.message });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Secretaria' : 'Nova Secretaria'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Altere o nome e a sigla desta secretaria.'
              : 'Preencha os dados da nova secretaria.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 pt-4 pb-2">
            <Input
              label="Nome da Secretaria"
              placeholder="Ex: Secretaria de Educação"
              iconPreffix={<Landmark className="h-4 w-4" />}
              message={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Sigla"
              placeholder="Ex: SEDUC"
              iconPreffix={<Tag className="h-4 w-4" />}
              message={errors.acronym?.message}
              {...register('acronym')}
            />
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
