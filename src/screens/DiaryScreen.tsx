import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../styles/common";
import * as ImagePicker from "expo-image-picker";
import { useDiary } from "../hooks/useDiary";
import { Diary } from "../database/diaryRepository";

type Props = {
  catId: number;
};

export default function DiaryScreen({ catId }: Props) {
  const router = useRouter();
  const { diaries, isLoading, addDiary, removeDiary } = useDiary(catId);

  const [content, setContent] = useState("");
  const [photoPath, setPhotoPath] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("알림", "갤러리 접근 권한이 필요해요");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotoPath(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!content.trim()) {
      Alert.alert("알림", "내용을 입력해주세요");
      return;
    }
    setIsSaving(true);
    try {
      await addDiary(content.trim(), photoPath);
      setContent("");
      setPhotoPath(null);
      setShowForm(false);
    } catch {
      Alert.alert("오류", "저장 중 오류가 발생했습니다");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: number) {
    Alert.alert("삭제", "이 일기를 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await removeDiary(id);
          } catch {
            Alert.alert("오류", "삭제 중 오류가 발생했습니다");
          }
        },
      },
    ]);
  }

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  }

  function renderDiary(item: Diary) {
    return (
      <View key={item.id} style={styles.diaryCard}>
        <View style={styles.diaryHeader}>
          <Text style={styles.diaryDate}>{formatDate(item.createdAt)}</Text>
          <Pressable onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteButton}>🗑️</Text>
          </Pressable>
        </View>
        {item.photoPath && (
          <Image
            source={{ uri: item.photoPath }}
            style={styles.diaryImage}
            resizeMode="cover"
          />
        )}
        <Text style={styles.diaryContent}>{item.content}</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← 뒤로</Text>
        </Pressable>
        <Text style={styles.title}>📔 다이어리</Text>
        <Pressable onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addHeaderButton}>
            {showForm ? "닫기" : "+ 추가"}
          </Text>
        </Pressable>
      </View>

      <ScrollView>
        {/* 입력 폼 */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>일기 작성</Text>

            {/* 사진 선택 */}
            <Pressable style={styles.photoButton} onPress={handlePickImage}>
              {photoPath ? (
                <Image
                  source={{ uri: photoPath }}
                  style={styles.photoPreview}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.photoButtonText}>📷 사진 추가</Text>
              )}
            </Pressable>

            <TextInput
              style={[styles.input, styles.contentInput]}
              value={content}
              onChangeText={setContent}
              placeholder="오늘 별이는 어땠나요?"
              multiline
              textAlignVertical="top"
            />
            <Pressable
              style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? "저장 중..." : "저장"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* 다이어리 목록 */}
        <View style={styles.listContainer}>
          {diaries.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📔</Text>
              <Text style={styles.emptyText}>아직 일기가 없어요</Text>
              <Text style={styles.emptySubText}>
                오늘 별이의 하루를 기록해봐요
              </Text>
            </View>
          ) : (
            diaries.map(renderDiary)
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 60,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: { fontSize: 16, color: colors.primary },
  title: { fontSize: 20, fontWeight: "bold" },
  addHeaderButton: { fontSize: 16, color: colors.primary, fontWeight: "bold" },
  formCard: {
    backgroundColor: colors.white,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  photoButton: {
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  photoButtonText: { fontSize: 16, color: colors.subText },
  photoPreview: { width: "100%", height: "100%" },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  contentInput: { height: 120, textAlignVertical: "top" },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 4,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: colors.white, fontWeight: "bold", fontSize: 16 },
  listContainer: { paddingHorizontal: 16, paddingBottom: 32 },
  diaryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.cardShadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  diaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  diaryDate: { fontSize: 14, color: colors.subText, fontWeight: "bold" },
  deleteButton: { fontSize: 20 },
  diaryImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  diaryContent: { fontSize: 15, color: colors.text, lineHeight: 22 },
  emptyContainer: { alignItems: "center", paddingVertical: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, fontWeight: "bold", color: "#555" },
  emptySubText: { fontSize: 14, color: colors.subText, marginTop: 8 },
});
