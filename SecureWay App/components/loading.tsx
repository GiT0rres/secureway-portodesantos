// components/LoadingOverlay.tsx
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type Props = {
  visible: boolean;
  onFinish?: () => void;
};

export default function LoadingOverlay({ visible, onFinish }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          // Fade out
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onFinish?.());
        }, 200); // tempo da tela carregando
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity }]}>
      {/* Pode colocar um logo ou só cor sólida */}
      <View style={styles.inner} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0a3d3d", // cor da transição
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  inner: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0a3d3d", // cor sólida
  },
});
