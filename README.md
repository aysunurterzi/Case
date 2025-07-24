# Product Carousel

Modern ve responsive banner. E-ticaret siteleri için tasarlandı.

## ✨ Özellikler

- 📱 Responsive tasarım (mobil, tablet, desktop)
- ❤️ Favori ürünler (LocalStorage)
- ⬅️➡️ Carousel navigation
- Hover efektleri

## Nasıl Çalıştırır?

1. `index.html` dosyasını tarayıcıda aç

## Dosyalar

```
demo-aysu/
├── index.html    # Ana sayfa
├── script.js     # Tüm JavaScript kodu
└── README.md     # Bu dosya
```

##  Kod Yapısı

### Ana Fonksiyonlar
- `init()` → Uygulamayı başlatır
- `loadProducts()` → API'den ürünleri çeker
- `buildHTML()` → Sayfayı oluşturur
- `setEvents()` → Tıklama olaylarını bağlar

### Responsive Boyutlar
- **Desktop**: 5 ürün görünür
- **Tablet**: 3 ürün görünür  
- **Mobil**: 2 ürün görünür

## Öğrenebileceklerin

- **JavaScript**: async/await, DOM manipulation
- **CSS**: Flexbox, media queries
- **Web API**: LocalStorage, Fetch API

## Test Etme

Console'da dene:
```javascript
console.log(localStorage.getItem('favorites'));

console.log(localStorage.getItem('productList'));
```
