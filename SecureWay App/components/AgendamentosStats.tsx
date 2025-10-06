// components/AgendamentosStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAgendamentosStats } from '../hooks/useAgendamentos';
import { Agendamento } from '../types/agendamentos';

interface AgendamentosStatsProps {
  agendamentos: Agendamento[];
  variant?: 'motorista' | 'empresa';
}

export default function AgendamentosStats({ agendamentos, variant = 'motorista' }: AgendamentosStatsProps) {
  const stats = useAgendamentosStats(agendamentos);

  const getVariantColors = () => {
    if (variant === 'motorista') {
      return {
        primary: '#5a8a8a',
        secondary: '#3a5a5a',
        background: '#134949',
      };
    }
    return {
      primary: '#55777c',
      secondary: '#3c5656',
      background: '#0f4a4a',
    };
  };

  const colors = getVariantColors();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resumo de Entregas</Text>
      
      <View style={styles.statsGrid}>
        {/* Total */}
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        {/* Próximos */}
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={styles.statNumber}>{stats.proximos}</Text>
          <Text style={styles.statLabel}>Próximos</Text>
        </View>

        {/* Pendentes */}
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <View style={[styles.statusDot, { backgroundColor: '#FFA500' }]} />
          <Text style={styles.statNumber}>{stats.pendentes}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>

        {/* Confirmados */}
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.statNumber}>{stats.confirmados}</Text>
          <Text style={styles.statLabel}>Confirmados</Text>
        </View>

        {/* Concluídos */}
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <View style={[styles.statusDot, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.statNumber}>{stats.concluidos}</Text>
          <Text style={styles.statLabel}>Concluídos</Text>
        </View>

        {/* Cancelados */}
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <View style={[styles.statusDot, { backgroundColor: '#F44336' }]} />
          <Text style={styles.statNumber}>{stats.cancelados}</Text>
          <Text style={styles.statLabel}>Cancelados</Text>
        </View>
      </View>

      {/* Taxas */}
      <View style={styles.taxasContainer}>
        <View style={[styles.taxaCard, { backgroundColor: colors.background }]}>
          <Text style={styles.taxaLabel}>Taxa de Conclusão</Text>
          <Text style={[styles.taxaValue, { color: '#4CAF50' }]}>
            {stats.taxaConclusao}%
          </Text>
        </View>

        <View style={[styles.taxaCard, { backgroundColor: colors.background }]}>
          <Text style={styles.taxaLabel}>Taxa de Cancelamento</Text>
          <Text style={[styles.taxaValue, { color: '#F44336' }]}>
            {stats.taxaCancelamento}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '30%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  statusDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0c4c4',
  },
  taxasContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  taxaCard: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  taxaLabel: {
    fontSize: 12,
    color: '#a0c4c4',
    marginBottom: 8,
    textAlign: 'center',
  },
  taxaValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});