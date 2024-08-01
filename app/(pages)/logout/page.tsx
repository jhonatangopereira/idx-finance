'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import nookies from 'nookies'; // Importe nookies para manipulação de cookies

const LogoutPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Remove o token do cookie
      nookies.destroy(null, 'authToken');
      nookies.destroy(null, 'userId');
      
      // Redireciona o usuário para a página de login
      router.replace(`${process.env.NEXT_PUBLIC_ACCOUNTS_DOMAIN_URL}`);
    }, 1500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div style={{ display: 'flex', margin: '0 auto', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner"></div>
      <style jsx>{`
        .spinner {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top-color: #007afd;
          animation: spinnerAnim 1s infinite linear;
        }

        @keyframes spinnerAnim {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default LogoutPage;
