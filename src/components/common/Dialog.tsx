import { cloneElement, createContext, useContext, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Text,
} from 'react-native';

import { cn } from '@/lib/utils';
import { Button } from './Button';

interface DialogContextType {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

function Dialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}

// biome-ignore lint/suspicious/noExplicitAny: à être mieux handle
function DialogTrigger({ children }: any) {
    const { setOpen } = useDialog();

    return cloneElement(children, { onPress: () => setOpen(true) });
}

type DialogContentProps = {
    className?: string;
    children: React.ReactNode;
    cancelLabel?: string;
    confirmLabel?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
    title: string;
    isPending?: boolean;
};
function DialogContent({
    className,
    children,
    cancelLabel,
    confirmLabel,
    onCancel,
    onConfirm,
    title,
    isPending,
}: DialogContentProps) {
    const { open, setOpen } = useDialog();

    const handleCancel = () => {
        setOpen(false);
        onCancel?.();
    };

    const handleConfirm = () => {
        setOpen(false);
        onConfirm?.();
    };

    return (
        <Modal
            transparent
            animationType="slide"
            visible={open}
            onRequestClose={() => setOpen(false)}
        >
            <TouchableWithoutFeedback className="w-full h-full" onPress={() => setOpen(false)}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex flex-1 justify-center items-center bg-background/75 w-full"
                >
                    <TouchableOpacity
                        className="border border-border bg-background rounded-lg p-6 shadow-lg w-11/12 max-h-[80%] gap-8"
                        activeOpacity={1}
                    >
                        <Text className="h2">{title}</Text>
                        <ScrollView keyboardShouldPersistTaps="handled">
                            <TouchableOpacity activeOpacity={1} className='pr-6'>
                                <View className={className}>{children}</View>
                            </TouchableOpacity>
                        </ScrollView>
                        {(cancelLabel || confirmLabel) && (
                            <View className="flex-row gap-4 justify-end">
                                {cancelLabel && (
                                    <Button
                                        onPress={handleCancel}
                                        label={cancelLabel}
                                        variant="outlined"
                                    />
                                )}
                                {confirmLabel && (
                                    <Button onPress={handleConfirm} label={confirmLabel} loading={isPending} />
                                )}
                            </View>
                        )}
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

export { Dialog, DialogTrigger, DialogContent, useDialog };
