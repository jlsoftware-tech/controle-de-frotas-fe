import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input, InputPassword, InputSelect } from '@/shared/components/ui/input';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { createUserSchema, type CreateUserFormValues } from '../schemas/createUser.schema';
import { updateUserSchema, type UpdateUserFormValues } from '../schemas/updateUser.schema';
import { useUsers } from '../hooks/useUsers';
import { useEffect } from 'react';
import type { User } from '../types/user';
import { roleOptions } from '@/modules/auth/utils/roles';

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  userToEdit?: User | null;
}

export function UserFormModal({ open, onOpenChange, onSuccess, userToEdit }: UserFormModalProps) {
  const [portalContainer, setPortalContainer] = useState<HTMLFormElement | null>(null);
  const toast = useToastLoading();
  const { createMutation, updateMutation } = useUsers();
  const isEditing = !!userToEdit;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'USER',
    },
  });

  useEffect(() => {
    if (open) {
      if (userToEdit) {
        reset({
          name: userToEdit.name,
          email: userToEdit.email,
          password: '',
          confirmPassword: '',
          role: userToEdit.role,
        });
      } else {
        reset({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'USER',
        });
      }
    }
  }, [userToEdit, open, reset]);

  type FormData = CreateUserFormValues | UpdateUserFormValues;

  const onSubmit = async (data: FormData) => {
    toast({ message: isEditing ? 'Atualizando usuário...' : 'Salvando usuário...' });
    
    let res;
    if (isEditing) {
      const payload = {
        name: data.name,
        email: data.email,
        role: data.role,
        ...(data.password ? { password: data.password } : {}),
      };
      res = await updateMutation.mutateAsync({ id: userToEdit.id, data: payload });
    } else {
      const createData = data as CreateUserFormValues;
      const payload = {
        name: createData.name,
        email: createData.email,
        password: createData.password,
        role: createData.role,
      };
      res = await createMutation.mutateAsync(payload);
    }

    if (res.success) {
      reset();
      onSuccess?.();
      onOpenChange(false);
    }
    
    toast({ type: res.type, message: res.message });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Altere os dados desejados do usuário. Deixe a senha em branco se não quiser alterá-la.'
              : 'Preencha os dados abaixo para cadastrar um novo usuário no sistema.'}
          </DialogDescription>
        </DialogHeader>
        <form ref={setPortalContainer} onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 pb-2 px-1 -mx-1 max-h-[55vh] sm:max-h-[70vh] overflow-y-auto">
            <div className="col-span-1 md:col-span-2">
            <Input
              label="Nome Completo"
              placeholder="Ex: João da Silva"
              iconPreffix={<UserIcon className="h-4 w-4" />}
              message={errors.name?.message}
              {...register('name')}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <Input
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              iconPreffix={<Mail className="h-4 w-4" />}
              message={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div className="col-span-1">
            <InputPassword
              label="Senha"
              placeholder="••••••••"
              iconPreffix={<Lock className="h-4 w-4" />}
              message={errors.password?.message}
              {...register('password')}
            />
          </div>
          <div className="col-span-1">
            <InputPassword
              label="Confirmar Senha"
              placeholder="••••••••"
              iconPreffix={<Lock className="h-4 w-4" />}
              message={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <InputSelect
              name="role"
              control={control}
              label="Nível de Acesso"
              placeholder="Selecione..."
              contentPortalContainer={portalContainer}
              options={roleOptions}
              message={errors.role?.message}
            />
          </div>
          </div>
          <DialogFooter className="mt-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
