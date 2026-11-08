import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Chip, EmptyState } from '../../components/ui';
import { colors, radius } from '../../constants/theme';
import { useApp } from '../../context/AppContext';
import { aiService, modeLabels } from '../../services/aiService';
import type { AIMode, ChatMessage } from '../../types';

const suggestions = ['React Native component гэж юу вэ?', 'SQL JOIN-ийг тайлбарла', 'Supabase RLS яаж ажилладаг вэ?'];

export default function TutorScreen() {
  const { chat, addChat, clearChat } = useApp();
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AIMode>('explain');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  async function send(text?: string) {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    setInput('');
    addChat({ role: 'user', text: question, mode });
    setLoading(true);
    try {
      const answer = await aiService.ask(question, mode);
      addChat({ role: 'assistant', text: answer, mode });
    } catch {
      addChat({ role: 'assistant', text: 'Уучлаарай, хариулт авахад алдаа гарлаа. Дахин оролдоно уу.' });
    } finally {
      setLoading(false);
    }
  }

  function confirmClear() {
    Alert.alert('Чатыг цэвэрлэх үү?', 'Бүх мессеж устгагдана.', [
      { text: 'Болих', style: 'cancel' },
      { text: 'Цэвэрлэх', style: 'destructive', onPress: clearChat },
    ]);
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      {aiService.isMock ? (
        <View style={styles.banner}>
          <Ionicons name="information-circle" size={18} color={colors.warning} />
          <Text style={styles.bannerText}>Туршилтын (mock) туслах. Бодит AI холбогдоогүй, хариултууд нь жишээ.</Text>
        </View>
      ) : null}

      <View style={styles.modes}>
        {(Object.keys(modeLabels) as AIMode[]).map((m) => (
          <Chip key={m} label={modeLabels[m]} selected={mode === m} onPress={() => setMode(m)} />
        ))}
        {chat.length ? (
          <Pressable onPress={confirmClear} hitSlop={8} style={{ marginLeft: 'auto' }}>
            <Ionicons name="trash-outline" size={20} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      <FlatList
        ref={listRef}
        data={chat}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 10, flexGrow: 1 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={item.role === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ gap: 12 }}>
            <EmptyState icon="sparkles" title="Юу асуумаар байна?" subtitle="Горимоо сонгоод асуултаа бичнэ үү. Жишээ асуултууд:" />
            {suggestions.map((s) => (
              <Pressable key={s} onPress={() => send(s)} style={styles.suggestion}>
                <Text style={styles.suggestionText}>{s}</Text>
              </Pressable>
            ))}
          </View>
        }
        ListFooterComponent={
          loading ? (
            <View style={styles.typing}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.typingText}>Хариулт бэлдэж байна…</Text>
            </View>
          ) : null
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder={`${modeLabels[mode]} горимоор асуух…`}
          placeholderTextColor={colors.muted}
          style={styles.input}
          multiline
          maxLength={500}
        />
        <Pressable
          onPress={() => send()}
          disabled={!input.trim() || loading}
          style={[styles.send, (!input.trim() || loading) && { opacity: 0.4 }]}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  banner: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.warningSoft, paddingHorizontal: 16, paddingVertical: 10 },
  bannerText: { flex: 1, fontSize: 12, color: colors.text },
  modes: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingHorizontal: 16, paddingTop: 12 },
  bubble: { maxWidth: '85%', padding: 12, borderRadius: radius.md },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  botBubble: { alignSelf: 'flex-start', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  userText: { color: '#FFFFFF', fontSize: 15 },
  botText: { color: colors.text, fontSize: 15, lineHeight: 21 },
  suggestion: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12 },
  suggestionText: { color: colors.primary, fontWeight: '600' },
  typing: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingTop: 4 },
  typingText: { color: colors.muted, fontSize: 13 },
  inputRow: { flexDirection: 'row', gap: 10, padding: 12, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, alignItems: 'flex-end' },
  input: { flex: 1, maxHeight: 110, backgroundColor: colors.bg, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.text },
  send: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
