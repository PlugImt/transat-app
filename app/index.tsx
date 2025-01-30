import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ThemeProvider} from 'styled-components';
import {darkTheme, lightTheme} from './themes';
import {RootNavigator} from "@/app/navigation/RootNavigator";
import '../i18n';
import {useTranslation} from "react-i18next"; // Updated import path to point to root i18n.ts

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const {t} = useTranslation();

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <RootNavigator/>
        </ThemeProvider>
    );
};

export default App;