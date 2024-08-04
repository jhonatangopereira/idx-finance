'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { parseCookies, setCookie } from 'nookies';
import { Suspense, useEffect } from 'react';
import authService from '../services/authService';

const withAuth = (WrappedComponent: React.ComponentType) => {
    const Wrapper: React.FC = (props) => {
        const router = useRouter();
        const searchParams = useSearchParams();

        useEffect(() => {
            const cookies = parseCookies();
            const authToken = cookies.authToken || searchParams.get('authToken');
            const user_id = cookies.userId || searchParams.get("user_id");

            if (authToken) {
                setCookie(null, 'authToken', authToken, { path: '/' });
                setCookie(null, 'userId', user_id!, { path: '/' });                
                console.log(parseCookies())
            } else {
                const user = authService.getCurrentUser();
                if (!user) {
                    router.replace(`${"https://accounts.idxfinance.com.br"}`);
                }
            }
        }, [router, searchParams]);

        return <WrappedComponent {...props} />;
    };

    Wrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    const SuspendedWrapper: React.FC = (props) => (
        <Suspense fallback={<div>Carregando...</div>}>
            <Wrapper {...props} />
        </Suspense>
    );

    SuspendedWrapper.displayName = `Suspended${Wrapper.displayName}`;

    return SuspendedWrapper;
};

export default withAuth;