import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { Button } from '@/shared/components/ui/button';
import { InputPassword } from '@/shared/components/ui/input';
import { Truck, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/modules/auth/schemas/resetPassword.schema';
import { useResetPassword } from '@/modules/auth/hooks/useResetPassword';
import useToastLoading from '@/shared/hooks/useToastLoading';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); 
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToastLoading();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const { mutateAsync: resetPasswordMutation } = useResetPassword();

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!token) return;
    
    toast({ message: 'Redefinindo senha...' });
    const res = await resetPasswordMutation({ token, password: data.password });
    if (res.success) {
      toast({ type: 'dismiss' });
      setIsSuccess(true);
    } else toast({ type: res.type, message: res.message });
  };

  if (!token) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border rounded-2xl shadow-sm p-8 text-center flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Link inválido</h2>
          <p className="text-muted-foreground text-sm">
            O link de redefinição de senha está ausente ou é inválido. Por favor, solicite a recuperação de senha novamente.
          </p>
          <Button className="w-full mt-4" onClick={() => navigate(APP_ROUTES.FORGOT_PASSWORD)}>
            Solicitar nova recuperação
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-background">
      {/* Lado Esquerdo - Branding/Informações (Oculto em telas menores) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-zinc-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-black/80 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <Truck className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Control Frotas</span>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            {isSuccess ? (
              <>Tudo certo <br /> por aqui!</>
            ) : (
              <>Crie sua nova <br /> senha de acesso.</>
            )}
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-md font-medium">
            {isSuccess 
              ? 'Sua senha foi redefinida com sucesso. Você já pode acessar a plataforma novamente.'
              : 'Por questões de segurança, crie uma senha forte utilizando letras, números e símbolos.'
            }
          </p>
        </div>

        <div className="relative z-10 text-sm font-medium text-zinc-500">
          &copy; {new Date().getFullYear()} JL Software. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulários */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md flex flex-col gap-10">
          
          <div className="md:hidden flex items-center gap-3 justify-center mb-4">
            <div className="p-2.5 bg-primary rounded-xl shadow-sm">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Control Frotas</span>
          </div>

          {!isSuccess ? (
            <>
              <div className="flex flex-col gap-2 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Redefinir senha</h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Crie e confirme a sua nova senha abaixo.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <InputPassword
                  label="Nova senha"
                  placeholder="••••••••"
                  iconPreffix={<Lock className="h-4 w-4" />}
                  message={errors.password?.message}
                  {...register('password')}
                />

                <InputPassword
                  label="Confirme a nova senha"
                  placeholder="••••••••"
                  iconPreffix={<Lock className="h-4 w-4" />}
                  message={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
                
                <Button type="submit" className="w-full mt-2" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Redefinindo...' : 'Redefinir Senha'}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center gap-6 py-8">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Senha redefinida!</h2>
                <p className="text-muted-foreground text-sm sm:text-base px-4">
                  Sua senha foi alterada com sucesso. Utilize sua nova senha para acessar o sistema.
                </p>
              </div>
              <Button 
                className="w-full mt-4" 
                size="lg" 
                onClick={() => navigate(APP_ROUTES.LOGIN)}
              >
                Fazer login agora
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
