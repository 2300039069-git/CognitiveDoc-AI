# 📱 CognitiveDoc.AI — Mobile Application (React Native & Expo)

Cross-platform mobile application for **CognitiveDoc.AI**, providing on-device PDF/DOCX ingestion, real-time RAG conversational Q&A with verified citations, multi-lingual translation (Telugu, Hindi, Tamil, English, etc.), and executive abstractive summaries.

---

## 🌟 Key Mobile Features

- 📁 **Native Document Picker**: Select multi-page PDFs, Microsoft Word DOCX, and Text files directly from your phone's storage.
- 💬 **RAG Grounded Q&A Assistant**: Ask queries in 10+ Indic and global languages with page-level source citations.
- 📝 **Executive Narrative & Bullet Summaries**: Read AI distilled insights on the go.
- 🌓 **Dual Appearance**: ☀️ Light and 🌙 Dark modes with instant theme persistence.
- 🌐 **Instant Indic Re-Synthesis**: Switch languages anytime to re-synthesize summaries on the fly.
- 🔒 **Secure Persistent Session**: Fast token authentication stored securely with `AsyncStorage`.

---

## 🚀 How to Run and Test on Your Mobile Phone

### 1. Prerequisites
- Install **Node.js** (v18 or higher)
- Download the free **Expo Go** app on your phone:
  - [Google Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [Apple App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)

---

### 2. Install Dependencies & Start
Open a terminal in the `mobile/` directory:

```bash
cd mobile
npm install
npm start
```

---

### 3. Open on Your Phone
1. Ensure your phone and computer are connected to the **same Wi-Fi network**.
2. Open the **Expo Go** app on your Android phone (or Camera app on iPhone).
3. Scan the **QR Code** displayed in your terminal.
4. The mobile app will instantly load and run natively on your phone!

---

## 📦 How to Build Standalone Android APK (.apk)

To create a standalone installable `.apk` file for Android:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in with your Expo account:
   ```bash
   eas login
   ```
3. Run the build command:
   ```bash
   npx eas build -p android --profile preview
   ```
4. EAS will compile your `.apk` and provide a direct download link to install on any Android phone!
