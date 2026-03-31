# App Store Review Compliance Report: YDTHub

Bu rapor, YDTHub projesinin Apple App Store İnceleme Kılavuzlarına (App Store Review Guidelines) uyumluluğunu değerlendirmektedir.

## 📊 Özet Durum
| Kategori | Durum | Risk Seviyesi | Önemli Notlar |
| :--- | :--- | :--- | :--- |
| **1. Safety (Güvenlik)** | ✅ Uyumlu | Düşük | Soru içerikleri statik olarak yükleniyor, UGC (Kullanıcı İçeriği) bulunmuyor. |
| **2. Performance (Performans)** | ⚠️ İyileştirilmeli | Orta | Info.plist'te eksik olan meta veriler ve izin açıklamaları giderildi. |
| **3. Business (İş Modeli)** | ✅ Uyumlu | Düşük | Harici ödeme sistemi (Stripe vb.) tespit edilmedi. |
| **4. Design (Tasarım)** | ⚠️ İyileştirilmeli | Orta | "Sign in with Apple" görsel olarak mevcut ancak native entegrasyon önerilir. |
| **5. Legal (Yasal)** | ✅ Uyumlu | Düşük | "Privacy Policy" ve "Delete Account" özellikleri mevcut. |

---

## 🔍 Detaylı Bulgular

### 🛡️ 1. Safety (Güvenlik)
*   **İçerik Moderasyonu:** Uygulama kullanıcıların içerik paylaşmasına (UGC) izin vermediği için karmaşık moderasyon sistemlerine (Raporla, Engelle vb.) şu an için gerek yoktur.
*   **AI Yanıtları:** AI tarafından üretilen sorular seeder scriptleri ile önceden yüklendiği için "Canlı Üretken AI" riskleri bulunmamaktadır.

### 🚀 2. Performance (Performans)
*   **[DÜZELTİLDİ] CFBundleDisplayName:** Teknik isim olan `ydt-hub` yerine kullanıcı dostu `YDTHub` adı atandı.
*   **[DÜZELTİLDİ] Missing Purpose Strings:** `Info.plist` dosyasına Kamera, Fotoğraf Kütüphanesi ve Takip (Tracking) izinleri için gerekli açıklamalar eklendi. Bu açıklamalar eklenmediğinde Apple "Missing Info.plist Key" reddi vermektedir.

### 💼 3. Business (İş Modeli)
*   **Ödemeler:** Uygulama içinde dijital ürün satışı bulunmuyor. Eğer gelecekte eklenirse **StoreKit (In-App Purchase)** kullanılmalıdır.
*   **Harici Bağlantılar:** Uygulama içinde harici bir ödeme sayfasına yönlendirme tespit edilmedi (Kural 3.1.1).

### 🎨 4. Design (Tasarım)
*   **Sign in with Apple:** Tasarımda butonu mevcut (Guideline 4.8). 
    > [!TIP]
    > **Önemli:** Şu anki implementasyon `signInWithOAuth` (Web Redirect) kullanıyor. Apple, native uygulamalarda sistem diyalogu ile açılan **Native Sign in with Apple** akışını tercih eder ve bazen redirect akışlarını reddedebilir. İlerleyen aşamalarda `@capacitor-community/apple-sign-in` plugin'i ile native akışa geçilmesi önerilir.

### ⚖️ 5. Legal (Yasal)
*   **Privacy Policy:** `/privacy` sayfası mevcut ve "Settings" menüsünden erişilebilir durumda.
*   **Account Deletion:** Ayarlar menüsünde "Delete Account" (Hesabı Sil) butonu mevcuttur (Guideline 5.1.1). Apple, hesap oluşturulabilen her uygulamada bu özelliğin in-app (uygulama içinden) olmasını zorunlu tutar.

---

## ✅ Yapılan Değişiklikler
1.  `ios/App/App/Info.plist` dosyası güncellendi:
    *   Uygulama adı düzeltildi (`YDTHub`).
    *   `NSCameraUsageDescription` eklendi.
    *   `NSPhotoLibraryUsageDescription` eklendi.
    *   `NSUserTrackingUsageDescription` eklendi.

## 📌 Önemli Tavsiyeler
1.  **Tester Hesabı:** İnceleme (Review) aşamasında Apple'a çalışan bir demo hesabı bilgisi vermeyi unutmayın.
2.  **App Store Connect:** Gizlilik politikası linkini App Store Connect metadata bölümüne de ekleyin.
3.  **App Icon:** Capacitor varsayılan ikonlarını kendi özgün ikonlarınızla değiştirdiğinizden emin olun ( `ios/App/App/Assets.xcassets` yolu üzerinden kontrol edilebilir).

---
*Hazırlayan: Antigravity*
