import { createContext, useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils";

interface TabsContextProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}
const TabsContext = createContext<TabsContextProps>({
  activeTab: "",
  setActiveTab: () => {},
});

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}
function Tabs({ defaultValue, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
}

function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof View>) {
  return (
    <View
      className={cn("flex flex-row justify-center gap-4", className)}
      {...props}
    />
  );
}

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
  value: string;
  title: string;
  textClasses?: string;
}
function TabsTrigger({
  value,
  title,
  className,
  textClasses,
  ...props
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      className={cn("px-8 py-3 rounded-md flex-1", className)}
      style={{
        backgroundColor:
          activeTab === value ? theme.foregroundPlaceholder : theme.card,
      }}
      onPress={() => setActiveTab(value)}
      {...props}
    >
      <Text
        className={cn(
          "font-medium text-center text-muted-foreground",
          { "text-background": activeTab === value },
          textClasses,
        )}
        style={{ color: theme.text }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof View> {
  value: string;
}
function TabsContent({ value, className, ...props }: TabsContentProps) {
  const { activeTab } = useContext(TabsContext);

  if (value === activeTab) return <View className={cn(className)} {...props} />;

  return null;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
