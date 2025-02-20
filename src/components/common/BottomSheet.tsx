import theme from '@/themes';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import type React from 'react';
import { cloneElement, createContext, useCallback, useContext, useRef } from 'react';

interface BottomSheetContextType {
    bottomSheetRef: React.RefObject<BottomSheetModal>;
    handleBottomSheet: (open: boolean) => void;
}
const BottomSheetContext = createContext<BottomSheetContextType | undefined>(undefined);

export const useBottomSheet = () => {
    const context = useContext(BottomSheetContext);
    if (!context) {
        throw new Error('useBottomSheet must be used within a BottomSheetProvider');
    }
    return context;
};

type BottomSheetTriggerProps = {
    // biome-ignore lint/suspicious/noExplicitAny: Todo à handle
    children: any;
};
export function BottomSheetTrigger({ children }: BottomSheetTriggerProps) {
    const { bottomSheetRef, handleBottomSheet } = useBottomSheet();

    return cloneElement(children, { onPress: () => handleBottomSheet(true) });
}

export function BottomSheetProvider({ children }: { children: React.ReactNode }) {
    const handleBottomSheet = (open: boolean) => {
        if (open) {
            bottomSheetRef.current?.present();
        } else {
            bottomSheetRef.current?.dismiss();
        }
    };

    const bottomSheetRef = useRef<BottomSheetModal>(null);

    return (
        <BottomSheetContext.Provider value={{ bottomSheetRef, handleBottomSheet }}>
            {children}
        </BottomSheetContext.Provider>
    );
}

type BottomSheetProps = {
    children: React.ReactNode;
};
export  function BottomSheet({ children }: BottomSheetProps) {
    const { bottomSheetRef } = useBottomSheet();

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            backgroundStyle={{ backgroundColor: theme.card }}
            handleIndicatorStyle={{ backgroundColor: theme.textPrimary }}
        >
            <BottomSheetView className="bg-card px-5 pt-8 gap-2">{children}</BottomSheetView>
        </BottomSheetModal>
    );
}
