import { storage } from '@/services/storage/asyncStorage';
import type { User } from '@/types/user';
import { t } from 'i18next';

export async function fetchUser(): Promise<User> {
    const token = await storage.get('token');
    const url = 'https://transat.destimt.fr/api/newf/me';

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error(t('common.errors.unableToFetch'));
    }
    const data = await response.json();
    await storage.set('newf', data);

    return data satisfies User;
}
