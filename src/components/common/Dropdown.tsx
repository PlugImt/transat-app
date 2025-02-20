import theme from '@/themes';
import { Picker } from '@react-native-picker/picker';
import { ChevronDown } from 'lucide-react-native';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { Button } from './Button';
import { Dialog, DialogContent, DialogTrigger, useDialog } from './Dialog';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import { BottomSheet, BottomSheetProvider, BottomSheetTrigger } from './BottomSheet';

type DropdownProps = {
    options: string[];
    selectedValue: string;
    onValueChange: (value: string) => void;
    icon?: React.ReactNode;
    label: string;
    placeholder: string;
};

const Dropdown = ({
    options,
    selectedValue,
    onValueChange,
    icon,
    label,
    placeholder,
}: DropdownProps) => {
    const { t } = useTranslation();
    const [currentValue, setCurrentValue] = useState(selectedValue);

    useEffect(() => {
        setCurrentValue(selectedValue);
    }, [selectedValue]);

    const handleCancel = () => {
        onValueChange(selectedValue);
    };

    return (
        <BottomSheetProvider>
          <BottomSheetTrigger>
            <TouchableOpacity
                className="flex-row items-center justify-between bg-[#22222222] rounded-lg px-3 h-12"
            >
                <View className="flex-row items-center gap-2">
                    {icon ? icon : null}
                    <Text className="text-foreground">
                        {currentValue ? currentValue : placeholder}
                    </Text>
                </View>
                <ChevronDown color={theme.textPrimary} size={20} />
            </TouchableOpacity>
          </BottomSheetTrigger>

            <BottomSheet>
                <Text className="h2">{placeholder}</Text>
                <Picker
                    selectedValue={currentValue}
                    onValueChange={(itemValue) => {
                        onValueChange(itemValue);
                    }}
                >
                    {options.map((option) => (
                        <Picker.Item key={option} label={option} value={option} />
                    ))}
                </Picker>
            </BottomSheet>
        </BottomSheetProvider>
    );
};

export default Dropdown;
