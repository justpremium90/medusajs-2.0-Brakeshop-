import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BRAKESHOP_COMPANY } from "@lib/constants/company"

const baseFont = {
  fontFamily:
    '"Helvetica Neue LT Std", "Avenir light", Helvetica, Arial, sans-serif',
}

export type BrakeshopPageKey =
  | "about"
  | "contact"
  | "shipping-delivery"
  | "delivery-return-terms"
  | "returns-exchanges"
  | "faq"
  | "privacy-policy"
  | "cookies-policy"
  | "terms-conditions"
  | "pre-information-form"
  | "distance-sales-agreement"
  | "withdrawal-form"
  | "ssl-certificate"
  | "accessibility"
  | "care-guide"

type PageSection = {
  title: string
  body: string[]
}

type PageContent = {
  eyebrow: string
  title: string
  description: string
  sections: PageSection[]
}

export const brakeshopPages: Record<BrakeshopPageKey, PageContent> = {
  about: {
    eyebrow: "Brakeshop",
    title: "Hakkımızda",
    description:
      "Brakeshop, doğru fren balatası ve fren diskini araç uyumluluğu ve teknik verilerle bulmanızı kolaylaştıran uzman fren parçası mağazasıdır.",
    sections: [
      {
        title: "Fren Parçası Uzmanlığı",
        body: [
          "Kataloğumuz; ön ve arka fren balatası, fren diski, disk-balata seti, ikaz sensörü ve fren sistemi yardımcı parçalarına odaklanır.",
          "Ürünleri marka, model, kasa, ölçü, üretici kodu ve araç uyumluluğu bilgileriyle karşılaştırılabilir biçimde sunmayı hedefleriz.",
        ],
      },
      {
        title: "Doğru Parça Yaklaşımı",
        body: [
          "Fren parçalarında yalnızca araç modeli yeterli olmayabilir. Üretim yılı, motor, şasi, disk çapı ve mevcut sistem gibi ayrıntıları kontrol etmenizi öneririz.",
          "Emin olmadığınız durumda ürün kodunu ve araç bilgilerinizi paylaşarak destek isteyebilirsiniz.",
        ],
      },
    ],
  },
  contact: {
    eyebrow: "Destek",
    title: "İletişim",
    description:
      "Fren balatası ve fren diski uyumluluğu, sipariş, teslimat ve iade sorularınız için Brakeshop ekibine ulaşın.",
    sections: [
      {
        title: "İletişim Bilgileri",
        body: [
          `Adres: ${BRAKESHOP_COMPANY.address}`,
          `Telefon: ${BRAKESHOP_COMPANY.telephoneDisplay} | E-posta: ${BRAKESHOP_COMPANY.email}`,
        ],
      },
      {
        title: "Firma Bilgileri",
        body: [
          `${BRAKESHOP_COMPANY.displayName} | Vergi Dairesi: ${BRAKESHOP_COMPANY.taxOffice} | VKN: ${BRAKESHOP_COMPANY.taxNumber}`,
          "Ürün uyumluluk talebinizde aracın marka, model, kasa, üretim yılı ve mümkünse şasi numarasıyla birlikte incelediğiniz ürün kodunu belirtin.",
        ],
      },
      {
        title: "Çalışma Saatleri",
        body: [
          "Talepler hafta içi 10:00 - 18:00 saatleri arasında sırayla değerlendirilir.",
          "Sipariş sorularında sipariş numaranızı eklemeniz işlemi hızlandırır.",
        ],
      },
    ],
  },
  "shipping-delivery": {
    eyebrow: "Siparişler",
    title: "Kargo ve Teslimat",
    description:
      "Fren balatası, fren diski ve diğer fren parçaları ürün yapısına uygun korumalı ambalajla Türkiye genelinde gönderilir.",
    sections: [
      {
        title: "Hazırlık Süresi",
        body: [
          "Stoktaki ürünler genellikle 1-3 iş günü içinde kargoya teslim edilir. Yoğun dönemlerde hazırlık süresi değişebilir.",
          "Ağır fren diskleri, ürünün taşıma sırasında zarar görmesini önleyecek destekli ambalajla hazırlanır.",
        ],
      },
      {
        title: "Teslimat Kontrolü",
        body: [
          "Pakette ezilme, yırtılma veya ıslanma görürseniz kargo görevlisi yanında tutanak tutulmasını isteyin.",
          "Teslim aldıktan sonra montajdan önce parça kodu, ölçü ve araç uyumluluğunu tekrar kontrol edin.",
        ],
      },
    ],
  },
  "delivery-return-terms": {
    eyebrow: "Siparişler",
    title: "Teslimat ve İade Şartları",
    description:
      "Sipariş hazırlığı, teslimat kontrolü, cayma hakkı ve ürün iade süreci hakkında bilgilendirme.",
    sections: [
      {
        title: "Sipariş ve Teslimat",
        body: [
          "Stokta bulunan ürünler genellikle 1-3 iş günü içinde kargoya teslim edilir. Teslimat süresi stok, adres, kargo operasyonu ve resmî tatillere göre değişebilir.",
          "Paket teslim alınırken ezilme, yırtılma veya ıslanma gibi görünür bir hasar varsa kargo görevlisi yanında tutanak tutulması istenmelidir.",
        ],
      },
      {
        title: "Cayma Hakkı ve Bildirim",
        body: [
          `Tüketici, Mesafeli Sözleşmeler Yönetmeliği'ndeki istisnalar saklı kalmak üzere, ürünü teslim aldığı tarihten itibaren 14 gün içinde gerekçe göstermeden ve cezai şart ödemeden cayma hakkını kullanabilir. Cayma bildirimi ${BRAKESHOP_COMPANY.email} adresine, şirket adresine veya cayma formu kullanılarak açık bir beyanla iletilebilir.`,
          "Cayma hakkı, sözleşmenin kurulmasından ürünün teslimine kadar olan sürede de kullanılabilir. Telefonla ön bilgi alınabilir; ispat kolaylığı için bildirimin yazılı veya kalıcı veri saklayıcısıyla yapılması önerilir.",
        ],
      },
      {
        title: "İade Gönderimi ve Masraflar",
        body: [
          "Tüketici, cayma bildiriminden itibaren 14 gün içinde ürünü geri göndermelidir. Brakeshop ön bilgilendirmede belirli bir iade taşıyıcısı bildirmediği sürece tüketiciden iade masrafı talep edilmez; ücretsiz gönderim yönlendirmesi için sipariş numarasıyla destek ekibine ulaşılmalıdır.",
          "Ürün, aksesuarları ve mümkünse orijinal ambalajıyla güvenli biçimde paketlenmelidir. Ambalajın açılması tek başına cayma hakkını ortadan kaldırmaz. Tüketici, ürünü işleyişine ve teknik özelliklerine uygun şekilde incelemek için gerekli olanın ötesinde kullanmasından doğan değer azalmasından sorumlu olabilir.",
        ],
      },
      {
        title: "Bedel İadesi",
        body: [
          "Brakeshop, cayma bildiriminin kendisine ulaştığı tarihten itibaren 14 gün içinde, varsa teslimat masrafları dâhil tahsil edilen ödemeleri mevzuata uygun olarak iade eder. Tüketicinin standart teslimat dışında seçtiği ek teslimat masrafları iade kapsamına girmez.",
          "İade, tüketicinin satın alırken kullandığı ödeme aracına uygun, tek seferde ve tüketiciye masraf yüklemeyecek şekilde yapılır. Brakeshop, ürünü teslim alana veya tüketici gönderdiğine ilişkin belge sunana kadar geri ödemeyi bekletebilir.",
        ],
      },
      {
        title: "Ayıplı, Yanlış veya Hasarlı Ürün",
        body: [
          "Yanlış, eksik, hasarlı veya sözleşmeye aykırı ürünlerde tüketicinin 6502 sayılı Kanun'dan doğan seçimlik hakları saklıdır. Paket hasarının tutanakla belirlenmesi süreci kolaylaştırır ancak yasal hakları kendiliğinden ortadan kaldırmaz.",
          "Fren parçası güvenlik açısından kritik olduğundan, uyumsuzluk şüphesinde montaj yapmadan parça kodu ve ölçü kontrolü yapılması ve Brakeshop'a bilgi verilmesi önerilir.",
        ],
      },
    ],
  },
  "returns-exchanges": {
    eyebrow: "Siparişler",
    title: "İade ve Değişim",
    description:
      "Fren parçalarında iade sürecinin hızlı ilerlemesi için ürünün montaj görmemiş, temiz ve orijinal ambalajında olması gerekir.",
    sections: [
      {
        title: "İade Koşulları",
        body: [
          "Mevzuattaki istisnalar saklı kalmak üzere teslimattan itibaren 14 gün içinde cayma bildirimi yapabilirsiniz. Bildirimden sonra ürünün 14 gün içinde geri gönderilmesi gerekir.",
          "Ambalajın açılması tek başına cayma hakkını kaldırmaz. Ürünün olağan incelemeyi aşacak biçimde kullanılması, montaj izi, çizik, kirlenme veya eksik parça nedeniyle değer kaybı doğurabilir.",
        ],
      },
      {
        title: "Yanlış veya Hasarlı Ürün",
        body: [
          "Yanlış ürün ya da kargo hasarı durumunda ürün, kutu etiketi ve paketin fotoğraflarıyla destek ekibine başvurun.",
          "Montajdan önce uyumsuzluk fark edilirse montaj yapmadan iletişime geçin.",
        ],
      },
    ],
  },
  faq: {
    eyebrow: "Fren Parçası Rehberi",
    title: "Sıkça Sorulan Sorular",
    description:
      "Fren balatası, fren diski, araç uyumluluğu, montaj, sipariş ve teslimat hakkında sık sorulan sorular.",
    sections: [
      {
        title: "Aracıma uygun ürünü nasıl bulurum?",
        body: [
          "Marka, model, kasa, üretim yılı ve motor bilgisini kontrol edin. Aynı araçta farklı fren sistemi kullanılabildiği için parça kodu ve ölçü karşılaştırması yapın.",
        ],
      },
      {
        title: "Disk ve balata birlikte mi değişmeli?",
        body: [
          "Disk yüzeyi, kalınlığı ve aşınma durumu uzman tarafından kontrol edilmelidir. Yeni balatanın aşınmış veya hasarlı diskle kullanılması performansı ve balata ömrünü etkileyebilir.",
        ],
      },
      {
        title: "Fren parçalarını kendim takabilir miyim?",
        body: [
          "Fren sistemi güvenlik açısından kritik olduğu için montajın uygun ekipman ve teknik bilgiye sahip uzman servis tarafından yapılmasını öneririz.",
        ],
      },
    ],
  },
  "privacy-policy": {
    eyebrow: "Yasal",
    title: "Gizlilik Politikası",
    description:
      "Brakeshop alışveriş ve destek hizmetlerinde kişisel verilerin işlenmesi ve korunmasına ilişkin bilgilendirme.",
    sections: [
      {
        title: "1. Veri Sorumlusu",
        body: [
          `Veri sorumlusu ${BRAKESHOP_COMPANY.displayName}; ${BRAKESHOP_COMPANY.address} adresinde faaliyet göstermektedir. İletişim: ${BRAKESHOP_COMPANY.email} | ${BRAKESHOP_COMPANY.telephoneDisplay}.`,
          "Bu metin; internet sitesi, üyelik, sipariş, ödeme, teslimat ve destek süreçleri kapsamında 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca hazırlanmıştır.",
        ],
      },
      {
        title: "2. İşlenen Veri Kategorileri",
        body: [
          "Kimlik ve iletişim bilgileri; teslimat ve fatura adresi; müşteri işlem, sipariş ve talep/şikâyet kayıtları; araç uyumluluğu için paylaşılan araç bilgileri; işlem güvenliği kayıtları ve ödeme sonucuna ilişkin sınırlı finans bilgileri işlenebilir.",
          "Kart numarasının tamamı, kart güvenlik kodu ve ödeme doğrulama şifreleri Brakeshop tarafından kaydedilmez; bu bilgiler yetkili ödeme kuruluşunun güvenli altyapısında işlenir.",
        ],
      },
      {
        title: "3. Amaçlar ve Hukuki Sebepler",
        body: [
          "Veriler; üyelik ve siparişin kurulması/ifası, ödeme sonucunun doğrulanması, ürünün teslimi, fatura ve muhasebe işlemleri, müşteri desteği, uyuşmazlıkların yönetimi, bilgi ve işlem güvenliğinin sağlanması ve yetkili makam taleplerinin karşılanması amaçlarıyla işlenir.",
          "İşleme faaliyetleri KVKK'nın 5. maddesinde yer alan sözleşmenin kurulması veya ifası, veri sorumlusunun hukuki yükümlülüğü, bir hakkın tesisi/kullanılması/korunması ve temel haklara zarar vermemek kaydıyla meşru menfaat hukuki sebeplerine dayanır. Açık rıza gereken faaliyetlerde ayrıca açık rıza alınır; pazarlama izni alışverişin şartı değildir.",
          "Veriler; site ve mobil arayüzler, sipariş/üyelik formları, e-posta, telefon, ödeme ve teslimat kayıtları gibi otomatik veya kısmen otomatik yollarla toplanır.",
        ],
      },
      {
        title: "4. Aktarım, Saklama ve Güvenlik",
        body: [
          "Gerekli veriler, amaçla ve asgari veri ilkesiyle sınırlı olarak ödeme kuruluşlarına, kargo/lojistik şirketlerine, barındırma ve bilgi teknolojisi hizmet sağlayıcılarına, muhasebe danışmanlarına ve hukuken yetkili kamu kurumlarına aktarılabilir.",
          "Kişisel veriler, ilgili mevzuatta öngörülen süreler ile işleme amacı için gerekli süre boyunca saklanır; süre sona erdiğinde mevzuata uygun biçimde silinir, yok edilir veya anonim hâle getirilir. Uygun teknik ve idari güvenlik tedbirleri uygulanır.",
        ],
      },
      {
        title: "5. KVKK Kapsamındaki Haklarınız",
        body: [
          `6698 sayılı Kanunun 11. maddesi kapsamındaki taleplerinizi kimliğinizi doğrulayacak bilgilerle ${BRAKESHOP_COMPANY.email} adresine veya şirket adresine iletebilirsiniz.`,
          "Verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi isteme, amacına uygun kullanılıp kullanılmadığını öğrenme, aktarılan üçüncü kişileri bilme, eksik/yanlış verinin düzeltilmesini ve koşulları varsa silinmesini veya yok edilmesini isteme, bu işlemlerin alıcılara bildirilmesini talep etme, yalnızca otomatik analiz sonucu aleyhinize bir sonuca itiraz etme ve hukuka aykırı işleme nedeniyle zararın giderilmesini isteme haklarına sahipsiniz.",
        ],
      },
    ],
  },
  "cookies-policy": {
    eyebrow: "Yasal",
    title: "Çerez Politikası",
    description:
      "Brakeshop deneyimini, güvenliği ve site performansını destekleyen çerezler hakkında bilgilendirme.",
    sections: [
      {
        title: "Çerez Kullanımı",
        body: [
          "Zorunlu çerezler sepet, oturum ve güvenlik gibi temel işlevlerin çalışması için gereklidir.",
          "Analitik ve tercih çerezleri arama ve ürün bulma deneyimini iyileştirmemize yardımcı olabilir.",
        ],
      },
      {
        title: "Tercihleriniz",
        body: [
          "Tarayıcı ayarlarınızdan çerezleri silebilir veya engelleyebilirsiniz. Bazı çerezlerin kapatılması site özelliklerini etkileyebilir.",
        ],
      },
    ],
  },
  "terms-conditions": {
    eyebrow: "Yasal",
    title: "Kullanım Şartları",
    description:
      "Brakeshop ürün bilgileri, araç uyumluluğu, sipariş ve alışveriş hizmetleri için geçerli temel kullanım şartları.",
    sections: [
      {
        title: "Ürün Bilgileri",
        body: [
          "Ürün görselleri ve uyumluluk bilgileri seçim desteği sağlar. Montajdan önce üretici kodu, ölçü ve araç üzerindeki mevcut parça doğrulanmalıdır.",
          "Fiyat, stok ve teknik bilgiler güncellenebilir; sipariş tamamlanmadan önce gösterilen son bilgiler esas alınır.",
        ],
      },
      {
        title: "Siparişler",
        body: [
          "Siparişler ödeme ve stok kontrollerinden sonra işleme alınır. Hatalı fiyat, stok sorunu veya teknik aksaklıkta müşteri bilgilendirilir.",
          "Fren parçalarının uzman servis tarafından monte edilmesi ve araç üreticisinin prosedürlerine uyulması müşterinin sorumluluğundadır.",
        ],
      },
    ],
  },
  "pre-information-form": {
    eyebrow: "Sipariş Öncesi Yasal Bilgilendirme",
    title: "Ön Bilgilendirme Formu",
    description:
      "Mesafeli satış işlemi kurulmadan önce satıcı, ürün, fiyat, teslimat, cayma hakkı ve başvuru yollarına ilişkin zorunlu bilgiler.",
    sections: [
      {
        title: "1. Satıcı ve İletişim Bilgileri",
        body: [
          `Satıcı: ${BRAKESHOP_COMPANY.displayName} | Adres: ${BRAKESHOP_COMPANY.address}`,
          `Telefon: ${BRAKESHOP_COMPANY.telephoneDisplay} | E-posta: ${BRAKESHOP_COMPANY.email} | Vergi Dairesi: ${BRAKESHOP_COMPANY.taxOffice} | VKN: ${BRAKESHOP_COMPANY.taxNumber}`,
        ],
      },
      {
        title: "2. Ürün, Fiyat ve Sipariş Bilgileri",
        body: [
          "Ürünün temel nitelikleri; marka, parça kodu, seçenek, miktar, vergiler dâhil satış fiyatı, varsa indirim, kargo/teslimat masrafı ve ödenecek toplam tutar sepet ve ödeme ekranında sipariş verilmeden önce gösterilir. Bu siparişe özgü bilgiler formun ayrılmaz parçasıdır.",
          "Tüketici, siparişi onaylamadan önce ürün kodunu, ölçüleri, ön/arka konumunu ve araç uyumluluğunu kontrol etmelidir. Aynı marka-model araçta üretim yılı, motor, şasi ve fren sistemine göre farklı parça kullanılabilir.",
        ],
      },
      {
        title: "3. Ödeme ve Siparişin Kurulması",
        body: [
          "Seçilen ödeme yöntemi ve ödeme planı ödeme ekranında gösterilir. 'Ödeme yap' veya aynı anlama gelen sipariş butonunun kullanılması siparişin ödeme yükümlülüğü doğurduğu anlamına gelir.",
          "Sipariş, ön bilgilendirme ile Mesafeli Satış Sözleşmesi'nin elektronik ortamda onaylanması ve ödeme işleminin başarıyla tamamlanmasıyla kurulur. Sipariş özeti ve sözleşme kayıtları elektronik ortamda saklanır ve tüketicinin erişebileceği sipariş kaydı/e-posta gibi kalıcı veri saklayıcıları üzerinden sunulur.",
        ],
      },
      {
        title: "4. Teslimat",
        body: [
          "Stoktaki ürünler genellikle 1-3 iş günü içinde kargoya verilir. Her hâlükârda, aksi ayrıca kararlaştırılmadıkça ürün en geç 30 gün içinde teslim edilir. Bu süre içinde edim yerine getirilemezse tüketici bilgilendirilir ve tahsil edilen bedeller yasal sürede iade edilir.",
          "Ürün tüketiciye veya belirlediği üçüncü kişiye teslim edilene kadar kayıp ve hasardan satıcı sorumludur. Tüketicinin satıcının belirlediği taşıyıcı dışında başka bir taşıyıcı seçmesi hâlinde sorumluluk, ürünün bu taşıyıcıya teslimiyle tüketiciye geçer.",
        ],
      },
      {
        title: "5. Cayma Hakkı",
        body: [
          `Tüketici, yasal istisnalar saklı kalmak üzere teslimden itibaren 14 gün içinde gerekçe göstermeden cayabilir. Açık cayma beyanı ${BRAKESHOP_COMPANY.email} adresine veya ${BRAKESHOP_COMPANY.address} adresine gönderilebilir; Cayma Formu da kullanılabilir.`,
          "Cayma bildiriminin ulaşmasından itibaren 14 gün içinde ürün geri gönderilir. Brakeshop bu formda belirli bir iade taşıyıcısı bildirmediğinden tüketiciden iade masrafı talep edilmez; ücretsiz gönderim yönlendirmesi destek ekibinden alınır.",
          "Brakeshop, cayma bildiriminin ulaşmasından itibaren 14 gün içinde tahsil edilen uygun bedelleri tüketicinin kullandığı ödeme aracına uygun ve masrafsız olarak iade eder. Ürün teslim alınana veya gönderim belgesi sunulana kadar geri ödeme bekletilebilir.",
        ],
      },
      {
        title: "6. Cayma Hakkının İstisnaları",
        body: [
          "Tüketicinin özel istekleri veya kişisel ihtiyaçları doğrultusunda hazırlanan ürünler; fiyatı finansal piyasa dalgalanmalarına bağlı ürünler; teslimden sonra başka ürünlerle karışan ve ayrıştırılması mümkün olmayan ürünler ile mevzuatta sayılan diğer sözleşmelerde cayma hakkı kullanılamaz.",
          "Bir fren parçasının ambalajının açılması tek başına cayma hakkını kaldırmaz. Ancak olağan incelemeyi aşan kullanım veya montaj nedeniyle oluşan değer azalmasından tüketici sorumlu olabilir. Ayıplı mala ilişkin kanuni haklar bu düzenlemeden etkilenmez.",
        ],
      },
      {
        title: "7. Şikâyet ve Uyuşmazlık",
        body: [
          `Talep ve şikâyetler ${BRAKESHOP_COMPANY.email} veya ${BRAKESHOP_COMPANY.telephoneDisplay} üzerinden Brakeshop'a iletilebilir. Tüketici, yürürlükteki parasal sınırlar çerçevesinde yerleşim yerindeki veya işlemin yapıldığı yerdeki Tüketici Hakem Heyetine ya da Tüketici Mahkemesine başvurabilir.`,
        ],
      },
    ],
  },
  "distance-sales-agreement": {
    eyebrow: "Yasal",
    title: "Mesafeli Satış Sözleşmesi",
    description:
      "Brakeshop üzerinden verilen siparişlerde alıcı ve satıcı arasındaki temel mesafeli satış koşulları.",
    sections: [
      {
        title: "1. Taraflar",
        body: [
          `Satıcı: ${BRAKESHOP_COMPANY.displayName} | ${BRAKESHOP_COMPANY.address} | ${BRAKESHOP_COMPANY.telephoneDisplay} | ${BRAKESHOP_COMPANY.email} | Vergi Dairesi: ${BRAKESHOP_COMPANY.taxOffice} | VKN: ${BRAKESHOP_COMPANY.taxNumber}`,
          "Alıcı; sipariş sırasında ad-soyad, teslimat/fatura adresi, telefon ve e-posta bilgilerini giren tüketicidir. Sipariş kaydında yer alan alıcı bilgileri bu sözleşmenin ayrılmaz parçasıdır.",
        ],
      },
      {
        title: "2. Konu, Dayanak ve Sözleşme Belgeleri",
        body: [
          "Bu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, brakeshop.com.tr üzerinden sipariş edilen ürünlerin satışı ve teslimine ilişkin tarafların hak ve yükümlülüklerini düzenler.",
          "Ürünün temel nitelikleri, miktarı, vergiler dâhil satış fiyatı, varsa kargo ve ek masraflar, teslimat adresi, ödeme yöntemi ve sipariş tarihi ödeme öncesi gösterilen sipariş özeti ile sipariş onay kaydında yer alır; Ön Bilgilendirme Formu ve bu kayıtlar sözleşmenin ayrılmaz parçasıdır.",
        ],
      },
      {
        title: "3. Sipariş, Ödeme ve İfa",
        body: [
          "Alıcı, elektronik ortamda ön bilgilendirmeyi ve sözleşmeyi onaylayıp ödeme yükümlülüğü doğuran sipariş butonuna bastığında sözleşme kurulur. Satıcı, sipariş belgelerini mevzuattaki süre boyunca elektronik ortamda saklar.",
          "Satıcı ürünü, siparişte belirtilen adrese ve belirtilen süre içinde; ayrıca kararlaştırılmamışsa en geç 30 gün içinde teslim eder. Ürünün temininin imkânsızlaştığı hâllerde satıcı durumu öğrendiği tarihten itibaren üç gün içinde alıcıya bildirir ve tahsil edilen bedelleri bildirimden itibaren en geç 14 gün içinde iade eder.",
          "Ürün alıcıya veya alıcının belirlediği üçüncü kişiye teslim edilene kadar kayıp ve hasar satıcıya aittir. Alıcı, satıcının belirlediği taşıyıcı dışında bir taşıyıcı seçerse sorumluluk ürünün bu taşıyıcıya teslimiyle alıcıya geçer.",
        ],
      },
      {
        title: "4. Cayma Hakkı ve Kullanımı",
        body: [
          `Alıcı, mevzuattaki istisnalar saklı kalmak üzere, teslimden itibaren 14 gün içinde gerekçe göstermeden ve cezai şart ödemeden cayabilir. Cayma bildirimi ${BRAKESHOP_COMPANY.email} adresine, şirket adresine veya Cayma Formu ile açık şekilde yapılır.`,
          "Alıcı, cayma bildiriminden itibaren 14 gün içinde ürünü geri gönderir. Ön bilgilendirmede belirli bir iade taşıyıcısı belirtilmediğinden alıcıdan iade masrafı talep edilmez; gönderim yönlendirmesi Brakeshop'tan alınır.",
          "Satıcı, cayma bildiriminin ulaşmasından itibaren 14 gün içinde uygun tüm ödemeleri, alıcının kullandığı ödeme aracına uygun ve masrafsız biçimde iade eder. Satıcı, ürünü teslim alana veya alıcı gönderim belgesini sunana kadar geri ödemeyi bekletebilir.",
        ],
      },
      {
        title: "5. Değer Kaybı, İstisnalar ve Ayıplı Mal",
        body: [
          "Alıcı, ürünü işleyişine ve teknik özelliklerine uygun şekilde incelemek için gerekli olanın ötesinde kullanmasından doğan değer azalmasından sorumlu olabilir. Ambalajın açılması tek başına cayma hakkını ortadan kaldırmaz.",
          "Kişiye özel hazırlanan, teslimden sonra başka ürünlerle karışıp ayrıştırılamayan ve Mesafeli Sözleşmeler Yönetmeliği'nde açıkça istisna tutulan ürünlerde cayma hakkı kullanılamaz. Ayıplı, yanlış veya eksik teslimlerde alıcının 6502 sayılı Kanun'dan doğan seçimlik hakları saklıdır.",
        ],
      },
      {
        title: "6. Uyuşmazlık, Delil ve Yürürlük",
        body: [
          `Alıcı talep ve şikâyetlerini ${BRAKESHOP_COMPANY.email} veya ${BRAKESHOP_COMPANY.telephoneDisplay} üzerinden iletebilir. Yürürlükteki parasal sınırlara göre tüketicinin yerleşim yerindeki veya işlemin yapıldığı yerdeki Tüketici Hakem Heyeti ya da Tüketici Mahkemesi yetkilidir.`,
          "Sipariş kaydı, ödeme kaydı, elektronik onay, e-posta ve taraflar arasındaki yazışmalar hukuka uygun şekilde delil olarak kullanılabilir. Sözleşme, alıcının elektronik onayı tarihinde yürürlüğe girer ve tarafların edimleri tamamlanıncaya kadar geçerlidir.",
        ],
      },
    ],
  },
  "withdrawal-form": {
    eyebrow: "Yasal Form",
    title: "Cayma Bildirim Formu",
    description:
      "Mesafeli satıştan cayma hakkınızı kullanmak için doldurup Brakeshop'a iletebileceğiniz örnek bildirim formu.",
    sections: [
      {
        title: "Gönderim Bilgileri",
        body: [
          `Formun gönderileceği satıcı: ${BRAKESHOP_COMPANY.displayName}`,
          `Adres: ${BRAKESHOP_COMPANY.address} | E-posta: ${BRAKESHOP_COMPANY.email} | Telefon: ${BRAKESHOP_COMPANY.telephoneDisplay}`,
        ],
      },
      {
        title: "Cayma Beyanı",
        body: [
          "Aşağıda bilgileri bulunan ürün veya ürünlere ilişkin mesafeli satış sözleşmesinden cayma hakkımı kullandığımı bildiririm.",
          "Sipariş tarihi: .......... | Teslim tarihi: .......... | Sipariş numarası: ..........",
          "Caymaya konu ürün/ürünler ve miktarı: ........................................................................",
          "Tüketicinin adı soyadı: ........................................ | Adresi: ........................................",
          "Tarih: .......... | İmza: .......... (yalnızca form kâğıt üzerinde gönderiliyorsa)",
        ],
      },
      {
        title: "Nasıl Gönderilir?",
        body: [
          `Formu doldurarak ${BRAKESHOP_COMPANY.email} adresine e-posta ile veya şirket adresine posta yoluyla iletebilirsiniz. Cayma iradenizi açıkça gösteren başka bir yazılı beyan da geçerlidir.`,
          "Bildirimin ardından ücretsiz iade gönderim yönlendirmesi için sipariş numaranızla destek ekibine ulaşın. Ürünü cayma bildiriminden itibaren 14 gün içinde gönderin ve gönderi belgesini saklayın.",
        ],
      },
    ],
  },
  "ssl-certificate": {
    eyebrow: "Güvenli Alışveriş",
    title: "SSL Sertifikası ve Güvenli Ödeme",
    description:
      "Brakeshop bağlantısı HTTPS ile korunur; ödeme bilgileri güvenli ödeme kuruluşu ekranında işlenir.",
    sections: [
      {
        title: "Şifreli Bağlantı",
        body: [
          "brakeshop.com.tr sayfaları HTTPS üzerinden sunulur. SSL/TLS sertifikası, tarayıcınız ile site arasındaki veri aktarımının şifrelenmesine yardımcı olur.",
          "Adres çubuğunda brakeshop.com.tr alan adını ve güvenli bağlantı simgesini kontrol edin. Sertifika uyarısı görürseniz kişisel bilgi girmeden sayfadan ayrılın.",
        ],
      },
      {
        title: "Ödeme Güvenliği",
        body: [
          "Kart bilgileri Brakeshop sunucularında saklanmaz; ödeme sırasında yetkili ödeme kuruluşunun güvenli formunda işlenir.",
          "Brakeshop çalışanları telefon, e-posta veya mesaj yoluyla kart şifrenizi, kartınızın tamamını ya da SMS doğrulama kodunu istemez.",
        ],
      },
    ],
  },
  accessibility: {
    eyebrow: "Erişilebilirlik",
    title: "Erişilebilirlik Bildirimi",
    description:
      "Brakeshop ürün arama ve alışveriş deneyimini daha erişilebilir ve anlaşılır hale getirmeyi hedefler.",
    sections: [
      {
        title: "Yaklaşımımız",
        body: [
          "Okunabilir metinler, yeterli kontrast, klavye ile gezinme ve anlamlı bağlantılar sunmaya özen gösteririz.",
          "Erişilebilirlik sürekli gelişen bir süreçtir; karşılaştığınız sorunları iletişim sayfasından bildirebilirsiniz.",
        ],
      },
    ],
  },
  "care-guide": {
    eyebrow: "Teknik Rehber",
    title: "Fren Diski ve Balatası Bakım Rehberi",
    description:
      "Fren balatası ve fren diski aşınma belirtileri, kontrol aralıkları ve güvenli kullanım için temel bakım önerileri.",
    sections: [
      {
        title: "Aşınma Belirtileri",
        body: [
          "Fren sırasında ses, titreşim, direksiyonda vuruntu, uzayan pedal mesafesi veya ikaz lambası fren sisteminin kontrol edilmesi gerektiğini gösterebilir.",
          "Balata kalınlığı ve disk yüzeyi düzenli bakımda ölçülmeli; yalnızca görsel tahminle karar verilmemelidir.",
        ],
      },
      {
        title: "Montaj ve Rodaj",
        body: [
          "Montaj öncesi parça uyumluluğu ve disk ölçüleri doğrulanmalı, montaj uzman servis tarafından üretici tork değerlerine göre yapılmalıdır.",
          "Yeni disk ve balatalarda üretici tarafından belirtilen rodaj prosedürüne uyulması yüzeylerin doğru eşleşmesine yardımcı olur.",
        ],
      },
    ],
  },
}

