import {
  View, Text, StyleSheet, Pressable, ActivityIndicator
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useCatList } from '../hooks/useCatList';
import { colors, commonStyles } from '../styles/common';

export default function MainScreen() {
  const router = useRouter();
  const { representativeCat, isLoading, error,loadCats } = useCatList();

  useFocusEffect(
    useCallback(() => {
      loadCats();
    }, [loadCats])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if(error){
    return (
    <View style={styles.loadingContainer}>
      <Text style={{ color: '#FF3B30', marginBottom: 16 }}>{error}</Text>
      <Pressable onPress={loadCats}>
        <Text style={{ color: '#FF6B6B' }}>다시 시도</Text>
      </Pressable>
    </View>
  );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐱 MyCat</Text>

      {representativeCat && (
        <View style={styles.repCard}>
          <Text style={styles.repName}>{representativeCat.name}</Text>
          <Text style={styles.repInfo}>
            {representativeCat.birthDate} ·{' '}
            {representativeCat.gender === 'MALE'
              ? '수컷'
              : representativeCat.gender === 'FEMALE'
                ? '암컷'
                : '모름'}
          </Text>
        </View>
      )}

      <View style={styles.menuGrid}>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push({ pathname: '/weight', params: { catId: representativeCat?.id } })}
        >
          <Text style={styles.menuEmoji}>⚖️</Text>
          <Text style={styles.menuText}>체중 관리</Text>
        </Pressable>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push({ pathname: '/vaccination', params: { catId: representativeCat?.id } })}
        >
          <Text style={styles.menuEmoji}>💉</Text>
          <Text style={styles.menuText}>예방접종</Text>
        </Pressable>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push({ pathname: '/medication', params: { catId: representativeCat?.id } })}
        >
          <Text style={styles.menuEmoji}>💊</Text>
          <Text style={styles.menuText}>투약</Text>
        </Pressable>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push({ pathname: '/diary', params: { catId: representativeCat?.id } })}
        >
          <Text style={styles.menuEmoji}>📔</Text>
          <Text style={styles.menuText}>다이어리</Text>
        </Pressable>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push('/healthcheck')}
        >
          <Text style={styles.menuEmoji}>🏥</Text>
          <Text style={styles.menuText}>건강 체크</Text>
        </Pressable>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push('/nearbyvet')}
        >
          <Text style={styles.menuEmoji}>🗺️</Text>
          <Text style={styles.menuText}>근처 동물병원</Text>
        </Pressable>
        <Pressable
          style={styles.menuButton}
          onPress={() => router.push('/deviceinfo')}
        >
          <Text style={styles.menuEmoji}>📱</Text>
          <Text style={styles.menuText}>디바이스 정보</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/register')}
      >
        <Text style={styles.addButtonText}>+ 고양이 추가</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: commonStyles.container,
  loadingContainer: commonStyles.loadingContainer,
  title: { ...commonStyles.title },
  repCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  repName: { fontSize: 20, fontWeight: 'bold', color: colors.white, marginBottom: 4 },
  repInfo: { fontSize: 14, color: colors.white, opacity: 0.9 },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  menuButton: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  menuEmoji: { fontSize: 32, marginBottom: 8 },
  menuText: { fontSize: 14, fontWeight: 'bold', color: colors.text },
  addButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
});