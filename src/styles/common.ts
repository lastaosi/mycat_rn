import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#FF6B6B',
  background: '#F9F9F9',
  text: '#333',
  subText: '#888',
  white: '#fff',
  border: '#eee',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  cardShadow: '#000',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 60,
    marginBottom: 16,
  },
  // 카드 공통 스타일
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  // 헤더 공통 스타일
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  // 버튼 공통 스타일
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center' as const,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: 'bold' as const,
    fontSize: 16,
  },
  // 인풋 공통 스타일
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  // 로딩 컨테이너
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  // 빈 화면
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: colors.subText,
  },
  emptySubText: {
    fontSize: 14,
    color: colors.subText,
    marginTop: 8,
  },
  // 라벨
  label: {
    fontSize: 14,
    color: colors.subText,
    marginBottom: 6,
    marginTop: 16,
  },
});