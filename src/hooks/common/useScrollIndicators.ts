import React, { useCallback, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

interface UseScrollIndicatorsProps {
  isOpen: boolean;
}

export const useScrollIndicators = ({ isOpen }: UseScrollIndicatorsProps) => {
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const [topIndicatorOpacity, setTopIndicatorOpacity] = useState(0);
  const [bottomIndicatorOpacity, setBottomIndicatorOpacity] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // Check if content should show bottom indicator
  const checkContentOverflow = useCallback(() => {
    if (scrollViewHeight > 0 && contentHeight > 0) {
      const hasOverflow = contentHeight > scrollViewHeight + 5;
      setShowBottomIndicator(hasOverflow);
      if (hasOverflow) {
        setBottomIndicatorOpacity(1); // Start with full opacity when content overflows
      }
    }
  }, [scrollViewHeight, contentHeight]);

  // Check overflow when dialog opens or dimensions change
  React.useEffect(() => {
    if (isOpen) {
      checkContentOverflow();
    } else {
      // Don't immediately reset - let the exit animation handle it
      setTimeout(() => {
        setShowTopIndicator(false);
        setShowBottomIndicator(false);
        setTopIndicatorOpacity(0);
        setBottomIndicatorOpacity(0);
        setScrollViewHeight(0);
        setContentHeight(0);
      }, 300); // Match the MotiView exit duration
    }
  }, [isOpen, checkContentOverflow]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const scrollViewHeight = layoutMeasurement.height;
    const contentHeight = contentSize.height;

    // Calculate progressive opacity for top indicator
    const fadeDistance = 50; // Distance over which to fade the indicator
    const topOpacity = Math.min(1, Math.max(0, scrollY / fadeDistance));
    setShowTopIndicator(scrollY > 5);
    setTopIndicatorOpacity(topOpacity);

    // Calculate progressive opacity for bottom indicator  
    const maxScroll = contentHeight - scrollViewHeight;
    const remainingScroll = maxScroll - scrollY;
    const bottomOpacity = Math.min(1, Math.max(0, remainingScroll / fadeDistance));
    
    // Show bottom indicator if there's more content below (with 5px threshold)
    const hasBottomContent = scrollY + scrollViewHeight < contentHeight - 5;
    setShowBottomIndicator(hasBottomContent);
    setBottomIndicatorOpacity(hasBottomContent ? bottomOpacity : 0);
  };

  const handleContentSizeChange = (
    _contentWidth: number,
    newContentHeight: number,
  ) => {
    setContentHeight(newContentHeight);
    // Check if content overflows the scroll view
    if (scrollViewHeight > 0) {
      const hasOverflow = newContentHeight > scrollViewHeight + 5;
      setShowBottomIndicator(hasOverflow);
      if (hasOverflow) {
        setBottomIndicatorOpacity(1); // Start with full opacity when content overflows
      }
    }
  };

  const handleScrollViewLayout = (event: {
    nativeEvent: { layout: { height: number } };
  }) => {
    const newScrollViewHeight = event.nativeEvent.layout.height;
    setScrollViewHeight(newScrollViewHeight);
    // Check overflow with new scroll view height
    if (contentHeight > 0) {
      const hasOverflow = contentHeight > newScrollViewHeight + 5;
      setShowBottomIndicator(hasOverflow);
      if (hasOverflow) {
        setBottomIndicatorOpacity(1); // Start with full opacity when content overflows
      }
    }
  };

  return {
    showTopIndicator,
    showBottomIndicator,
    topIndicatorOpacity,
    bottomIndicatorOpacity,
    handleScroll,
    handleContentSizeChange,
    handleScrollViewLayout,
  };
};