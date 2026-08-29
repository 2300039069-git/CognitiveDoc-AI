import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

import { mobileAudioService } from '../services/audioService';

export default function ChatScreen({ route }) {
  const initialDocId = route.params?.docId || null;
  const { colors, isDark } = useTheme();
  const { selectedLanguage, openLanguageModal } = useLanguage();

  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(initialDocId);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [playingMsgId, setPlayingMsgId] = useState(null);
  const flatListRef = useRef(null);

  // Stop speech when leaving screen
  useEffect(() => {
    return () => {
      mobileAudioService.stop();
    };
  }, []);

  const handleSpeak = (msgId, text) => {
    if (playingMsgId === msgId) {
      mobileAudioService.stop();
      setPlayingMsgId(null);
      return;
    }

    mobileAudioService.playNativeSpeech(
      text,
      selectedLanguage?.code || 'en',
      () => setPlayingMsgId(msgId),
      () => setPlayingMsgId(null),
      () => setPlayingMsgId(null)
    );
  };

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get('/documents');
        setDocuments(res.data);
        if (!selectedDocId && res.data.length > 0) {
          setSelectedDocId(res.data[0].id);
        }
      } catch (e) {}
    };
    fetchDocs();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || loading || !selectedDocId) return;

    const userQuery = inputText.trim();
    setInputText('');

    const newMessages = [
      ...messages,
      { id: Date.now().toString(), sender: 'user', text: userQuery }
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await api.post('/ai/query', {
        doc_id: selectedDocId,
        query: userQuery,
        target_language: selectedLanguage?.code || 'en'
      });

      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: res.data.answer,
          citations: res.data.citations || [],
          model: res.data.model_used
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Error generating response. Please check server connection.',
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const currentDoc = documents.find(d => d.id === selectedDocId);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Top Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
            {currentDoc?.original_name || 'Select Document'}
          </Text>
          <Text style={[styles.sub, { color: colors.textMuted }]}>
            Responding in <Text style={{ color: colors.primary, fontWeight: 'bold' }}>{selectedLanguage?.native}</Text>
          </Text>
        </View>

        <TouchableOpacity onPress={openLanguageModal} style={[styles.langChip, { borderColor: colors.primary }]}>
          <Text style={{ fontSize: 16 }}>{selectedLanguage?.flag}</Text>
          <Text style={[styles.langText, { color: colors.primary }]}>{selectedLanguage?.native}</Text>
        </TouchableOpacity>
      </View>

      {/* Message Stream */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.msgList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🤖</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>RAG Grounded Assistant</Text>
            <Text style={[styles.emptySub, { color: colors.textMuted }]}>
              Ask questions about your uploaded document. Answers are strictly verified with source citations.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View style={[styles.msgRow, isUser ? styles.userRow : styles.aiRow]}>
              <View
                style={[
                  styles.bubble,
                  isUser
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.card, borderColor: colors.cardBorder, borderWidth: 1 }
                ]}
              >
                <Text style={[styles.msgText, { color: isUser ? '#ffffff' : colors.text }]}>
                  {item.text}
                </Text>

                {!isUser && !item.isError && (
                  <TouchableOpacity
                    onPress={() => handleSpeak(item.id, item.text)}
                    style={[
                      styles.voiceBtn,
                      {
                        backgroundColor: playingMsgId === item.id ? 'rgba(239, 68, 68, 0.15)' : 'rgba(2, 132, 199, 0.12)',
                        borderColor: playingMsgId === item.id ? '#ef4444' : colors.primary
                      }
                    ]}
                  >
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: playingMsgId === item.id ? '#ef4444' : colors.primary }}>
                      {playingMsgId === item.id ? '⏹️ Stop' : `🔊 Listen (${selectedLanguage?.native})`}
                    </Text>
                  </TouchableOpacity>
                )}

                {item.citations && item.citations.length > 0 && (
                  <View style={styles.citationBox}>
                    <Text style={{ color: colors.primaryLight, fontSize: 11, fontWeight: 'bold', marginBottom: 4 }}>
                      Verified Grounded Sources:
                    </Text>
                    {item.citations.map((cit, idx) => (
                      <Text key={idx} style={{ color: colors.textMuted, fontSize: 10, lineHeight: 14 }}>
                        • Page {cit.page_number || 1}: "{cit.text?.slice(0, 100)}..."
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Input Row */}
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder={`Ask in ${selectedLanguage?.native}...`}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={loading || !inputText.trim()}
          style={[styles.sendBtn, { backgroundColor: inputText.trim() ? colors.primary : (isDark ? '#334155' : '#cbd5e1') }]}
        >
          {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.sendIcon}>➤</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  title: { fontSize: 15, fontWeight: 'bold', maxWidth: 220 },
  sub: { fontSize: 11, marginTop: 2 },
  langChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  langText: { fontSize: 12, fontWeight: 'bold' },
  msgList: { padding: 16, paddingBottom: 20 },
  empty: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  emptySub: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  msgRow: { marginBottom: 14, flexDirection: 'row' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '85%', padding: 14, borderRadius: 18 },
  msgText: { fontSize: 14, lineHeight: 20 },
  voiceBtn: { marginTop: 8, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  citationBox: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  inputContainer: { flexDirection: 'row', padding: 12, borderTopWidth: 1, alignItems: 'center', gap: 10 },
  input: { flex: 1, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
  sendBtn: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  sendIcon: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});
