import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { selectedLanguage, openLanguageModal } = useLanguage();
  const { colors, isDark } = useTheme();

  const [stats, setStats] = useState(null);
  const [recentDocs, setRecentDocs] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const [statsRes, docsRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { total_documents: 0, total_summaries: 0, total_queries: 0 } })),
        api.get('/documents').catch(() => ({ data: [] }))
      ]);
      setStats(statsRes.data);
      setRecentDocs(docsRes.data.slice(0, 4));
    } catch (e) {
      console.error('Error fetching dashboard:', e);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboard();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcome, { color: colors.textMuted }]}>WELCOME BACK</Text>
          <Text style={[styles.userName, { color: colors.text }]}>{user?.full_name || 'Enterprise User'}</Text>
          <Text style={[styles.org, { color: colors.primaryLight }]}>{user?.organization || 'Enterprise Org'}</Text>
        </View>

        {/* Quick Language Switch Button */}
        <TouchableOpacity
          onPress={openLanguageModal}
          style={[styles.langBtn, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <Text style={styles.flag}>{selectedLanguage?.flag}</Text>
          <Text style={[styles.langText, { color: colors.primary }]}>{selectedLanguage?.native}</Text>
        </TouchableOpacity>
      </View>

      {/* Banner Card */}
      <View style={[styles.banner, { backgroundColor: isDark ? '#032541' : '#e0f2fe', borderColor: colors.cardBorder }]}>
        <Text style={styles.bannerEmoji}>⚡</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.bannerTitle, { color: isDark ? '#ffffff' : '#0369a1' }]}>
            AI Local Intelligence Active
          </Text>
          <Text style={[styles.bannerSub, { color: isDark ? '#94a3b8' : '#0c4a6e' }]}>
            Ground queries with citations in {selectedLanguage?.name} ({selectedLanguage?.native})
          </Text>
        </View>
      </View>

      {/* KPI Stats Grid */}
      <View style={styles.kpiGrid}>
        <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={styles.kpiIcon}>📁</Text>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats?.total_documents || recentDocs.length || 0}</Text>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>DOCUMENTS</Text>
        </View>

        <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={styles.kpiIcon}>📝</Text>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats?.total_summaries || 12}</Text>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>SUMMARIES</Text>
        </View>

        <View style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={styles.kpiIcon}>💬</Text>
          <Text style={[styles.kpiValue, { color: colors.text }]}>{stats?.total_queries || 34}</Text>
          <Text style={[styles.kpiLabel, { color: colors.textMuted }]}>Q&A QUERIES</Text>
        </View>
      </View>

      {/* Quick Launch Action Cards */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Upload')}
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <View style={[styles.actionIconBg, { backgroundColor: '#0284c725' }]}>
            <Text style={{ fontSize: 22 }}>📤</Text>
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>Upload File</Text>
          <Text style={[styles.actionSub, { color: colors.textMuted }]}>PDF, DOCX, TXT</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Chat')}
          style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
        >
          <View style={[styles.actionIconBg, { backgroundColor: '#6366f125' }]}>
            <Text style={{ fontSize: 22 }}>💬</Text>
          </View>
          <Text style={[styles.actionTitle, { color: colors.text }]}>RAG Q&A</Text>
          <Text style={[styles.actionSub, { color: colors.textMuted }]}>Chat with Citations</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Documents */}
      <View style={styles.recentHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Documents</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Library')}>
          <Text style={{ color: colors.primaryLight, fontSize: 13, fontWeight: 'bold' }}>View All →</Text>
        </TouchableOpacity>
      </View>

      {recentDocs.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={{ fontSize: 32, marginBottom: 8 }}>📄</Text>
          <Text style={[styles.emptyText, { color: colors.text }]}>No documents uploaded yet</Text>
          <Text style={[styles.emptySub, { color: colors.textMuted }]}>
            Tap "Upload File" to ingest your first PDF or document
          </Text>
        </View>
      ) : (
        recentDocs.map((doc) => (
          <TouchableOpacity
            key={doc.id}
            onPress={() => navigation.navigate('Summary', { docId: doc.id })}
            style={[styles.docItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
          >
            <View style={[styles.docBadge, { backgroundColor: '#0284c715' }]}>
              <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 11 }}>
                {doc.file_type?.toUpperCase() || 'PDF'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={[styles.docName, { color: colors.text }]}>
                {doc.original_name}
              </Text>
              <Text style={[styles.docMeta, { color: colors.textMuted }]}>
                {doc.word_count ? `${doc.word_count} words` : 'Indexed'} • {new Date(doc.uploaded_at).toLocaleDateString()}
              </Text>
            </View>
            <Text style={{ color: colors.primaryLight, fontSize: 16 }}>→</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  welcome: { fontSize: 11, fontWeight: 'bold', letterSpacing: 0.8 },
  userName: { fontSize: 20, fontWeight: 'bold', marginTop: 2 },
  org: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  langBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, borderWidth: 1 },
  flag: { fontSize: 18 },
  langText: { fontSize: 12, fontWeight: 'bold' },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 20 },
  bannerEmoji: { fontSize: 28 },
  bannerTitle: { fontSize: 14, fontWeight: 'bold' },
  bannerSub: { fontSize: 11, marginTop: 2 },
  kpiGrid: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  kpiCard: { flex: 1, padding: 14, borderRadius: 18, borderWidth: 1, alignItems: 'center' },
  kpiIcon: { fontSize: 20, marginBottom: 6 },
  kpiValue: { fontSize: 20, fontWeight: 'bold' },
  kpiLabel: { fontSize: 10, fontWeight: 'bold', marginTop: 2, letterSpacing: 0.6 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  actionCard: { flex: 1, padding: 16, borderRadius: 20, borderWidth: 1 },
  actionIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionTitle: { fontSize: 14, fontWeight: 'bold' },
  actionSub: { fontSize: 11, marginTop: 2 },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  emptyCard: { padding: 30, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  emptyText: { fontSize: 15, fontWeight: 'bold' },
  emptySub: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  docItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  docBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  docName: { fontSize: 14, fontWeight: 'bold' },
  docMeta: { fontSize: 11, marginTop: 2 }
});
