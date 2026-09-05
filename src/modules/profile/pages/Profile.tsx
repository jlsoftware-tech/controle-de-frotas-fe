import useAuthStore from '@/modules/auth/store/useAuthStore';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';

export default function Profile() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  const initials = user.name.substring(0, 2).toUpperCase();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e credenciais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border shadow-sm">
          <CardHeader className="flex flex-col items-center gap-4 pt-8">
            <Avatar className="h-28 w-28 border-4 border-background shadow-md">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-1">
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription className="font-medium text-primary">
                {user.role === 'ADMIN' ? 'Administrador' : 'Usuário Padrão'}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-center text-muted-foreground pt-0">
            Membro desde {new Date(user.createdAt).toLocaleDateString()}
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize seus dados básicos. No momento este formulário é apenas
              para demonstração.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1">
              <Input
                name="name"
                label="Nome Completo"
                defaultValue={user.name}
                disabled
              />
            </div>
            <div className="space-y-1">
              <Input
                name="email"
                label="Endereço de E-mail"
                defaultValue={user.email}
                disabled
              />
            </div>
            <div className="space-y-1">
              <Input
                name="role"
                label="Nível de Acesso"
                defaultValue={user.role}
                disabled
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end pt-4 border-t">
            <Button disabled className="w-full sm:w-auto">
              Salvar Alterações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
