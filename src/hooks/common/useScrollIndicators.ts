import React, { useCallback, useState } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

interface UseScrollIndicatorsProps {
  isOpen: boolean;
}

export const useScrollIndicators = ({ isOpen }: UseScrollIndicatorsProps) => {
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showBottomIndicator, setShowBottomIndicator] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  // Check if content should show bottom indicator
  const checkContentOverflow = useCallback(() => {
    if (scrollViewHeight > 0 && contentHeight > 0) {
      setShowBottomIndicator(contentHeight > scrollViewHeight + 5);
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

    // Show top indicator if scrolled down more than 5px
    setShowTopIndicator(scrollY > 5);

    // Show bottom indicator if there's more content below (with 5px threshold)
    setShowBottomIndicator(scrollY + scrollViewHeight < contentHeight - 5);
  };

  const handleContentSizeChange = (
    _contentWidth: number,
    newContentHeight: number,
  ) => {
    setContentHeight(newContentHeight);
    // Check if content overflows the scroll view
    if (scrollViewHeight > 0) {
      setShowBottomIndicator(newContentHeight > scrollViewHeight + 5);
    }
  };

  const handleScrollViewLayout = (event: {
    nativeEvent: { layout: { height: number } };
  }) => {
    const newScrollViewHeight = event.nativeEvent.layout.height;
    setScrollViewHeight(newScrollViewHeight);
    // Check overflow with new scroll view height
    if (contentHeight > 0) {
      setShowBottomIndicator(contentHeight > newScrollViewHeight + 5);
    }
  };

  return {
    showTopIndicator,
    showBottomIndicator,
    handleScroll,
    handleContentSizeChange,
    handleScrollViewLayout,
  };
};