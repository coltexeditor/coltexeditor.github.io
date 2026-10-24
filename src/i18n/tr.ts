import type en from './en.ts'

export default {
  meta: {
    title: 'ColTex: kendi sunucunuzda birlikte çalışmaya yönelik bir LaTeX düzenleyicisi',
    description:
      'ColTex, yerleşik bir YZ ajanı olan, birlikte çalışmaya yönelik bir LaTeX düzenleyicisidir: kendi sunucunuzda çalışan bir Overleaf alternatifi.',
  },
  nav: {
    docs: 'Belgeler',
    language: 'Dil',
    theme: 'Açık ve koyu arasında geçiş yap',
  },
  hero: {
    tagline: 'Yerleşik bir YZ ajanı olan, kendi sunucunuzda barındırılan, birlikte çalışmaya yönelik bir LaTeX düzenleyicisi.',
    points: ['Sizin sunucunuz', 'Sizin hesaplarınız', 'Sizin verileriniz', 'Gerçek zamanlı iş birliği', 'Açık kaynak (AGPL-3.0)'],
    copy: 'Kopyala',
    copied: 'Kopyalandı',
    replay: 'Yeniden oynat',
    github: 'GitHub’da görüntüle',
  },
  install: {
    title: 'Kurulum',
    steps: [
      'Komutu Docker yüklü bir Linux veya macOS makinesinde çalıştırın. Linux’ta kurulum aracı Docker’ı kurabilir.',
      'Ok tuşlarıyla TeX Live sürümünü seçin. Kurulum aracı hazır imajları (x86-64 veya ARM64) indirir ve ColTex’i başlatır.',
      'http://<sunucu>:3690 adresini açın ve yönetici hesabını oluşturun.',
    ],
    recommended: 'Önerilen: en az 2 CPU çekirdeği ve 4 GB bellek.',
  },
  docs: {
    title: 'Belgeler',
    onThisPage: 'Bu sayfada',
  },
  tour: {
    chapters: ['Oturum aç', 'Çalışma alanı', 'Yazma', 'Görsel düzenleyici', 'İş birliği', 'YZ ajanı', 'İnceleme', 'Kaynaklar', 'Geçmiş', 'Ayarlar', 'Yönetim'],
    try: 'Demoyu deneyin',
    note: 'Demo tamamen tarayıcınızda çalışır.',
  },
  why: {
    title: 'Neden ColTex?',
    lead: 'ColTex; bir araştırma grubu, bir laboratuvar ya da yalnızca kendiniz için, denetiminizdeki bir bilgisayarda çalışan bir Overleaf alternatifidir: laboratuvardaki bir masaüstü bilgisayar, evdeki bir sunucu veya bir bulut makinesi.',
    items: [
      {
        title: 'Her şey sunucunuzda kalır',
        text: 'Projeler, geçmiş, hesaplar ve derleme işleri asla sunucudan çıkmaz. TeX, internet erişimi olmayan, korumalı bir kapsayıcıda çalışır.',
      },
      {
        title: 'Birlikte yazmak için tasarlandı',
        text: 'Birden çok kişi aynı dosyayı aynı anda düzenler; yorumlar, değişiklik izleme, sohbet ve sürüm geçmişi de vardır.',
      },
      {
        title: 'Projeniz üzerinde çalışan bir YZ ajanı',
        text: 'Dosyaları ve derleme günlüğünü okur, değişiklik taslakları hazırlar, bunları deneme amaçlı derler ve size bir fark gösterir. Siz uygulayana kadar hiçbir şey yazılmaz.',
      },
      {
        title: 'Tek komutla kurulum, açılacak bağlantı noktası yok',
        text: 'Uzaktan erişim için Tailscale ve Cloudflare Tunnel yerleşiktir.',
      },
    ],
  },
  features: {
    title: 'Özellikler',
    groups: [
      {
        title: 'Yazma ve derleme',
        items: [
          'Kaynak düzenleyici ve tablo düzenleyici, şekil iletişim kutusu, araç çubuğu, simge paleti, ana hat ve içerik haritası içeren görsel düzenleyici.',
          'LaTeX tamamlamaları, kod denetimi, denklem önizlemesi, birçok dilde yazım denetimi, sözcük sayısı, proje genelinde ara ve değiştir, Vim veya Emacs tuşları.',
          'Tam bir TeX Live üzerinde latexmk ile derler. Motor (pdfLaTeX, XeLaTeX veya LuaLaTeX) belgeye göre seçilir; Çince de dahil.',
          'Ayrı bir pencerede de açılabilen, iki yönlü SyncTeX destekli PDF önizlemesi. Derleme hatalarının altı kaynakta çizilir ve anlaşılır ipuçları verilir.',
          'Kaynaklar: .bib dosyalarınızdan atıf yapın, Crossref ve arXiv’den ya da DOI ile girdi ekleyin veya bir Zotero kitaplığını eşitli tutun.',
        ],
      },
      {
        title: 'İş birliği',
        items: [
          'Herkesin imleçleriyle gerçek zamanlı düzenleme, @bahsetmeli yorumlar, değişiklik izleme, proje sohbeti ve bildirimler.',
          'Proje başına roller: sahip, düzenleyici, inceleyici (yalnızca öneriler) ve görüntüleyici.',
          'git benzeri sürüm geçmişi: otomatik sürümler, mesajla kaydedilen sürümler ve tek bir sürümün değişikliklerini geri alma.',
          'Git erişimi: bir projeyi klonlayın, yerelde üzerinde çalışın ve geri itin.',
        ],
      },
      {
        title: 'YZ ajanı',
        items: [
          'LaTeX, projeniz veya yazınız hakkında soru sorun ya da derleme hatalarını düzeltmesine izin verin. Değişikliklerin taslağını özel bir kopyada hazırlar, deneme amaçlı derler ve bir fark gösterir.',
          'Uygulama önce bir sürüm kaydeder ve yeniden derler; derleme kötüleşirse değişiklik geri alınır.',
          'API anahtarları (Anthropic, OpenAI, DeepSeek, Google, OpenRouter ve diğerleri), abonelik oturumu (Claude, ChatGPT, GitHub Copilot ve diğerleri) veya kendi sunucunuz (Ollama, vLLM, LM Studio).',
          'Kendi yazdığınız veya içe aktardığınız skills, Elle’den Tam erişim’e izinler ve MCP üzerinden kendi ajanınız (Claude Code, Codex, Cursor…).',
        ],
      },
      {
        title: 'Projeler ve yönetim',
        items: [
          'IEEE, ACM, Springer LNCS, Elsevier, REVTeX ve arXiv şablonları ve bir dergi şablonundan diğerine dönüştürme.',
          'Overleaf zip içe ve dışa aktarma, bağlantılı dosyalar, etiketler, arşiv ve çöp kutusu.',
          'Herkese açık kayıt yok: hesaplar davet bağlantılarından gelir.',
          'İzleme, WebDAV yedekleri, yerel veya S3 uyumlu depolama, temalar ve 14 dilde arayüz.',
        ],
      },
    ],
  },
  editions: {
    title: 'İki TeX Live sürümü',
    lead: 'İkisi de tüm TeX Live paketlerini içerir ve aynı belgeleri derler. Full sürümü kılavuzları ve kaynakları da ekler; YZ ajanı bunları da okuyabilir.',
    head: ['Sürüm', 'İndirme', 'Disk (tüm ColTex)', 'Gereken boş alan'],
    rows: [
      ['Standard (varsayılan)', 'yaklaşık 3 GB', 'yaklaşık 12 GB', '20 GB'],
      ['Full (--edition full)', 'yaklaşık 8 GB', 'yaklaşık 23 GB', '35 GB'],
    ],
  },
  faq: {
    title: 'Sık sorulan sorular',
    categories: [
      {
        title: 'Genel',
        items: [
          {
            q: 'ColTex ücretsiz mi?',
            a: 'Evet. AGPL-3.0 lisanslı açık kaynaktır ve kendi makinenizde çalışır. Bağladığınız YZ sağlayıcıları ücretlendirmeyi kendileri yapar.',
          },
          {
            q: 'Overleaf’ten farkı ne?',
            a: 'Overleaf’e çok benzer çalışır: PDF’in yanında kaynak, yorumlar, değişiklik izleme ve geçmiş. Denetiminizdeki bir sunucuda çalışır ve yerleşik bir YZ ajanı vardır.',
          },
          {
            q: 'Barındırılan bir sürümü var mı?',
            a: 'Hayır. ColTex denetiminizdeki bir bilgisayarda çalışır. Önce göz atmak için bu sitedeki demoyu deneyin; tarayıcınızda çalışır.',
          },
        ],
      },
      {
        title: 'Kurulum',
        items: [
          {
            q: 'Çalıştırmak için neye ihtiyacım var?',
            a: 'Docker yüklü bir Linux veya macOS makinesi (Linux’ta kurulum aracı Docker’ı kurabilir) ve yaklaşık 20 GB boş disk alanı. En az 2 CPU çekirdeği ve 4 GB bellek önerilir.',
          },
          {
            q: 'Hangi TeX Live sürümünü seçmeliyim?',
            a: 'Standard tüm paketleri içerir ve aynı belgeleri derler. Full, paketlerin kılavuzlarını ve kaynaklarını da ekler; YZ ajanı bunları da okuyabilir. Bunun için yaklaşık 11 GB daha gerekir. Daha sonra coltex edition full ile geçiş yapabilirsiniz.',
          },
          {
            q: 'Windows’ta çalışır mı?',
            a: 'Kurulum aracı Linux ve macOS’ta çalışır. Windows’ta ColTex’i bir Linux makinesine veya sunucusuna kurun ve tarayıcıda açın.',
          },
          {
            q: 'Kendi alan adımı HTTPS ile kullanabilir miyim?',
            a: 'Evet. --domain tex.example.org ile kurun; birlikte gelen Caddy sertifikaları alır. Alan adını sunucuya yönlendirin ve 80 ile 443 numaralı bağlantı noktalarını açın.',
          },
          {
            q: 'Nasıl güncellerim?',
            a: 'coltex update komutunu çalıştırın. En son sürümü alır; ayarlarınız ve verileriniz kalır.',
          },
        ],
      },
      {
        title: 'Yazma ve iş birliği',
        items: [
          {
            q: 'Overleaf projelerimi getirebilir miyim?',
            a: 'Evet. Overleaf’ten bir proje zip dosyasını içe aktarın; ColTex de zip dosyalarını aynı biçimde dışa aktarır.',
          },
          {
            q: 'Birden çok kişi aynı anda düzenleyebilir mi?',
            a: 'Evet; herkesin imleçleri, yorumlar, değişiklik izleme ve proje sohbetiyle. Her projenin sahipleri, düzenleyicileri, inceleyicileri (yalnızca öneriler) ve görüntüleyicileri vardır.',
          },
          {
            q: 'Başkaları dışarıdan nasıl erişir?',
            a: 'Ayarlar → Ağ bölümünde Tailscale veya Cloudflare Tunnel’ı açın; hiçbir bağlantı noktası açmanız gerekmez. Kendi alan adı olan bir sunucu --domain ile HTTPS kullanabilir.',
          },
          {
            q: 'Bir proje üzerinde Git ile çalışabilir miyim?',
            a: 'Evet. Projeyi kişisel bir belirteçle klonlayın, yerelde üzerinde çalışın ve geri itin; bu arada tarayıcıda yapılan düzenlemeler birleştirilir.',
          },
          {
            q: 'Çince, Japonca ve Korece derler mi?',
            a: 'Evet. Motor belgeye göre seçilir; bu yüzden ctex ve xeCJK belgeleri hiçbir ayar gerekmeden XeLaTeX ile derlenir.',
          },
        ],
      },
      {
        title: 'YZ ajanı',
        items: [
          {
            q: 'YZ ajanı için abonelik gerekir mi?',
            a: 'Bir model gerekir: bir API anahtarı, bir abonelik oturumu veya kendi OpenAI uyumlu sunucunuz. Geri kalan her şey model olmadan da çalışır.',
          },
          {
            q: 'Hangi modelleri kullanabilir?',
            a: 'API anahtarları (Anthropic, OpenAI, DeepSeek, Google, OpenRouter ve diğerleri), abonelik oturumları (Claude, ChatGPT, GitHub Copilot ve diğerleri) ya da Ollama, vLLM veya LM Studio gibi kendi sunucunuz. Bunları yönetici bağlar.',
          },
          {
            q: 'Yazdıklarım YZ sağlayıcısına gider mi?',
            a: 'Yalnızca ajanın sizin yaptığınız bir istek için okudukları gider ve yalnızca seçtiğiniz modelin sağlayıcısına. Kendi sunucunuzdaki bir modelle hiçbir şey sunucudan çıkmaz.',
          },
          {
            q: 'YZ ajanı dosyalarımı sormadan değiştirebilir mi?',
            a: 'Siz izin vermedikçe hayır. Elle kipinde değişiklikleri, inceleyip uyguladığınız bir taslaktır; uygulama önce bir sürüm kaydeder ve derlemeyi kötüleştiren bir değişiklik geri alınır.',
          },
        ],
      },
      {
        title: 'Veriler ve güvenlik',
        items: [
          {
            q: 'Verilerim nerede tutulur?',
            a: 'Sunucunuzda: veritabanı ve proje dosyaları, sunucunun diskinde veya S3 uyumlu depolamada. Projeler, geçmiş, hesaplar ve derleme işleri asla sunucudan çıkmaz.',
          },
          {
            q: 'Yedek alabilir miyim?',
            a: 'Evet. Ayarlar → Depolama ve yedekler, veritabanını, dosyaları ve geçmişi zamanlanmış olarak bir WebDAV klasörüne gönderir; bir parola belirlerseniz şifreli olarak.',
          },
          {
            q: 'Derleme güvenli mi?',
            a: 'TeX, internet erişimi olmayan kendi kapsayıcısında; salt okunur bir sistemle, ek ayrıcalık olmadan ve bellek ile işlem sınırlarıyla çalışır.',
          },
          {
            q: 'Kim hesap oluşturabilir?',
            a: 'Kayıt olarak kimse. Hesaplar, sistem yöneticisinin ya da bir yöneticinin kendi ekibi için ilettiği davet bağlantılarından gelir.',
          },
        ],
      },
    ],
  },
  footer: {
    poweredBy: 'GitHub Pages ile yayınlanır',
  },
} satisfies typeof en
