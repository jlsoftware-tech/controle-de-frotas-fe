import logo from '@/assets/logo.png';
import { useLogin } from '@/modules/auth/hooks/useLogin';
import { loginSchema, type LoginFormValues } from '@/modules/auth/schemas/login.schema';
import useAuthStore from '@/modules/auth/store/useAuthStore';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { Button } from '@/shared/components/ui/button';
import { Input, InputPassword } from '@/shared/components/ui/input';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import useToastLoading from '@/shared/hooks/useToastLoading';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const toast = useToastLoading();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync: loginMutation } = useLogin();

  const onSubmit = async (data: LoginFormValues) => {
    toast({ message: 'Entrando...' });
    const res = await loginMutation(data);
    if (res.success && res.token && res.data) {
      setToken(res.token);
      setUser(res.data);
      navigate(APP_ROUTES.HOME);
    }
    toast({ type: res.type, message: res.message });
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-background">
      {/* Lado Esquerdo - Branding/Informações (Oculto em telas menores) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-zinc-900 text-white relative overflow-hidden">
        {/* Efeito de Gradiente no Fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-black/80 z-0 pointer-events-none"></div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="flex items-center justify-center p-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl">
            <img
              src={logo}
              alt="Logo"
              className="w-20 h-auto object-contain drop-shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold tracking-tight text-white drop-shadow-sm leading-none mb-1">
              Control Frotas
            </span>
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
              Gestão Inteligente
            </span>
          </div>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Controle total da <br /> sua frota.
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-md font-medium">
            Gerencie veículos, motoristas e manutenções de forma centralizada e
            inteligente.
          </p>
        </div>

        <div className="relative z-10 text-sm font-medium text-zinc-500">
          &copy; {new Date().getFullYear()} JL Software. Todos os direitos
          reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute top-8 right-8">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md flex flex-col gap-10 mt-8 md:mt-0">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-4 justify-center mb-6">
            <div className="flex items-center justify-center p-2 bg-primary/5 border border-primary/10 rounded-xl shadow-sm">
              <img
                src={logo}
                alt="Logo"
                className="w-16 h-auto object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-extrabold tracking-tight text-foreground leading-none mb-1">
                Control Frotas
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Gestão Inteligente
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Bem-vindo de volta
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Insira suas credenciais para acessar a plataforma.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <Input
              type="email"
              label="E-mail"
              placeholder="seu@email.com"
              iconPreffix={<Mail className="h-4 w-4" />}
              message={errors.email?.message}
              {...register('email')}
            />

            <div className="flex flex-col gap-2">
              <InputPassword
                label="Senha"
                placeholder="••••••••"
                iconPreffix={<Lock className="h-4 w-4" />}
                message={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end">
                <Link
                  to={APP_ROUTES.FORGOT_PASSWORD}
                  className="text-sm font-medium text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar na Plataforma'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Não tem uma conta?{' '}
            <a
              href="#"
              className="font-medium text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Fale com o suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
