import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/shared/constants/urlRoutes';
import { Button } from '@/shared/components/ui/button';
import { Input, InputPassword } from '@/shared/components/ui/input';
import { Truck, Mail, Lock } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../schemas/login.schema';
import useUserStore from '../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const setToken = useUserStore((s) => s.setToken);
  const setUser = useUserStore((s) => s.setUser);

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

  const onSubmit = async (data: LoginFormValues) => {
    // Simulando uma chamada de API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Mock user data
    setToken('mock-jwt-token-12345');
    setUser({
      id: '1',
      name: 'Administrador do Sistema',
      email: data.email,
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('Login efetuado:', data);
    navigate(APP_ROUTES.HOME);
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-background">
      {/* Lado Esquerdo - Branding/Informações (Oculto em telas menores) */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 bg-zinc-900 text-white relative overflow-hidden">
        {/* Efeito de Gradiente no Fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-black/80 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <Truck className="h-7 w-7 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Control Frotas</span>
        </div>

        <div className="relative z-10 mb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Controle total da <br /> sua frota.
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-md font-medium">
            Gerencie veículos, motoristas e manutenções de forma centralizada e inteligente.
          </p>
        </div>

        <div className="relative z-10 text-sm font-medium text-zinc-500">
          &copy; {new Date().getFullYear()} JL Software. Todos os direitos reservados.
        </div>
      </div>

      {/* Lado Direito - Formulário de Login */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md flex flex-col gap-10">
          
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-3 justify-center mb-4">
            <div className="p-2.5 bg-primary rounded-xl shadow-sm">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">Control Frotas</span>
          </div>

          <div className="flex flex-col gap-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Bem-vindo de volta</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Insira suas credenciais para acessar a plataforma.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
                <a href="#" className="text-sm font-medium text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" size="lg" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar na Plataforma'}
            </Button>
          </form>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            Não tem uma conta?{' '}
            <a href="#" className="font-medium text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
              Fale com o suporte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
