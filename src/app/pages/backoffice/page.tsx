import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BackofficeContent from '@/app/pages/backoffice/BackofficeContent';

export default async function BackofficePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log('❌ No token found in cookies – redirecting to /');
    redirect('/');
  }

  try {
    const res = await fetch('http://localhost:3000/api/users/me', {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.log('⛔️ Failed to fetch user info');
      redirect('/');
    }

    const data = await res.json();
    if (!data.user || data.user.role !== 'ADMIN') {
      console.log('⛔️ User is not admin:', data.user?.role);
      redirect('/');
    }

    console.log('✅ Admin access granted to:', data.user.email);
    return <BackofficeContent user={data.user} />;
    
  } catch (error) {
    console.error('💥 Error verifying admin:', error);
    redirect('/');
  }
}