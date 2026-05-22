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
      className={cn('mx-auto w-full rounded-xl border border-border bg-white p-7 shadow-2xl shadow-slate-950/10', className)}
      {...props}
    >
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-3 lg:hidden">
          <div className="flex size-12 items-center justify-center rounded-lg border bg-white shadow-sm">
            <img src="/logo.png" alt="PIZZA FIVE GUYS logo" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-foreground">PIZZA FIVE GUYS</p>
            <p className="text-xs text-muted-foreground">Central kitchen management</p>
          </div>
        </div>
        <p className="text-sm font-semibold text-primary">Đăng nhập hệ thống</p>
        <h1 className="mt-2 text-3xl font-black tracking-normal text-foreground">Chào mừng trở lại</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Sử dụng tài khoản được cấp để truy cập đúng phân hệ vận hành.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="username" className="text-sm font-semibold text-foreground">
              Tài khoản
            </FieldLabel>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User className="h-4 w-4" />
              </span>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Nhập tài khoản"
                className="h-11 pl-10"
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
              <FieldDescription className="mt-1 text-xs text-rose-600">{errors.username.message}</FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password" className="text-sm font-semibold text-foreground">
              Mật khẩu
            </FieldLabel>
            <div className="relative mt-1.5">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-4 w-4" />
              </span>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Nhập mật khẩu"
                className="h-11 pl-10 pr-11"
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
              <FieldDescription className="mt-1 text-xs text-rose-600">{errors.password.message}</FieldDescription>
            )}
          </Field>

          {error && (
            <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <Field>
            <Button type="submit" size="lg" className="h-11 w-full justify-between px-4" disabled={isLoading}>
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
