import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { mobileAudioService } from '../services/audioService';

export default function SummaryScreen({ route, navigation }) {
  const { docId } = route.params || {};
  const { colors, isDark } = useTheme();
  const { selectedLanguage, openLanguageModal } = useLanguage();

  const [docData, setDocData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [activeTab, setActiveTab] = useState('narrative'); // narrative, bullets, takeaways
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop speech when leaving screen
  useEffect(() => {
    return () => {
      mobileAudioService.stop();
    };
  }, []);

  const handleSpeak = () => {
    if (isPlaying) {
      mobileAudioService.stop();
      setIsPlaying(false);
      return;
    }

    let textToSpeak = '';
    if (activeTab === 'narrative') {
      textToSpeak = summaryData?.executive_summary || '';
    } else if (activeTab === 'bullets') {
      textToSpeak = (summaryData?.bullet_points || []).join('. ');
    } else if (activeTab === 'takeaways') {
      textToSpeak = (summaryData?.key_takeaways || []).join('. ');
    }

    if (!textToSpeak) return;

    mobileAudioService.playNativeSpeech(
      textToSpeak,
      selectedLanguage?.code || 'en',
      () => setIsPlaying(true),
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const fetchSummary = async () => {
    if (!docId) return;
    setLoading(true);
    try {
      const [docRes, sumRes] = await Promise.all([
        api.get(`/documents/${docId}`),
        api.get(`/ai/summary/${docId}?target_language=${selectedLanguage?.code || 'en'}`)
      ]);
      setDocData(docRes.data);
      setSummaryData(sumRes.data);
    } catch (e) {
      console.error('Error fetching summary:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [docId, selectedLanguage?.code]);

  const handleShare = async () => {
    try {
      const text = `${docData?.original_name} - AI Summary (${selectedLanguage?.native}):\n\n${summaryData?.executive_summary || ''}`;
      await Share.share({ message: text });
    } catch (e) {}
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          Synthesizing in {selectedLanguage?.native}...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* Header with Language Switcher */}
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[styles.docTitle, { color: colors.text }]}>
            {docData?.original_name || 'Document Intelligence'}
          </Text>
          <Text style={[styles.docSub, { color: colors.textMuted }]}>
            {docData?.word_count || 0} words • {docData?.page_count || 1} pages
          </Text>
        </View>

        <TouchableOpacity onPress={openLanguageModal} style={[styles.langChip, { borderColor: colors.primary, backgroundColor: colors.card }]}>
          <Text style={{ fontSize: 16 }}>{selectedLanguage?.flag}</Text>
          <Text style={[styles.langChipText, { color: colors.primary }]}>{selectedLanguage?.native}</Text>
        </TouchableOpacity>
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Chat', { docId })}
          style={[styles.chatBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.chatBtnText}>💬 Q&A Chat</Text>
        </TouchableOpacity>

        {/* Listen Voice Button */}
        <TouchableOpacity
          onPress={handleSpeak}
          style={[
            styles.voiceBtn,
            {
              backgroundColor: isPlaying ? 'rgba(239, 68, 68, 0.15)' : 'rgba(2, 132, 199, 0.12)',
              borderColor: isPlaying ? '#ef4444' : colors.primary
            }
          ]}
        >
          <Text style={{ color: isPlaying ? '#ef4444' : colors.primary, fontWeight: 'bold', fontSize: 12 }}>
            {isPlaying ? '⏹️ Stop' : `🔊 Listen (${selectedLanguage?.native})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={[styles.shareBtn, { borderColor: colors.cardBorder, backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 12 }}>🔗 Share</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        {[
          { key: 'narrative', label: 'Executive' },
          { key: 'bullets', label: 'Bullets' },
          { key: 'takeaways', label: 'Takeaways' }
        ].map((t) => {
          const active = activeTab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              onPress={() => setActiveTab(t.key)}
              style={[
                styles.tabItem,
                active && { backgroundColor: colors.primary, borderRadius: 12 }
              ]}
            >
              <Text style={{ color: active ? '#ffffff' : colors.textMuted, fontWeight: 'bold', fontSize: 12 }}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Content Area */}
      <View style={[styles.contentCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        {activeTab === 'narrative' && (
          <View>
            <Text style={[styles.sectionHeading, { color: colors.primary }]}>
              {selectedLanguage?.native} Executive Narrative
            </Text>
            <Text style={[styles.bodyText, { color: colors.text }]}>
              {summaryData?.executive_summary || 'No narrative generated.'}
            </Text>
          </View>
        )}

        {activeTab === 'bullets' && (
          <View>
            <Text style={[styles.sectionHeading, { color: colors.primary }]}>
              Key Structural Points
            </Text>
            {(summaryData?.bullet_points || []).map((bp, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={{ color: colors.primary, fontSize: 16 }}>•</Text>
                <Text style={[styles.bulletText, { color: colors.text }]}>{bp}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'takeaways' && (
          <View>
            <Text style={[styles.sectionHeading, { color: colors.primary }]}>
              Critical Takeaways & Decisions
            </Text>
            {(summaryData?.key_takeaways || []).map((kt, i) => (
              <View key={i} style={[styles.takeawayCard, { backgroundColor: isDark ? '#0284c715' : '#f0f9ff', borderColor: colors.cardBorder }]}>
                <Text style={[styles.takeawayText, { color: colors.text }]}>💡 {kt}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Telemetry Metrics */}
      <View style={[styles.metricsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.metricsTitle, { color: colors.textMuted }]}>AI INFERENCE TELEMETRY</Text>
        <View style={styles.metricsRow}>
          <Text style={[styles.metricItem, { color: colors.text }]}>
            ⚡ Latency: <Text style={{ color: colors.success, fontWeight: 'bold' }}>{summaryData?.inference_latency_ms || 850}ms</Text>
          </Text>
          <Text style={[styles.metricItem, { color: colors.text }]}>
            🤖 Model: <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Qwen-27B (Groq)</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 50 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, fontWeight: 'bold' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  docTitle: { fontSize: 18, fontWeight: 'bold', maxWidth: 220 },
  docSub: { fontSize: 12, marginTop: 2 },
  langChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  langChipText: { fontSize: 12, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 8, marginBottom: 16, alignItems: 'center' },
  chatBtn: { flex: 1.2, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  chatBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  voiceBtn: { flex: 1.4, paddingVertical: 12, paddingHorizontal: 10, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  shareBtn: { paddingHorizontal: 12, paddingVertical: 12, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  tabBar: { flexDirection: 'row', padding: 4, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  tabItem: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  contentCard: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 16 },
  sectionHeading: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  bodyText: { fontSize: 14, lineHeight: 22 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  bulletText: { fontSize: 14, flex: 1, lineHeight: 20 },
  takeawayCard: { padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  takeawayText: { fontSize: 13, lineHeight: 19 },
  metricsCard: { padding: 16, borderRadius: 18, borderWidth: 1 },
  metricsTitle: { fontSize: 10, fontWeight: 'bold', letterSpacing: 0.8, marginBottom: 6 },
  metricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metricItem: { fontSize: 12 }
});
