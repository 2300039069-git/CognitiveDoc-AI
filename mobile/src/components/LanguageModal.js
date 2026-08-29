import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function LanguageModal() {
  const { isModalOpen, closeLanguageModal, supportedLanguages, selectedLanguage, selectLanguage } = useLanguage();
  const { colors, isDark } = useTheme();
  const [search, setSearch] = useState('');

  const filtered = supportedLanguages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.native.toLowerCase().includes(search.toLowerCase()) ||
      l.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal visible={isModalOpen} animationType="slide" transparent={true} onRequestClose={closeLanguageModal}>
      <View style={styles.backdrop}>
        <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Select AI Language</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Chatbot & Summaries respond in this language
              </Text>
            </View>
            <TouchableOpacity onPress={closeLanguageModal} style={styles.closeBtn}>
              <Text style={{ fontSize: 18, color: colors.textMuted }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search language (e.g. Telugu, Hindi)..."
            placeholderTextColor={colors.textMuted}
            style={[
              styles.searchInput,
              { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, color: colors.text }
            ]}
          />

          {/* List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => {
              const active = selectedLanguage?.code === item.code;
              return (
                <TouchableOpacity
                  onPress={() => selectLanguage(item)}
                  style={[
                    styles.langItem,
                    {
                      borderColor: active ? colors.primary : colors.cardBorder,
                      backgroundColor: active ? (isDark ? '#0284c725' : '#e0f2fe') : colors.card
                    }
                  ]}
                >
                  <View style={styles.langLeft}>
                    <Text style={styles.flag}>{item.flag}</Text>
                    <View>
                      <Text style={[styles.langName, { color: colors.text }]}>{item.name}</Text>
                      <Text style={[styles.nativeName, { color: colors.primary }]}>{item.native}</Text>
                      <Text style={[styles.region, { color: colors.textMuted }]}>{item.region}</Text>
                    </View>
                  </View>
                  {active && (
                    <View style={[styles.activeBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.activeText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    marginVertical: 14,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  langLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flag: {
    fontSize: 26,
  },
  langName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  nativeName: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 1,
  },
  region: {
    fontSize: 11,
    marginTop: 2,
  },
  activeBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
