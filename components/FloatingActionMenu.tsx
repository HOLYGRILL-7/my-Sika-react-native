import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  useSharedValue,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Plus, X } from 'lucide-react-native';

interface Action {
  icon: React.ReactNode;
  label?: string;
  onPress: () => void;
  color?: string;
}

interface FloatingActionMenuProps {
  actions: Action[];
  mainIcon?: React.ReactNode;
  mainColor?: string;
}

const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ 
  actions, 
  mainIcon = <Plus size={28} color="white" />,
  mainColor = "#2e7d32"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useSharedValue(0);

  const toggleMenu = () => {
    const newValue = isOpen ? 0 : 1;
    animation.value = withSpring(newValue, {
      damping: 25,
      stiffness: 80,
    });
    setIsOpen(!isOpen);
  };

  const mainButtonStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animation.value, [0, 1], [0, 45]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      {actions.map((action, index) => {
        const actionAnimationStyle = useAnimatedStyle(() => {
          const translateY = interpolate(
            animation.value,
            [0, 1],
            [0, -56 * (index + 1)]
          );
          const scale = interpolate(animation.value, [0, 0.5, 1], [0, 0.5, 1]);
          const opacity = interpolate(animation.value, [0, 0.5, 1], [0, 0, 1]);

          return {
            transform: [{ translateY }, { scale }],
            opacity,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[styles.actionButtonContainer, actionAnimationStyle]}
          >
            {action.label && (
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{action.label}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => {
                toggleMenu();
                action.onPress();
              }}
              style={[
                styles.actionButton,
                { backgroundColor: action.color || mainColor }
              ]}
            >
              {action.icon}
            </TouchableOpacity>
          </Animated.View>
        );
      })}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleMenu}
        style={[styles.mainButton, { backgroundColor: mainColor }]}
      >
        <Animated.View style={mainButtonStyle}>
          {mainIcon}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    alignItems: 'center',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  actionButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 200,
    right: 0,
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  labelContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 12,
  },
  labelText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default FloatingActionMenu;
