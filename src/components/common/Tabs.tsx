import type React from "react";
import { createContext, useContext, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "@/components/common/Text";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}
export const TabsContext = createContext<TabsContextProps>({
  activeTab: "",
  setActiveTab: () => {},
});

interface TabsProps {
  defaultValue?: string;
  /** Controlled mode: the parent owns the selected tab. */
  value?: string;
  onValueChange?: (id: string) => void;
  children: React.ReactNode;
}
const Tabs = ({
  defaultValue = "",
  value,
  onValueChange,
  children,
}: TabsProps) => {
  const [innerTab, setInnerTab] = useState(defaultValue);
  const controlled = value !== undefined;
  const activeTab = controlled ? value : innerTab;
  const setActiveTab = (id: string) => {
    if (!controlled) setInnerTab(id);
    onValueChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

const TabsList = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View>) => {
  return (
    <View
      accessibilityRole="tablist"
      className={cn("flex flex-row justify-center gap-4", className)}
      {...props}
    />
  );
};

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
  value: string;
  title: string;
  textClasses?: string;
}
const TabsTrigger = ({
  value,
  title,
  className,
  textClasses,
  ...props
}: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      className={cn("px-8 py-3 rounded-md flex-1 relative", className)}
      style={{
        backgroundColor: activeTab === value ? theme.card : "transparent",
      }}
      onPress={() => setActiveTab(value)}
      accessibilityRole="tab"
      accessibilityState={{ selected: activeTab === value }}
      {...props}
    >
      <Text className={cn("text-center", textClasses)}>{title}</Text>
      {props.children}
    </TouchableOpacity>
  );
};

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof View> {
  value: string;
}
function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { activeTab } = useContext(TabsContext);

  if (value === activeTab) return <View className={cn(className)} {...props} />;

  return null;
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
