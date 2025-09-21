
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors } from '../styles/commonStyles';

interface SimpleBottomSheetProps {
  children?: React.ReactNode;
  isVisible?: boolean;
  onClose?: () => void;
}

const SNAP_POINTS = [0, 0.5, 0.9]; // Closed, Half, Full
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SimpleBottomSheet({
  children,
  isVisible = false,
  onClose,
}: SimpleBottomSheetProps) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [currentSnapPoint, setCurrentSnapPoint] = useState(0);

  useEffect(() => {
    if (isVisible) {
      snapToPoint(1); // Open to half height
    } else {
      snapToPoint(0); // Close
    }
  }, [isVisible]);

  const snapToPoint = (pointIndex: number) => {
    const point = SNAP_POINTS[pointIndex];
    const toValue = SCREEN_HEIGHT * (1 - point);
    
    setCurrentSnapPoint(pointIndex);
    
    Animated.parallel([
      Animated.spring(translateY, {
        toValue,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.timing(backdropOpacity, {
        toValue: point > 0 ? 0.5 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (pointIndex === 0 && onClose) {
        onClose();
      }
    });
  };

  const getClosestSnapPoint = (currentY: number, velocityY: number): number => {
    const currentPoint = 1 - currentY / SCREEN_HEIGHT;
    
    // If moving fast, snap to direction of movement
    if (Math.abs(velocityY) > 1000) {
      return velocityY > 0 ? 0 : SNAP_POINTS.length - 1;
    }
    
    // Find closest snap point
    let closest = 0;
    let minDistance = Math.abs(currentPoint - SNAP_POINTS[0]);
    
    for (let i = 1; i < SNAP_POINTS.length; i++) {
      const distance = Math.abs(currentPoint - SNAP_POINTS[i]);
      if (distance < minDistance) {
        minDistance = distance;
        closest = i;
      }
    }
    
    return closest;
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      const currentY = SCREEN_HEIGHT * (1 - SNAP_POINTS[currentSnapPoint]);
      const newY = Math.max(0, currentY + gestureState.dy);
      translateY.setValue(newY);
    },
    onPanResponderRelease: (_, gestureState) => {
      const currentY = SCREEN_HEIGHT * (1 - SNAP_POINTS[currentSnapPoint]) + gestureState.dy;
      const closestPoint = getClosestSnapPoint(currentY, gestureState.vy);
      snapToPoint(closestPoint);
    },
  });

  const handleBackdropPress = () => {
    snapToPoint(0);
  };

  if (!isVisible && currentSnapPoint === 0) {
    return null;
  }

  return (
    <Modal
      visible={isVisible || currentSnapPoint > 0}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle */}
          <View style={styles.handle} />
          
          {/* Content */}
          <View style={styles.content}>
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: SCREEN_HEIGHT * 0.5,
    maxHeight: SCREEN_HEIGHT * 0.9,
    boxShadow: `0px -4px 20px ${colors.shadow}`,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingBottom: 40,
  },
});
