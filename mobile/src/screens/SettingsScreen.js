import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { getBaseApiUrl } from '../services/api';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const { selectedLanguage, openLanguageModal } = useLanguage();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out and lock your session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* Profile Card */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.profileRow}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.text }]}>{user?.full_name || 'Enterprise User'}</Text>
            <Text style={[styles.email, { color: colors.textMuted }]}>{user?.email}</Text>
            <View style={styles.badgeRow}>
              <View style={[styles.badge, { backgroundColor: '#0284c715' }]}>
                <Text style={{ color: colors.primary, fontSize: 10, fontWeight: 'bold' }}>
                  {user?.role?.toUpperCase() || 'USER'}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: '#10b98115' }]}>
                <Text style={{ color: colors.success, fontSize: 10, fontWeight: 'bold' }}>
                  {user?.tier || 'Enterprise Pro'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Language Preference */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>PREFERENCES</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <TouchableOpacity onPress={openLanguageModal} style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Text style={{ fontSize: 20 }}>🌐</Text>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>AI Response Language</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                {selectedLanguage?.name} ({selectedLanguage?.native})
              </Text>
            </View>
          </View>
          <View style={styles.settingRight}>
            <Text style={{ fontSize: 20 }}>{selectedLanguage?.flag}</Text>
            <Text style={{ color: colors.primaryLight, fontSize: 16 }}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Theme Toggle */}
        <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
        <TouchableOpacity onPress={toggleTheme} style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <Text style={{ fontSize: 20 }}>{isDark ? '🌙' : '☀️'}</Text>
            <View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Appearance & Theme</Text>
              <Text style={[styles.settingSub, { color: colors.textMuted }]}>
                {isDark ? 'Dark Mode Active' : 'Light Mode Active'}
              </Text>
            </View>
          </View>
          <Text style={{ color: colors.primaryLight, fontSize: 13, fontWeight: 'bold' }}>
            Switch to {isDark ? 'Light ☀️' : 'Dark 🌙'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* System Information */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>SYSTEM CONNECTIVITY</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Backend Host</Text>
          <Text style={[styles.infoVal, { color: colors.text }]}>{getBaseApiUrl()}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Local RAG Model</Text>
          <Text style={[styles.infoVal, { color: colors.primary }]}>Qwen-27B / MiniLM Hybrid</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textMuted }]}>App Version</Text>
          <Text style={[styles.infoVal, { color: colors.text }]}>v2.0.0 (Native Release)</Text>
        </View>
      </View>

      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={[styles.logoutBtn, { backgroundColor: isDark ? '#f43f5e15' : '#ffe4e6', borderColor: '#f43f5e30' }]}
      >
        <Text style={styles.logoutText}>🔒 Sign Out / Lock Session</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 50 },
  card: { padding: 18, borderRadius: 22, borderWidth: 1, marginBottom: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#ffffff', fontSize: 22, fontWeight: 'bold' },
  name: { fontSize: 17, fontWeight: 'bold' },
  email: { fontSize: 12, marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', letterSpacing: 0.8, marginBottom: 8, marginLeft: 4 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingLabel: { fontSize: 14, fontWeight: 'bold' },
  settingSub: { fontSize: 11, marginTop: 2 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  divider: { height: 1, marginVertical: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  infoLabel: { fontSize: 12 },
  infoVal: { fontSize: 12, fontWeight: 'bold' },
  logoutBtn: { paddingVertical: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#f43f5e', fontWeight: 'bold', fontSize: 14 }
});
