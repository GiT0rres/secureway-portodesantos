import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

type SplashScreenProps = {
  onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const translateXAnim = useRef(new Animated.Value(0)).current; 
  const scaleAnim = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    // fade in inicial
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400, // mais rápido
      useNativeDriver: true,
    }).start(() => {
      // loop constante indo esquerda -> centro -> direita -> centro
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateXAnim, {
            toValue: -80,
            duration: 600, // antes 800
            useNativeDriver: true,
          }),
          Animated.timing(translateXAnim, {
            toValue: 0,
            duration: 350, // antes 600
            useNativeDriver: true,
          }),
          Animated.timing(translateXAnim, {
            toValue: 80,
            duration: 600, // antes 800
            useNativeDriver: true,
          }),
          Animated.timing(translateXAnim, {
            toValue: 0,
            duration: 350, // antes 600
            useNativeDriver: true,
          }),
        ])
      ).start();

      // espera e faz o fade out
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400, // saída mais rápida também
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (onFinish) onFinish();
        });
      }, 2500); // tempo total reduzido
    });
  }, [fadeAnim, translateXAnim, scaleAnim, onFinish]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.circle} />
      <Animated.Image
        source={require("../assets/images/android-icon-foreground.png")}
        style={[
          styles.image,
          {
            transform: [
              { translateX: translateXAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00323c",
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#ff8c42",
  },
  image: {
    width: 200,
    height: 200,
  },
});