export const getBrakeshopPageMetadata = (pageKey: BrakeshopPageKey) => {
  const page = brakeshopPages[pageKey]

  return {
    title: page.title,
    description: page.description,
  }
}

const BrakeshopStaticPage = ({ pageKey }: { pageKey: BrakeshopPageKey }) => {
  const page = brakeshopPages[pageKey]

  return (
    <main className="bg-white text-[#3a080a]" style={baseFont}>
      <section className="px-[5%] py-12 small:py-16">
        <div className="mx-auto max-w-[980px]">
          <p className="text-[12px] uppercase leading-5 tracking-[0.12em] text-[#8a5b58]">
            {page.eyebrow}
          </p>
          <h1 className="mt-3 text-[34px] font-normal uppercase leading-[38px] small:text-[46px] small:leading-[50px]">
            {page.title}
          </h1>
          <p className="mt-5 max-w-[720px] text-[16px] leading-7 text-[#6f4d49] small:text-[18px] small:leading-8">
            {page.description}
          </p>
        </div>
      </section>

      <section className="border-t border-[#ead7d1] px-[5%] py-10 small:py-14">
        <div className="mx-auto grid max-w-[980px] gap-8 small:gap-10">
          {page.sections.map((section) => (
            <article
              key={section.title}
              className="grid gap-3 small:grid-cols-[240px_1fr] small:gap-10"
            >
              <h2 className="text-[18px] font-normal uppercase leading-6 text-[#3a080a]">
                {section.title}
              </h2>
              <div className="grid gap-4 text-[15px] leading-7 text-[#6f4d49] small:text-[16px]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[#ead7d1] bg-[#fff3f2] px-[5%] py-10">
        <div className="mx-auto flex max-w-[980px] flex-col gap-4 small:flex-row small:items-center small:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.12em] text-[#8a5b58]">
              Yardıma mı ihtiyacınız var?
            </p>
            <p className="mt-1 text-[18px] leading-6 text-[#3a080a]">
              Brakeshop ekibi doğru fren parçasını bulmanıza yardımcı olur.
            </p>
          </div>
          <LocalizedClientLink
            href="/contact"
            className="flex h-11 w-fit items-center justify-center bg-[#3a080a] px-6 text-[12px] font-semibold uppercase tracking-[0.08em] text-white"
          >
            İletişime Geç
          </LocalizedClientLink>
        </div>
      </section>
    </main>
  )
}

export default BrakeshopStaticPage
