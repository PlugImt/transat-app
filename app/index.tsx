import {useTranslation} from 'react-i18next';
import '../i18n';
import Login from "@/app/screens/auth/Login";

export default function Index() {
    const {t} = useTranslation();

    return (
        <Login/>
    );
}