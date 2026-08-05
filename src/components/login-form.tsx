import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { ArrowRight, Eye, EyeOff, Lock, User } from 'lucide-react';
import { toast } from 'sonner';
import { extractPrimaryRoleFromLoginUser, normalizeToAppRole } from '@/lib/authRole';

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    const { username, password } = data;
    setError(null);
    setIsLoading(true);
    try {
      const payload: any = await authService.signIn(username, password);

      localStorage.setItem('authToken', payload.access_token ?? '');
      localStorage.setItem('refreshToken', payload.refresh_token ?? '');
      if (payload.user) {
        const rawRole = extractPrimaryRoleFromLoginUser(payload.user);
        const normalized = normalizeToAppRole(rawRole);
        const toStore = normalized ?? (rawRole.trim() ? rawRole.trim() : '');
        if (toStore) localStorage.setItem('userRole', toStore);
        else localStorage.removeItem('userRole');
        localStorage.setItem('user', JSON.stringify(payload.user));
      }

      toast.success('Đăng nhập thành công!', {
        description: `Chào mừng ${payload.user?.username || 'bạn'} quay trở lại.`,
      });

      navigate('/', { replace: true });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Đăng nhập thất bại. Vui lòng thử lại.';
      setError(errorMsg);
      toast.error('Đăng nhập thất bại', {
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn('mx-auto w-full rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/5 ring-1 ring-black/[0.02]', className)}
      {...props}
    >
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-3 lg:hidden">
          <div className="flex size-11 items-center justify-center rounded-xl border bg-white p-1.5 shadow-sm">
            <img src="/logo.png" alt="PIZZA FIVE GUYS logo" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wider text-foreground">PIZZA FIVE GUYS</p>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Central kitchen management</p>
          </div>
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Đăng nhập hệ thống</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">Chào mừng trở lại</h1>
        <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
          Sử dụng tài khoản được cấp để truy cập đúng phân hệ vận hành.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel htmlFor="username" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
              Tài khoản
            </FieldLabel>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                <User className="h-4 w-4" />
              </span>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Nhập tài khoản"
                className="h-11 pl-10 rounded-lg border-border focus-visible:border-primary/80 focus-visible:ring-primary/20 bg-background/50 hover:bg-background/80 transition-all text-sm"
                {...register('username', {
                  required: 'Username không được để trống',
                  maxLength: {
                    value: 255,
                    message: 'Username không được vượt quá 255 ký tự',
                  },
                  minLength: {
                    value: 3,
                    message: 'Username phải có ít nhất 3 ký tự',
                  },
                })}
              />
            </div>
            {errors.username && (
              <FieldDescription className="mt-1 text-xs text-rose-500 font-medium">{errors.username.message}</FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90">
              Mật khẩu
            </FieldLabel>
            <div className="relative mt-2">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/60">
                <Lock className="h-4 w-4" />
              </span>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground/60 transition hover:bg-secondary hover:text-foreground"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                className="h-11 pl-10 pr-11 rounded-lg border-border focus-visible:border-primary/80 focus-visible:ring-primary/20 bg-background/50 hover:bg-background/80 transition-all text-sm"
                {...register('password', {
                  required: 'Mật khẩu không được để trống',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự',
                  },
                  maxLength: {
                    value: 120,
                    message: 'Mật khẩu không được vượt quá 120 ký tự',
                  },
                })}
              />
            </div>
            {errors.password && (
              <FieldDescription className="mt-1 text-xs text-rose-500 font-medium">{errors.password.message}</FieldDescription>
            )}
          </Field>

          {error && (
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-xs text-rose-600 font-medium animate-shake">
              {error}
            </div>
          )}

          <Field className="pt-2">
            <Button 
              type="submit" 
              size="lg" 
              className="h-11 w-full justify-center gap-2 rounded-lg font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300" 
              disabled={isLoading}
            >
              <span>{isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}</span>
              <ArrowRight className="size-4" />
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

type FormData = {
  username: string;
  password: string;
};
