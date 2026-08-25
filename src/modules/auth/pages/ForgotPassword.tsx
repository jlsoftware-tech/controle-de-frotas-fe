import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Truck, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { requestResetSchema, type RequestResetFormValues } from '@/modules/auth/schemas/forgotPassword.schema';
import { useForgotPassword } from '@/modules/auth/hooks/useForgotPassword';
import useToastLoading from '@/shared/hooks/useToastLoading';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToastLoading();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RequestResetFormValues>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: { email: '' },
  });

  const { mutateAsync: forgotPasswordMutation } = useForgotPassword();

  const onSubmit = async (data: RequestResetFormValues) => {
    toast({ message: 'Enviando e-mail...' });
    const res = await forgotPasswordMutation({ email: data.email });
    
    if (res.success) {
      toast({ type: 'dismiss' });
      setIsSuccess(true);
    } else toast({ type: res.type, message: res.message });
  };

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
              <>E-mail enviado <br /> com sucesso.</>
            ) : (
              <>Recupere seu acesso <br /> de forma rápida.</>
            )}
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-md font-medium">
            {isSuccess 
              ? 'Verifique sua caixa de entrada. Enviamos um link seguro para você redefinir sua senha.'
              : 'Digite seu e-mail e enviaremos um link com instruções para redefinir sua senha.'
            }
          </p>
        </div>

        <div className="relative z-10 text-sm font-medium text-zinc-500">
          &copy; {new Date().getFullYear()} JL Software. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulários */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 left-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(APP_ROUTES.LOGIN)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Button>
        </div>

        <div className="w-full max-w-md flex flex-col gap-10 mt-12 md:mt-0">
          
          <div className="md:hidden flex items-center gap-3 justify-center mb-4">
            <div className="p-2.5 bg-primary rounded-xl shadow-sm">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Control Frotas</span>
          </div>

          {!isSuccess ? (
            <>
              <div className="flex flex-col gap-2 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Esqueceu a senha?</h2>
                <p className="text-muted-foreground text-sm sm:text-base">Digite o e-mail associado à sua conta e enviaremos um link para redefinir sua senha.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <Input
                  type="email"
                  label="E-mail cadastrado"
                  placeholder="seu@email.com"
                  iconPreffix={<Mail className="h-4 w-4" />}
                  message={errors.email?.message}
                  {...register('email')}
                />
                
                <Button type="submit" className="w-full mt-2" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando link...' : 'Enviar link de recuperação'}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center gap-6 py-8">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Link enviado!</h2>
                <p className="text-muted-foreground text-sm sm:text-base px-4">
                  Se existir uma conta associada a este e-mail, você receberá um link de redefinição de senha em instantes. Verifique também a pasta de spam.
                </p>
              </div>
              <Button 
                className="w-full mt-4" 
                size="lg" 
                onClick={() => navigate(APP_ROUTES.LOGIN)}
              >
                Voltar para o login
              </Button>
            </div>
          )}

          {!isSuccess && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              Lembrou sua senha?{' '}
              <Link to={APP_ROUTES.LOGIN} className="font-medium text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                Fazer login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
