
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Agendamento } from '../types/agendamentos';

interface StatusBadgeProps {
  status: Agendamento['status'];
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export default function StatusBadge({ status, onPress, size = 'medium' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pendente':
        return {
          color: '#FFA500',
          text: 'Pendente',
          icon: '⏳',
          description: 'Aguardando confirmação'
        };
      case 'confirmado':
        return {
          color: '#4CAF50',
          text: 'Confirmado',
          icon: '✓',
          description: 'Confirmado por ambas as partes'
        };
      case 'concluido':
        return {
          color: '#2196F3',
          text: 'Concluído',
          icon: '✓✓',
          description: 'Entrega realizada com sucesso'
        };
      case 'cancelado':
        return {
          color: '#F44336',
          text: 'Cancelado',
          icon: '✕',
          description: 'Entrega cancelada'
        };
      default:
        return {
          color: '#999',
          text: 'Desconhecido',
          icon: '?',
          description: ''
        };
    }
  };

  const config = getStatusConfig();
  
  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      text: styles.textSmall,
    },
    medium: {
      container: styles.containerMedium,
      text: styles.textMedium,
    },
    large: {
      container: styles.containerLarge,
      text: styles.textLarge,
    },
  };

  const Badge = (
    <View style={[
      styles.container,
      sizeStyles[size].container,
      { backgroundColor: config.color }
    ]}>
      <Text style={[styles.icon, sizeStyles[size].text]}>{config.icon}</Text>
      <Text style={[styles.text, sizeStyles[size].text]}>{config.text}</Text>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Badge}
      </TouchableOpacity>
    );
  }

  return Badge;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  containerMedium: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  containerLarge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  icon: {
    color: '#ffffff',
  },
  text: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 10,
  },
  textMedium: {
    fontSize: 11,
  },
  textLarge: {
    fontSize: 13,
  },
});