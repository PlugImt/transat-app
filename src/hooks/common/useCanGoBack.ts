import { useNavigationState } from "expo-router/react-navigation";

/**
 * Whether the screen sits above another one in its own stack. Read from the screen's navigator state, so it is right
 * on the first render and follows the stack: asking the router instead sees the previous state when the screen opens,
 * and tab history makes the answer depend on which tab was visited before.
 */
export const useCanGoBack = () =>
  useNavigationState((state) => state.index > 0);
