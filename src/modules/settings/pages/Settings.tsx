import { useAuthStore } from '@/modules/auth/store/useAuthStore';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input, InputPassword } from '@/shared/components/ui/input';
import useToastLoading from '@/shared/hooks/useToastLoading';
import type { ValidationErrors } from '@/shared/types/responseApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Landmark, Lock, Mail, User as UserIcon, UserCog, UserPen } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useForm, type FieldValues, type Path, type UseFormSetError } from 'react-hook-form';
import { useSettings } from '../hooks/useSettings';
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from '../schemas/changePassword.schema';
import { personalInfoSchema, type PersonalInfoFormValues } from '../schemas/personalInfo.schema';

/** Mapeia os erros 422 da API para os campos do formulário. */
function applyApiErrors<T extends FieldValues>(
  errors: ValidationErrors | undefined,
  setError: UseFormSetError<T>,
  fieldMap: Record<string, Path<T>>
) {
  if (!errors) return;
  Object.entries(errors).forEach(([apiField, messages]) => {
    const field = fieldMap[apiField];
    const message = Array.isArray(messages) ? messages[0] : String(messages);
    if (field && message) setError(field, { message });
  });
}

function SectionHeader({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <CardHeader className="flex items-start gap-3 border-b px-6 pt-2">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <CardTitle className="font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
    </CardHeader>
  );
}

function PersonalInfoCard() {
  const user = useAuthStore((s) => s.user);
  const toast = useToastLoading();
  const { updateInfoMutation } = useSettings();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '' },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email });
  }, [user, reset]);

  const onSubmit = async (data: PersonalInfoFormValues) => {
    const payload = {
      ...(data.name !== user?.name ? { name: data.name } : {}),
      ...(data.email !== user?.email ? { email: data.email } : {}),
    };
    if (Object.keys(payload).length === 0) return;

    toast({ message: 'Salvando dados...' });
    const res = await updateInfoMutation.mutateAsync(payload);
    applyApiErrors(res.errors, setError, { name: 'name', email: 'email' });
    toast({ type: res.type, message: res.message });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="gap-6">
        <SectionHeader
          icon={<UserPen className="size-4" />}
          title="Dados pessoais"
          description="Atualize seu nome e o e-mail utilizado para acessar o sistema."
        />
        <CardContent className="grid grid-cols-1 gap-4 px-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              label="Nome Completo"
              placeholder="Ex: João da Silva"
              iconPreffix={<UserIcon className="h-4 w-4" />}
              message={errors.name?.message}
              {...register('name')}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              iconPreffix={<Mail className="h-4 w-4" />}
              message={errors.email?.message}
              {...register('email')}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2 px-6">
          <Button
            type="button"
            variant="outline"
            disabled={!isDirty || isSubmitting}
            onClick={() => reset()}
          >
            Descartar
          </Button>
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function ChangePasswordCard() {
  const toast = useToastLoading();
  const { changePasswordMutation } = useSettings();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ChangePasswordFormValues) => {
    toast({ message: 'Alterando senha...' });
    const res = await changePasswordMutation.mutateAsync({
      password: data.password,
      password_confirmation: data.confirmPassword,
    });
    applyApiErrors(res.errors, setError, { password: 'password' });
    if (res.success) reset();
    toast({ type: res.type, message: res.message });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="gap-6">
        <SectionHeader
          icon={<KeyRound className="size-4" />}
          title="Alterar senha"
          description="Use pelo menos 8 caracteres, combinando letras, números e símbolos."
        />
        <CardContent className="grid grid-cols-1 gap-4 px-6 md:grid-cols-2">
          <InputPassword
            label="Nova senha"
            placeholder="••••••••"
            autoComplete="new-password"
            iconPreffix={<Lock className="h-4 w-4" />}
            message={errors.password?.message}
            {...register('password')}
          />
          <InputPassword
            label="Confirme a nova senha"
            placeholder="••••••••"
            autoComplete="new-password"
            iconPreffix={<Lock className="h-4 w-4" />}
            message={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </CardContent>
        <CardFooter className="justify-end px-6">
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {isSubmitting ? 'Alterando...' : 'Alterar senha'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="truncate text-sm font-medium">{value || '-'}</span>
      </div>
    </div>
  );
}

function AccountSummaryCard() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <Card className="gap-0 py-0 lg:sticky lg:top-0">
      <div className="flex flex-col items-center gap-3 px-6 py-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground shadow-md ring-4 ring-card">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div className="flex w-full min-w-0 flex-col gap-0.5">
          <span className="truncate text-lg font-semibold">{user.name}</span>
          <span className="truncate text-sm text-muted-foreground">{user.email}</span>
        </div>
        {user.profile?.name && (
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {user.profile.name}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-4 border-t px-6 py-5">
        <InfoRow icon={<UserCog className="size-4" />} label="Perfil de acesso" value={user.profile?.name} />
        <InfoRow icon={<Landmark className="size-4" />} label="Secretaria" value={user.secretariat?.name} />
      </div>
      <p className="border-t bg-muted/50 px-6 py-3 text-xs text-muted-foreground">
        Perfil e secretaria só podem ser alterados por um administrador.
      </p>
    </Card>
  );
}

export default function Settings() {
  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
      <AccountSummaryCard />
      <div className="flex flex-col gap-6">
        <PersonalInfoCard />
        <ChangePasswordCard />
      </div>
    </div>
  );
}
