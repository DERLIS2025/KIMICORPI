import { useEffect, type ReactNode } from 'react';
import { adminAuthService } from '@/services/admin-auth.service';
import { useNavigate } from '@/app/router';

export function RequireAdminAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const isAuthed = adminAuthService.isAuthenticated();

  useEffect(() => {
    if (!isAuthed) {
      navigate('/admin/login');
    }
  }, [isAuthed, navigate]);

  if (!isAuthed) return null;

  return <>{children}</>;
}
