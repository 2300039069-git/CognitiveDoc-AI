import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export default function UploadScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { selectedLanguage, openLanguageModal } = useLanguage();

  const [pickedFile, setPickedFile] = useState(null);
  const [summaryType, setSummaryType] = useState('abstractive');
  const [lengthType, setLengthType] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState('');

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPickedFile(result.assets[0]);
      }
    } catch (err) {
      console.error('File pick error:', err);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const handleUploadAndProcess = async () => {
    if (!pickedFile) {
      Alert.alert('File Required', 'Please select a PDF, DOCX, or TXT document first.');
      return;
    }

    setLoading(true);
    setUploadStep('Extracting text & creating embeddings...');

    try {
      // 1. Prepare FormData
      const formData = new FormData();
      formData.append('file', {
        uri: pickedFile.uri,
        name: pickedFile.name,
        type: pickedFile.mimeType || 'application/pdf',
      });
      formData.append('tags', 'Mobile Upload');

      // 2. Upload Document
      const uploadRes = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const docId = uploadRes.data.document.id;

      // 3. Trigger AI Summarization
      setUploadStep(`Generating ${selectedLanguage?.name} executive summary...`);
      await api.post('/ai/summarize', {
        doc_id: docId,
        summary_type: summaryType,
        length: lengthType,
        target_language: selectedLanguage?.code || 'en',
      });

      // 4. Navigate to Summary
      setLoading(false);
      navigation.navigate('Summary', { docId });
    } catch (err) {
      setLoading(false);
      console.error('Processing error:', err);
      Alert.alert('Processing Error', err.response?.data?.detail || 'Failed to process document.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Ingest & Analyze Document</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Upload multi-page PDFs or transcripts for local summarization & RAG Q&A
      </Text>

      {/* Document Picker Box */}
      <TouchableOpacity
        onPress={handlePickDocument}
        style={[
          styles.dropzone,
          {
            backgroundColor: pickedFile ? (isDark ? '#064e3b30' : '#ecfdf5') : colors.card,
            borderColor: pickedFile ? colors.success : colors.cardBorder,
          }
        ]}
      >
        <Text style={{ fontSize: 36, marginBottom: 10 }}>
          {pickedFile ? '📄' : '📁'}
        </Text>
        {pickedFile ? (
          <View style={{ alignItems: 'center' }}>
            <Text numberOfLines={1} style={[styles.fileName, { color: colors.text }]}>
              {pickedFile.name}
            </Text>
            <Text style={[styles.fileSize, { color: colors.success }]}>
              {Math.round((pickedFile.size || 0) / 1024)} KB • Ready to Ingest
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: 11, marginTop: 6 }}>
              Tap to choose a different file
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <Text style={[styles.dropTitle, { color: colors.text }]}>Tap to Pick Document</Text>
            <Text style={[styles.dropSub, { color: colors.textMuted }]}>
              Supports PDF (.pdf), Word (.docx), Text (.txt)
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Language Bar */}
      <View style={[styles.configCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Target Language</Text>
          <TouchableOpacity onPress={openLanguageModal} style={[styles.langChip, { borderColor: colors.primary }]}>
            <Text style={styles.flag}>{selectedLanguage?.flag}</Text>
            <Text style={[styles.langChipText, { color: colors.primary }]}>{selectedLanguage?.native}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Summaries and interactive chatbot will respond strictly in {selectedLanguage?.name}.
        </Text>
      </View>

      {/* Summarization Mode */}
      <View style={[styles.configCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 12 }]}>Summarization Mode</Text>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => setSummaryType('abstractive')}
            style={[
              styles.optBtn,
              {
                borderColor: summaryType === 'abstractive' ? colors.primary : colors.cardBorder,
                backgroundColor: summaryType === 'abstractive' ? (isDark ? '#0284c725' : '#e0f2fe') : colors.inputBg,
              }
            ]}
          >
            <Text style={[styles.optTitle, { color: colors.text }]}>Abstractive AI</Text>
            <Text style={[styles.optSub, { color: colors.textMuted }]}>Executive Narrative</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSummaryType('extractive')}
            style={[
              styles.optBtn,
              {
                borderColor: summaryType === 'extractive' ? colors.primary : colors.cardBorder,
                backgroundColor: summaryType === 'extractive' ? (isDark ? '#0284c725' : '#e0f2fe') : colors.inputBg,
              }
            ]}
          >
            <Text style={[styles.optTitle, { color: colors.text }]}>Extractive</Text>
            <Text style={[styles.optSub, { color: colors.textMuted }]}>TextRank Key Points</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Target Length */}
      <View style={[styles.configCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 12 }]}>Summary Length</Text>
        <View style={styles.lengthRow}>
          {['short', 'medium', 'comprehensive'].map((len) => {
            const active = lengthType === len;
            return (
              <TouchableOpacity
                key={len}
                onPress={() => setLengthType(len)}
                style={[
                  styles.lenBtn,
                  {
                    borderColor: active ? colors.primary : colors.cardBorder,
                    backgroundColor: active ? colors.primary : colors.inputBg,
                  }
                ]}
              >
                <Text style={{ color: active ? '#ffffff' : colors.text, fontWeight: 'bold', textTransform: 'capitalize', fontSize: 12 }}>
                  {len}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Upload Button */}
      <TouchableOpacity
        onPress={handleUploadAndProcess}
        disabled={loading || !pickedFile}
        style={[
          styles.processBtn,
          {
            backgroundColor: pickedFile ? colors.primary : (isDark ? '#1e293b' : '#cbd5e1'),
          }
        ]}
      >
        {loading ? (
          <View style={{ alignItems: 'center', gap: 6 }}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.processSub}>{uploadStep}</Text>
          </View>
        ) : (
          <Text style={styles.processText}>Process & Generate Summary →</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 50 },
  title: { fontSize: 22, fontWeight: 'bold' },
  subtitle: { fontSize: 12, marginTop: 4, marginBottom: 20 },
  dropzone: {
    padding: 30,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 20,
  },
  dropTitle: { fontSize: 16, fontWeight: 'bold' },
  dropSub: { fontSize: 12, marginTop: 4 },
  fileName: { fontSize: 15, fontWeight: 'bold', maxWidth: 240 },
  fileSize: { fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  configCard: { padding: 18, borderRadius: 20, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  langChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  flag: { fontSize: 16 },
  langChipText: { fontSize: 12, fontWeight: 'bold' },
  hint: { fontSize: 11, marginTop: 8 },
  row: { flexDirection: 'row', gap: 10 },
  optBtn: { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1 },
  optTitle: { fontSize: 13, fontWeight: 'bold' },
  optSub: { fontSize: 11, marginTop: 2 },
  lengthRow: { flexDirection: 'row', gap: 8 },
  lenBtn: { flex: 1, paddingVertical: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center' },
  processBtn: { paddingVertical: 16, borderRadius: 18, alignItems: 'center', marginTop: 10 },
  processText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
  processSub: { color: '#ffffff', fontSize: 11, fontWeight: '500' }
});
