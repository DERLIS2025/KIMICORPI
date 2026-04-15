import { useEffect, type ReactNode } from 'react';
import { useNavigate } from '@/app/router';
import { useAuth } from '@/providers/AuthProvider';

export function RequireAdminAuth({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const isAuthed = Boolean(user);

  useEffect(() => {
    if (!loading && !isAuthed) {
      navigate('/admin/login');
    }
  }, [isAuthed, loading, navigate]);

  if (loading || !isAuthed) return null;

  return <>{children}</>;
}
