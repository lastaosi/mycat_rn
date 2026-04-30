import { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../styles/common';
import { useRegister } from '../hooks/useRegister';  // ← 훅으로 교체

export default function RegisterScreen() {
  const router = useRouter();
  const { isLoading, saveCat } = useRegister();  // ← Repository 직접 접근 제거

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'UNKNOWN'>('UNKNOWN');
  const [isNeutered, setIsNeutered] = useState(false);
  const [memo, setMemo] = useState('');

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('알림', '이름을 입력해주세요');
      return;
    }
    if (!birthDate.trim()) {
      Alert.alert('알림', '생년월을 입력해주세요');
      return;
    }

    const success = await saveCat({
      name: name.trim(),
      birthDate,
      gender,
      breedId: null,
      breedNameCustom: null,
      photoPath: null,
      isNeutered,
      isRepresentative: true,
      memo: memo.trim() || null,
      createdAt: Date.now(),
    });

    if (success) {
      router.replace('/main');
    } else {
      Alert.alert('오류', '고양이 등록 중 오류가 발생했습니다');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>고양이 등록</Text>

      <Text style={styles.label}>이름</Text>
      <TextInput
        style={styles.input}
        placeholder="고양이 이름"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>생년월 * (예: 2023-03)</Text>
      <TextInput
        style={styles.input}
        placeholder="2023-03"
        value={birthDate}
        onChangeText={setBirthDate}
        keyboardType="numeric"
      />

      <Text style={styles.label}>성별</Text>
      <View style={styles.genderRow}>
        {(['MALE', 'FEMALE', 'UNKNOWN'] as const).map((g) => (
          <Pressable
            key={g}
            style={[styles.genderButton, gender === g && styles.genderButtonActive]}
            onPress={() => setGender(g)}
          >
            <Text style={[styles.genderText, gender === g && styles.genderTextActive]}>
              {g === 'MALE' ? '수컷' : g === 'FEMALE' ? '암컷' : '모름'}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>중성화 여부</Text>
      <Pressable
        style={[styles.toggleButton, isNeutered && styles.toggleButtonActive]}
        onPress={() => setIsNeutered((prev) => !prev)}
      >
        <Text style={[styles.toggleText, isNeutered && styles.toggleTextActive]}>
          {isNeutered ? '완료' : '미완료'}
        </Text>
      </Pressable>

      <Text style={styles.label}>메모</Text>
      <TextInput
        style={[styles.input, styles.memoInput]}
        placeholder="특이사항이나 메모를 입력하세요"
        value={memo}
        onChangeText={setMemo}
        multiline
      />

      <Pressable
        style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? '저장 중...' : '저장하기'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, marginTop: 60 },
  label: { fontSize: 14, color: '#555', marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memoInput: { height: 100, textAlignVertical: 'top' },
  genderRow: { flexDirection: 'row', gap: 8 },
  genderButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  genderButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  genderText: { color: '#555' },
  genderTextActive: { color: colors.white, fontWeight: 'bold' },
  toggleButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  toggleButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { color: '#555' },
  toggleTextActive: { color: colors.white, fontWeight: 'bold' },
  saveButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: colors.white, fontSize: 16, fontWeight: 'bold' },
});