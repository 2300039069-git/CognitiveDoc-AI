import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';

export default function LibraryScreen({ navigation }) {
  const { colors, isDark } = useTheme();

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDocs = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (e) {
      console.error('Error fetching library:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDocs();
    setRefreshing(false);
  };

  const handleDelete = (docId, name) => {
    Alert.alert(
      'Delete Document',
      `Permanently delete "${name}" and all associated summaries?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/documents/${docId}`);
              setDocuments(documents.filter(d => d.id !== docId));
            } catch (err) {
              Alert.alert('Error', 'Failed to delete document.');
            }
          }
        }
      ]
    );
  };

  const filtered = documents.filter(d =>
    d.original_name.toLowerCase().includes(search.toLowerCase()) ||
    (d.tags && JSON.stringify(d.tags).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Header */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.cardBorder }]}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search documents or tags..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }]}
        />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 36, marginBottom: 8 }}>📁</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No documents found</Text>
              <Text style={[styles.emptySub, { color: colors.textMuted }]}>
                Upload files to start managing and querying them
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              {/* Top info */}
              <View style={styles.cardTop}>
                <View style={[styles.typeBadge, { backgroundColor: '#0284c715' }]}>
                  <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 11 }}>
                    {item.file_type?.toUpperCase() || 'PDF'}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={[styles.docName, { color: colors.text }]}>
                    {item.original_name}
                  </Text>
                  <Text style={[styles.docMeta, { color: colors.textMuted }]}>
                    {Math.round((item.file_size || 0) / 1024)} KB • {item.word_count || 0} words • {new Date(item.uploaded_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={[styles.cardActions, { borderTopColor: colors.cardBorder }]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Summary', { docId: item.id })}
                  style={[styles.btn, { backgroundColor: isDark ? '#0284c720' : '#e0f2fe' }]}
                >
                  <Text style={[styles.btnText, { color: colors.primary }]}>📝 Summary</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Chat', { docId: item.id })}
                  style={[styles.btn, { backgroundColor: isDark ? '#6366f120' : '#ede9fe' }]}
                >
                  <Text style={[styles.btnText, { color: colors.accent }]}>💬 Q&A Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item.id, item.original_name)}
                  style={[styles.deleteBtn, { backgroundColor: isDark ? '#f43f5e15' : '#ffe4e6' }]}
                >
                  <Text style={{ fontSize: 14 }}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1 },
  searchInput: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  list: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { padding: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold' },
  emptySub: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 10 },
  docName: { fontSize: 15, fontWeight: 'bold' },
  docMeta: { fontSize: 11, marginTop: 3 },
  cardActions: { flexDirection: 'row', gap: 8, marginTop: 14, paddingTop: 12, borderTopWidth: 1 },
  btn: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
  btnText: { fontSize: 12, fontWeight: 'bold' },
  deleteBtn: { paddingHorizontal: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }
});
