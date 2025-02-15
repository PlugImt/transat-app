import Page from '@/components/common/Page';
import { Text } from 'react-native';
import { Button } from 'react-native-paper';
import useAuth from '@/hooks/useAuth';

export const Account = () => {
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            alert('Logged out restart the app');
        } catch (err) {
            console.error('Error logging out');
        }
    };

    return (
        <Page>
            <Text className="h1 m-4">Account</Text>

            <Button mode="contained" onPress={
                handleLogout
            }>
                Logout
            </Button>
        </Page>
    );
};

export default Account;
