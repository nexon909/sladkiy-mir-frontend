import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2, 
  Plus, 
  Minus,
  Search, 
  X, 
  LogIn, 
  Star, 
  ShieldCheck,
  Heart,
  Truck,
  Trash2,
  Clock,
  Store,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  Calendar,
  Tag,
  Sparkles,
  Cake,
  History,
  ChevronRight,
  Gift,
  Check,
  ExternalLink,
  Navigation
} from 'lucide-react';

// URL вашего запущенного Django REST API
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
const DJANGO_SERVER_URL = 'http://127.0.0.1:8000';

// Вспомогательная функция для формирования корректного URL картинки
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600';
  }
  if (typeof imagePath === 'string' && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
    return imagePath;
  }
  return `${DJANGO_SERVER_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

const DEFAULT_CATEGORIES = [
  { id: 'cakes', slug: 'cakes', label: 'Торты', name: 'Торты' },
  { id: 'semi_finished', slug: 'semi_finished', label: 'Полуфабрикаты', name: 'Полуфабрикаты' },
  { id: 'bakery', slug: 'bakery', label: 'Булочки и Выпечка', name: 'Булочки и Выпечка' },
  { id: 'desserts', slug: 'desserts', label: 'Десерты', name: 'Десерты' },
];

const BRANCHES = [
  { id: 1, name: 'Айбек 49', desc: 'ориентир школа 60', time: '8:00 - 21:00, воскресенье выходной', lat: 41.2995, lng: 69.2780 },
  { id: 2, name: 'Шота Руставели 23', desc: 'ориентир школа 160', time: '8:00 - 20:00, воскресенье выходной', lat: 41.2952, lng: 69.2612 },
  { id: 3, name: 'Паркентская 30', desc: 'ориентир Паркентский базар', time: '8:00 - 22:00, без выходных', lat: 41.3120, lng: 69.3250 },
  { id: 4, name: 'Авиасозлар бозор', desc: 'Кадышева базар', time: '8:00 - 21:00, без выходных', lat: 41.2910, lng: 69.3360 },
  { id: 5, name: 'Авиасозлар 4, дом 1', desc: 'ориентир школа 166', time: '8:00 - 20:00, без выходных', lat: 41.2930, lng: 69.3410 },
  { id: 6, name: 'Мукими 108', desc: 'рядом со станцией метро', time: '9:00 - 20:00, без выходных', lat: 41.2825, lng: 69.2430 },
  { id: 7, name: 'Жемчуг', desc: 'магазин Жемчуг', time: '9:00 - 20:00, без выходных', lat: 41.3080, lng: 69.2740 },
  { id: 8, name: 'Бирлашган 64', desc: 'массив Бирлашган', time: '9:00 - 20:00, без выходных', lat: 41.2980, lng: 69.3550 },
];

const INITIAL_DEMO_PRODUCTS = [
  {
    id: 1,
    name: 'Шоколадный Пражский Премиум',
    category_slug: 'cakes',
    price: 220000,
    rating: 4.9,
    weight: '1.5 кг',
    description: 'Насыщенные бисквитные коржи, пропитанные сиропом, с нежным шоколадно-сливочным кремом.',
    image_url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    name: 'Ягодный Наполеон с Ванилью',
    category_slug: 'cakes',
    price: 190000,
    rating: 4.8,
    weight: '1.2 кг',
    description: 'Хрустящие коржи из слоеного теста со свежей малиной и ванильным кремом Пломбир.',
    image_url: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 3,
    name: 'Карамельный Медовик',
    category_slug: 'cakes',
    price: 180000,
    rating: 4.9,
    weight: '1.3 кг',
    description: 'Ароматные медовые коржи с прослойкой из сметанно-карамельного крема.',
    image_url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 4,
    name: 'Фирменный Торт «Сладкий Мир»',
    category_slug: 'cakes',
    price: 250000,
    rating: 5.0,
    weight: '2.0 кг',
    description: 'Авторский шедевр с орехами, бельгийским шоколадом и нежной муссовой прослойкой.',
    image_url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 5,
    name: 'Пельмени Домашние (Говядина)',
    category_slug: 'semi_finished',
    price: 65000,
    rating: 4.9,
    weight: '1.0 кг',
    description: 'Ручная лепка, сочная фаршировка из отборной телятины и специй.',
    image_url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 6,
    name: 'Вареники с Картофелем и Грибами',
    category_slug: 'semi_finished',
    price: 45000,
    rating: 4.7,
    weight: '1.0 кг',
    description: 'Нежное тонкое тесто, пюре из отборного картофеля и обжаренные шампиньоны.',
    image_url: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 7,
    name: 'Самса с Мясом Тандырная',
    category_slug: 'bakery',
    price: 12000,
    rating: 4.9,
    weight: '150 г',
    description: 'Слоеная горячая самса с рубленой говядиной и луком по традиционному рецепту.',
    image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 8,
    name: 'Круассан с Шоколадной Начинкой',
    category_slug: 'bakery',
    price: 18000,
    rating: 4.8,
    weight: '120 г',
    description: 'Воздушный французский круассан на натуральном сливочном масле с темным шоколадом.',
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 9,
    name: 'Эклеры Ванильные (4 шт)',
    category_slug: 'desserts',
    price: 48000,
    rating: 4.9,
    weight: '320 г',
    description: 'Классическое заварное пирожное с настоящим заварным кремом с семенами ванили.',
    image_url: 'https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 10,
    name: 'Макаронс Ассорти (6 шт)',
    category_slug: 'desserts',
    price: 75000,
    rating: 5.0,
    weight: '180 г',
    description: 'Миндальное печенье с ганашем из фисташки, малины, манго, соленой карамели и шоколада.',
    image_url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=600'
  }
];

const SladkiyMirLogo = ({ className = "w-10 h-10" }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
      <circle cx="100" cy="100" r="92" fill="#FAF5EF" stroke="#C88E53" strokeWidth="5" />
      <circle cx="100" cy="100" r="83" fill="none" stroke="#C88E53" strokeWidth="1.5" strokeDasharray="4 4" />
      <rect x="60" y="72" width="80" height="24" rx="6" fill="#D4A359" />
      <path d="M 60 84 Q 70 90 80 84 Q 90 90 100 84 Q 110 90 120 84 Q 130 90 140 84 L 140 96 A 6 6 0 0 1 134 102 L 66 102 A 6 6 0 0 1 60 96 Z" fill="#5C2C1D" />
      <rect x="70" y="48" width="60" height="24" rx="5" fill="#5C2C1D" />
      <rect x="80" y="28" width="40" height="20" rx="4" fill="#D4A359" />
      <path d="M 100 28 Q 104 15 110 10" fill="none" stroke="#5C2C1D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="24" r="7" fill="#C42B49" />
      <rect x="20" y="98" width="160" height="38" rx="19" fill="#5C2C1D" stroke="#FAF5EF" strokeWidth="2" />
      <text x="100" y="123" textAnchor="middle" fill="#FFFFFF" fontFamily="Georgia, serif" fontWeight="bold" fontSize="14" letterSpacing="0.5">
        СЛАДКИЙ МИР.uz
      </text>
      <text x="100" y="152" textAnchor="middle" fill="#5C2C1D" fontFamily="sans-serif" fontSize="10" fontWeight="bold">
        SINCE 2000
      </text>
    </svg>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedCategory, setSelectedCategory] = useState('cakes');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Избранное (Wishlist)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('sladkiy_mir_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Корзина
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('sladkiy_mir_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // История заказов
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const savedHistory = localStorage.getItem('sladkiy_mir_orders');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Состояние интеграции с Django
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState(INITIAL_DEMO_PRODUCTS);
  const [errorMessage, setErrorMessage] = useState(null);

  // Состояние пользователя
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sladkiy_mir_user');
      return savedUser ? JSON.parse(savedUser) : { isLoggedIn: false, name: '', phone: '', telegram: '' };
    } catch {
      return { isLoggedIn: false, name: '', phone: '', telegram: '' };
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', phone: '+998', telegram: '@' });

  // Форма заказа
  const [orderForm, setOrderForm] = useState({
    name: '',
    phone: '+998',
    telegram: '@',
    address: 'г. Ташкент, ул. Айбек 49',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliverySlot: '12:00 - 15:00',
    lat: 41.2995,
    lng: 69.2780,
    notes: ''
  });

  const [orderSuccess, setOrderSuccess] = useState(null);
  const [isSendingOrder, setIsSendingOrder] = useState(false);

  // Рефы для интерактивных карт
  const checkoutMapRef = useRef(null);
  const branchesMapRef = useRef(null);
  const yandexMapInstance = useRef(null);

  useEffect(() => {
    localStorage.setItem('sladkiy_mir_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('sladkiy_mir_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('sladkiy_mir_orders', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    if (user.isLoggedIn) {
      localStorage.setItem('sladkiy_mir_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sladkiy_mir_user');
    }
  }, [user]);

  const fetchProductsFromBackend = useCallback(async () => {
    setIsLoadingProducts(true);
    setErrorMessage(null);
    try {
      const catResponse = await fetch(`${API_BASE_URL}/categories/`, { method: 'GET' });
      if (catResponse.ok) {
        const catData = await catResponse.json();
        if (Array.isArray(catData) && catData.length > 0) {
          setCategories(catData.map(c => ({ id: c.slug, slug: c.slug, label: c.name, name: c.name })));
        }
      }

      const prodUrl = `${API_BASE_URL}/products/?category=${selectedCategory}`;
      const prodResponse = await fetch(prodUrl, { method: 'GET' });

      if (prodResponse.ok) {
        const prodData = await prodResponse.json();
        if (Array.isArray(prodData) && prodData.length > 0) {
          setProducts(prodData);
        } else {
          setProducts(INITIAL_DEMO_PRODUCTS.filter(p => p.category_slug === selectedCategory));
        }
        setIsBackendConnected(true);
      } else {
        throw new Error(`Статус API: ${prodResponse.status}`);
      }
    } catch (err) {
      setIsBackendConnected(false);
      // При отсутствии ответа сервера используем демо-данные
      setProducts(INITIAL_DEMO_PRODUCTS.filter(p => p.category_slug === selectedCategory));
    } finally {
      setIsLoadingProducts(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchProductsFromBackend();
  }, [fetchProductsFromBackend]);

  useEffect(() => {
    if (!window.ymaps && !document.getElementById('yandex-maps-js-cdn')) {
      const script = document.createElement('script');
      script.id = 'yandex-maps-js-cdn';
      script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (user.isLoggedIn) {
      setOrderForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        phone: user.phone || prev.phone,
        telegram: user.telegram || prev.telegram
      }));
    }
  }, [user]);

  useEffect(() => {
    if (isCheckoutOpen && checkoutMapRef.current) {
      const initMap = () => {
        if (!window.ymaps || !window.ymaps.ready) {
          setTimeout(initMap, 200);
          return;
        }

        window.ymaps.ready(() => {
          if (!checkoutMapRef.current) return;
          checkoutMapRef.current.innerHTML = '';

          const map = new window.ymaps.Map(checkoutMapRef.current, {
            center: [orderForm.lat, orderForm.lng],
            zoom: 14,
            controls: ['zoomControl', 'geolocationControl']
          });
          yandexMapInstance.current = map;

          const placemark = new window.ymaps.Placemark(
            [orderForm.lat, orderForm.lng],
            { 
              hintContent: 'Адрес доставки', 
              balloonContent: 'Перетащите метку на ваш дом или кликните по карте' 
            },
            { 
              draggable: true, 
              preset: 'islands#redDotIconWithCaption' 
            }
          );

          map.geoObjects.add(placemark);

          placemark.events.add('dragend', () => {
            const coords = placemark.geometry.getCoordinates();
            setOrderForm(prev => ({ ...prev, lat: coords[0], lng: coords[1] }));
          });

          map.events.add('click', (e) => {
            const coords = e.get('coords');
            placemark.geometry.setCoordinates(coords);
            setOrderForm(prev => ({ ...prev, lat: coords[0], lng: coords[1] }));
          });
        });
      };

      initMap();
    }
  }, [isCheckoutOpen]);

  useEffect(() => {
    if (activeTab === 'branches' && branchesMapRef.current) {
      const initBranchesMap = () => {
        if (!window.ymaps || !window.ymaps.ready) {
          setTimeout(initBranchesMap, 200);
          return;
        }

        window.ymaps.ready(() => {
          if (!branchesMapRef.current) return;
          branchesMapRef.current.innerHTML = '';

          const map = new window.ymaps.Map(branchesMapRef.current, {
            center: [41.3000, 69.2800],
            zoom: 12,
            controls: ['zoomControl', 'fullscreenControl']
          });

          BRANCHES.forEach(branch => {
            const placemark = new window.ymaps.Placemark(
              [branch.lat, branch.lng],
              {
                balloonContentHeader: `<strong style="color:#5C2C1D;">${branch.name}</strong>`,
                balloonContentBody: `<div style="font-size:12px; color:#332219;">${branch.desc}<br/><b style="color:#C88E53;">${branch.time}</b></div>`,
                hintContent: branch.name
              },
              { preset: 'islands#brownShoppingIcon' }
            );
            map.geoObjects.add(placemark);
          });
        });
      };

      initBranchesMap();
    }
  }, [activeTab]);

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const getTotalCartPrice = () => cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);

  const handleReorder = (pastOrder) => {
    pastOrder.items.forEach(item => {
      addToCart({
        id: item.id || Math.random(),
        name: item.product_name,
        price: item.price,
        image_url: item.image_url
      });
    });
    setIsHistoryOpen(false);
    setIsCartOpen(true);
  };

  const handleSendOrder = async (e) => {
    e.preventDefault();
    if (!user.isLoggedIn) {
      setIsCheckoutOpen(false);
      setIsAuthModalOpen(true);
      return;
    }

    setIsSendingOrder(true);
    setErrorMessage(null);

    const finalAmount = getTotalCartPrice();

    const payload = {
      customer_name: orderForm.name || user.name || 'Клиент',
      phone: orderForm.phone,
      telegram: orderForm.telegram,
      address: orderForm.address,
      delivery_date: orderForm.deliveryDate,
      delivery_slot: orderForm.deliverySlot,
      lat: parseFloat(orderForm.lat),
      lng: parseFloat(orderForm.lng),
      notes: orderForm.notes || '',
      total_amount: finalAmount,
      items: cart.map(item => ({
        product_name: item.name,
        price: parseFloat(item.price),
        quantity: item.qty
      }))
    };

    try {
      let createdOrder;
      
      if (isBackendConnected) {
        const response = await fetch(`${API_BASE_URL}/orders/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Не удалось сохранить заказ (${response.status})`);
        }
        createdOrder = await response.json();
      } else {
        await new Promise(res => setTimeout(res, 600));
        createdOrder = { id: Math.floor(1000 + Math.random() * 9000) };
      }

      const orderRecord = {
        id: createdOrder.id,
        date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'Готовится',
        totalAmount: finalAmount,
        items: cart.map(item => ({ product_name: item.name, price: item.price, quantity: item.qty })),
        address: payload.address,
        deliverySlot: `${payload.delivery_date}, ${payload.delivery_slot}`
      };

      setOrderHistory(prev => [orderRecord, ...prev]);

      const googleMapsUrl = `https://maps.google.com/?q=${orderForm.lat.toFixed(6)},${orderForm.lng.toFixed(6)}`;
      const yandexMapsUrl = `https://yandex.ru/maps/?pt=${orderForm.lng.toFixed(6)},${orderForm.lat.toFixed(6)}&z=16`;

      setOrderSuccess({
        orderId: createdOrder.id,
        customerName: payload.customer_name,
        phone: payload.phone,
        address: payload.address,
        totalAmount: finalAmount,
        deliverySlot: `${payload.delivery_date} (${payload.delivery_slot})`,
        googleMapsUrl,
        yandexMapsUrl,
        sentToDjango: isBackendConnected
      });

      setCart([]);
      setIsCheckoutOpen(false);
    } catch (err) {
      setErrorMessage(`Ошибка отправки заказа: ${err.message}`);
    } finally {
      setIsSendingOrder(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = p.category_slug === selectedCategory || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFav = onlyFavorites ? favorites.includes(p.id) : true;
    return matchesCat && matchesSearch && matchesFav;
  });

  return (
    <div className="min-h-screen bg-[#FAF5EF] text-[#332219] font-sans flex flex-col max-w-full overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5D7C8] shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          <div className="flex items-center space-x-2 shrink-0 cursor-pointer" onClick={() => setActiveTab('catalog')}>
            <SladkiyMirLogo className="w-8 h-8 sm:w-10 sm:h-10" />
            <div>
              <span className="text-base sm:text-xl font-black text-[#5C2C1D] tracking-wide block leading-none font-serif">
                СЛАДКИЙ МИР<span className="text-[#C88E53] text-xs sm:text-sm font-sans">.uz</span>
              </span>
              <span className="block text-[8px] sm:text-[10px] font-bold text-[#C88E53] tracking-wider uppercase mt-0.5">
                Кондитерская • Ташкент
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-1 bg-[#F5EBE1] p-1 rounded-xl border border-[#E5D7C8]">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'catalog' ? 'bg-[#5C2C1D] text-white shadow-sm' : 'text-[#5C2C1D] hover:bg-white/60'
              }`}
            >
              Витрина
            </button>
            <button
              onClick={() => setActiveTab('branches')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'branches' ? 'bg-[#5C2C1D] text-white shadow-sm' : 'text-[#5C2C1D] hover:bg-white/60'
              }`}
            >
              Филиалы (8)
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'about' ? 'bg-[#5C2C1D] text-white shadow-sm' : 'text-[#5C2C1D] hover:bg-white/60'
              }`}
            >
              О нас
            </button>
          </nav>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Статус связи с бэкендом */}
            

            {/* История Заказов */}
            <button
              onClick={() => setIsHistoryOpen(true)}
              title="Мои заказы"
              className="p-1.5 sm:p-2 rounded-lg bg-[#F5EBE1] hover:bg-[#E5D7C8] text-[#5C2C1D] transition-colors border border-[#E5D7C8] relative"
            >
              <History className="w-4 h-4 text-[#5C2C1D]" />
              {orderHistory.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C88E53] text-white text-[9px] font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {orderHistory.length}
                </span>
              )}
            </button>

            {user.isLoggedIn ? (
              <div className="flex items-center space-x-1.5 bg-[#F5EBE1] border border-[#E5D7C8] px-2 py-1 rounded-lg">
                <div className="w-5 h-5 bg-[#5C2C1D] text-[#C88E53] rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-bold text-[#5C2C1D] hidden sm:inline truncate max-w-[80px]">{user.name}</span>
                <button 
                  onClick={() => setUser({ isLoggedIn: false, name: '', phone: '', telegram: '' })} 
                  className="text-[10px] font-semibold text-rose-600 hover:underline pl-1 shrink-0"
                >
                  Выход
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-2 sm:px-2.5 py-1.5 rounded-lg bg-[#F5EBE1] hover:bg-[#E5D7C8] text-[#5C2C1D] font-bold text-xs flex items-center space-x-1 transition-colors border border-[#E5D7C8]"
              >
                <LogIn className="w-3.5 h-3.5 text-[#C88E53]" />
                <span className="hidden sm:inline">Войти</span>
              </button>
            )}

            {/* Корзина */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#5C2C1D] text-white font-bold text-xs flex items-center space-x-1 shadow-sm hover:bg-[#4A2318] transition-all border border-[#703D2A]"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#C88E53]" />
              <span className="hidden sm:inline">Корзина</span>
              {cart.length > 0 && (
                <span className="bg-[#C88E53] text-[#5C2C1D] font-extrabold rounded-full w-4 h-4 text-[10px] flex items-center justify-center ml-0.5">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">

        {}
        {activeTab === 'catalog' && (
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#5C2C1D] via-[#4A2318] to-[#36180E] text-white p-5 sm:p-8 mb-6 shadow-md border border-[#703D2A]">
            <div className="relative z-10 max-w-xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-block px-2.5 py-0.5 bg-[#C88E53]/20 border border-[#C88E53]/40 text-[#E5B869] rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                  Ташкент • С 2000 года
                </span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-full text-[9px] sm:text-[10px] font-bold">
                  <Cake className="w-3 h-3 text-amber-400 shrink-0" />
                  <span>Свежая выпечка каждый день</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black leading-tight font-serif text-[#FAF5EF]">
                Натуральные Торты и Десерты Ручной Работы
              </h1>
              <p className="mt-2 text-[#D4A359] text-xs leading-relaxed">
                Заказывайте любимые классические торты, румяную выпечку и полуфабрикаты с быстрой доставкой курьером по Ташкенту!
              </p>
            </div>
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none hidden sm:block">
              <SladkiyMirLogo className="w-72 h-72" />
            </div>
          </div>
        )}

        {}
        {activeTab === 'catalog' && (
          <div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto shrink-0 scrollbar-none">
                {categories.map(cat => (
                  <button
                    key={cat.id || cat.slug}
                    onClick={() => { setSelectedCategory(cat.slug || cat.id); setOnlyFavorites(false); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                      selectedCategory === (cat.slug || cat.id) && !onlyFavorites
                        ? 'bg-[#5C2C1D] text-white shadow-sm ring-1 ring-[#C88E53]'
                        : 'bg-white text-[#5C2C1D] hover:bg-[#F5EBE1] border border-[#E5D7C8]'
                    }`}
                  >
                    {cat.label || cat.name}
                  </button>
                ))}
                <button
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 whitespace-nowrap shrink-0 ${
                    onlyFavorites
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-white text-rose-600 hover:bg-rose-50 border border-rose-200'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-white' : 'fill-rose-600'}`} />
                  <span>Избранное ({favorites.length})</span>
                </button>
              </div>

              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#C88E53]" />
                <input
                  type="text"
                  placeholder="Поиск десертов..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E5D7C8] bg-white focus:outline-none focus:ring-1 focus:ring-[#C88E53] text-xs"
                />
              </div>
            </div>

            {}
            {isLoadingProducts ? (
              <div className="text-center py-16">
                <RefreshCw className="w-8 h-8 mx-auto text-[#C88E53] animate-spin mb-3" />
                <p className="text-xs font-bold text-[#5C2C1D]">Загрузка каталога сладостей...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#E5D7C8]">
                <ShoppingBag className="w-10 h-10 mx-auto text-[#C88E53]/40 mb-2" />
                <p className="text-sm font-bold text-[#5C2C1D]">Товары не найдены</p>
                <p className="text-xs text-slate-400 mt-1">Попробуйте изменить поисковый запрос или выбрать другую категорию</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map(product => {
                  const isFav = favorites.includes(product.id);
                  const finalImgSrc = getImageUrl(product.image || product.image_url);
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-2xl border border-[#E5D7C8] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group"
                    >
                      <div className="relative h-48 overflow-hidden bg-[#F5EBE1]">
                        <img
                          src={finalImgSrc}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={() => toggleFavorite(product.id)}
                          className="absolute top-2.5 left-2.5 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-rose-500 hover:bg-white transition-colors"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                        </button>
                        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-[#5C2C1D] flex items-center space-x-1 border border-[#E5D7C8]">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{product.rating || 5.0}</span>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 bg-[#5C2C1D]/80 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-bold text-white border border-[#C88E53]/40">
                          {product.weight || '1.0 кг'}
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-[#5C2C1D] font-serif group-hover:text-[#C88E53] transition-colors leading-tight">
                            {product.name}
                          </h3>
                          <p className="text-slate-600 text-xs mt-1.5 leading-relaxed font-normal line-clamp-2">
                            {product.description || 'Свежий десерт ручной работы кондитерской «Сладкий Мир»'}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F5EBE1]">
                          <div>
                            <span className="block text-[9px] uppercase font-bold text-slate-400">Цена</span>
                            <span className="text-sm font-black text-[#5C2C1D]">
                              {parseFloat(product.price).toLocaleString('ru-RU')} <span className="text-[11px] font-semibold text-[#C88E53]">сум</span>
                            </span>
                          </div>
                          <button
                            onClick={() => addToCart(product)}
                            className="px-2.5 py-1.5 bg-[#F5EBE1] hover:bg-[#5C2C1D] text-[#5C2C1D] hover:text-white rounded-xl font-bold text-xs transition-colors flex items-center space-x-1 border border-[#E5D7C8]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>В корзину</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {}
        {activeTab === 'branches' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-[#E5D7C8] shadow-sm">
              <h2 className="text-xl font-black font-serif text-[#5C2C1D] mb-1">Филиалы кондитерской «Сладкий Мир»</h2>
              <p className="text-xs text-slate-500">Все 8 фирменных магазинов по Ташкенту. Выберите удобную точку для самовывоза или посещения.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                {BRANCHES.map(branch => (
                  <div key={branch.id} className="bg-white p-3.5 rounded-xl border border-[#E5D7C8] hover:border-[#C88E53] transition-colors shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Store className="w-4 h-4 text-[#C88E53]" />
                        <h4 className="text-xs font-bold text-[#5C2C1D]">{branch.name}</h4>
                      </div>
                      <span className="text-[10px] bg-[#F5EBE1] text-[#5C2C1D] font-bold px-2 py-0.5 rounded-md">
                        {branch.desc}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-1.5 text-[11px] text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-[#C88E53]" />
                      <span>{branch.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-2 bg-white p-2 rounded-2xl border border-[#E5D7C8] shadow-sm">
                <div ref={branchesMapRef} className="w-full h-[460px] rounded-xl overflow-hidden" />
              </div>
            </div>
          </div>
        )}

        {}
        {activeTab === 'about' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5D7C8] shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <SladkiyMirLogo className="w-12 h-12" />
                <div>
                  <h2 className="text-2xl font-black font-serif text-[#5C2C1D]">О Кондитерской «Сладкий Мир»</h2>
                  <p className="text-xs text-[#C88E53] font-bold">Ташкент, Узбекистан • С 2000 года</p>
                </div>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                «Сладкий Мир» — одна из ведущих сетей кондитерских в Ташкенте. Уже более 25 лет мы радостно встречаем жителей города свежими тортами, ароматными булочками, пельменями ручной лепки и изысканными европейскими десертами.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#F5EBE1]">
                <div className="bg-[#FAF5EF] p-3 rounded-xl border border-[#E5D7C8]">
                  <span className="block text-lg font-black text-[#5C2C1D]">8 Точек</span>
                  <span className="text-[11px] text-slate-500">По всему Ташкенту</span>
                </div>
                <div className="bg-[#FAF5EF] p-3 rounded-xl border border-[#E5D7C8]">
                  <span className="block text-lg font-black text-[#5C2C1D]">100% Натурально</span>
                  <span className="text-[11px] text-slate-500">Натуральное сливочное масло</span>
                </div>
                <div className="bg-[#FAF5EF] p-3 rounded-xl border border-[#E5D7C8]">
                  <span className="block text-lg font-black text-[#5C2C1D]">Быстрая Доставка</span>
                  <span className="text-[11px] text-slate-500">Привезем к назначенному часу</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white h-full shadow-xl flex flex-col justify-between p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5D7C8]">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-[#C88E53]" />
                  <h2 className="text-sm font-bold font-serif text-[#5C2C1D]">Ваша Корзина</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-10 h-10 mx-auto text-[#C88E53]/30 mb-2" />
                  <p className="text-slate-500 text-xs font-semibold">Ваша корзина пуста</p>
                  <p className="text-[11px] text-slate-400 mt-1">Добавьте вкусный торт с витрины!</p>
                </div>
              ) : (
                <div className="divide-y divide-[#F5EBE1] mt-3">
                  {cart.map(item => (
                    <div key={item.id} className="py-2.5 flex items-center space-x-3">
                      <img 
                        src={getImageUrl(item.image || item.image_url)} 
                        alt={item.name} 
                        className="w-10 h-10 rounded-xl object-cover bg-[#F5EBE1]" 
                      />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-[#5C2C1D] leading-tight">{item.name}</h4>
                        <span className="text-xs font-black text-[#C88E53]">
                          {(parseFloat(item.price) * item.qty).toLocaleString('ru-RU')} сум
                        </span>
                        <div className="flex items-center space-x-2 mt-1">
                          <button onClick={() => updateQty(item.id, -1)} className="w-4 h-4 rounded bg-[#F5EBE1] text-xs font-bold">-</button>
                          <span className="text-xs font-bold">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="w-4 h-4 rounded bg-[#F5EBE1] text-xs font-bold">+</button>
                        </div>
                      </div>
                      <button onClick={() => updateQty(item.id, -item.qty)} className="text-slate-300 hover:text-rose-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-3 border-t border-[#E5D7C8]">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-500">Итого:</span>
                  <span className="text-lg font-black text-[#5C2C1D]">
                    {getTotalCartPrice().toLocaleString('ru-RU')} сум
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (!user.isLoggedIn) {
                      setIsCartOpen(false);
                      setIsAuthModalOpen(true);
                    } else {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }
                  }}
                  className="w-full py-2.5 bg-[#5C2C1D] hover:bg-[#4A2318] text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Перейти к оформлению
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 sm:p-5 shadow-2xl relative border border-[#E5D7C8] my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#E5D7C8]">
              <div>
                <h3 className="text-sm font-bold font-serif text-[#5C2C1D]">Детали Доставки</h3>
                <p className="text-[10px] text-slate-400">Укажите контакты, время и метку на карте</p>
              </div>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mb-3 p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSendOrder} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#5C2C1D] mb-1">Имя</label>
                  <input
                    type="text"
                    required
                    value={orderForm.name}
                    onChange={e => setOrderForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[#E5D7C8] text-xs focus:ring-1 focus:ring-[#C88E53] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#5C2C1D] mb-1">Телефон</label>
                  <input
                    type="text"
                    required
                    value={orderForm.phone}
                    onChange={e => setOrderForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[#E5D7C8] text-xs focus:ring-1 focus:ring-[#C88E53] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#5C2C1D] mb-1">Telegram</label>
                  <input
                    type="text"
                    value={orderForm.telegram}
                    onChange={e => setOrderForm(prev => ({ ...prev, telegram: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[#E5D7C8] text-xs focus:ring-1 focus:ring-[#C88E53] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[#5C2C1D] mb-1">Дата доставки</label>
                  <input
                    type="date"
                    required
                    value={orderForm.deliveryDate}
                    onChange={e => setOrderForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[#E5D7C8] text-xs focus:ring-1 focus:ring-[#C88E53] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#5C2C1D] mb-1">Время курьера</label>
                  <select
                    value={orderForm.deliverySlot}
                    onChange={e => setOrderForm(prev => ({ ...prev, deliverySlot: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[#E5D7C8] text-xs focus:ring-1 focus:ring-[#C88E53] focus:outline-none bg-white"
                  >
                    <option value="10:00 - 12:00">10:00 - 12:00 (Утро)</option>
                    <option value="12:00 - 15:00">12:00 - 15:00 (Обед)</option>
                    <option value="15:00 - 18:00">15:00 - 18:00 (День)</option>
                    <option value="18:00 - 21:00">18:00 - 21:00 (Вечер)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5C2C1D] mb-1">Адрес / Ориентир</label>
                <input
                  type="text"
                  required
                  placeholder="г. Ташкент, ул. Айбек 49..."
                  value={orderForm.address}
                  onChange={e => setOrderForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-[#E5D7C8] text-xs focus:ring-1 focus:ring-[#C88E53] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#5C2C1D] mb-1 flex items-center justify-between">
                  <span>Точка на карте для курьера (перетащите красную метку):</span>
                  <span className="text-[#C88E53] font-mono text-[9px]">
                    {orderForm.lat.toFixed(4)}, {orderForm.lng.toFixed(4)}
                  </span>
                </label>
                <div ref={checkoutMapRef} className="w-full h-36 rounded-xl border border-[#E5D7C8] overflow-hidden" />
              </div>

              <button
                type="submit"
                disabled={isSendingOrder}
                className="w-full py-2.5 bg-[#5C2C1D] hover:bg-[#4A2318] text-white font-bold text-xs rounded-xl shadow transition uppercase flex items-center justify-center space-x-2"
              >
                {isSendingOrder ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Отправка заказа...</span>
                  </>
                ) : (
                  <span>Подтвердить и Оформить Заказ</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 text-center shadow-2xl relative border border-[#E5D7C8]">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold font-serif text-[#5C2C1D]">Заказ №{orderSuccess.orderId} Принят!</h3>
            <p className="text-xs text-slate-500 mt-1">Спасибо, {orderSuccess.customerName}! Мы уже начали готовить ваш заказ.</p>

            <div className="bg-[#FAF5EF] p-3 rounded-xl border border-[#E5D7C8] text-left my-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Сумма:</span>
                <span className="font-bold text-[#5C2C1D]">{orderSuccess.totalAmount.toLocaleString('ru-RU')} сум</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Доставка:</span>
                <span className="font-semibold text-slate-700">{orderSuccess.deliverySlot}</span>
              </div>
              <div className="pt-1.5 border-t border-[#E5D7C8] flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Карта курьеру:</span>
                <a 
                  href={orderSuccess.googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#C88E53] font-bold hover:underline flex items-center space-x-0.5"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full py-2 bg-[#5C2C1D] hover:bg-[#4A2318] text-white text-xs font-bold rounded-xl transition"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      )}

      {}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto border-l border-[#E5D7C8]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E5D7C8]">
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-[#C88E53]" />
                  <h2 className="text-base font-bold font-serif text-[#5C2C1D]">История Ваших Заказов</h2>
                </div>
                <button onClick={() => setIsHistoryOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {orderHistory.length === 0 ? (
                <div className="text-center py-16">
                  <History className="w-12 h-12 mx-auto text-[#C88E53]/30 mb-2" />
                  <p className="text-sm font-bold text-[#5C2C1D]">У вас пока нет заказов</p>
                  <p className="text-xs text-slate-400 mt-1">Выберите вкусные торты на витрине!</p>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {orderHistory.map(ord => (
                    <div key={ord.id} className="bg-[#FAF5EF] p-4 rounded-xl border border-[#E5D7C8] shadow-sm">
                      <div className="flex items-center justify-between border-b border-[#E5D7C8]/60 pb-2 mb-2">
                        <div>
                          <span className="text-xs font-bold text-[#5C2C1D]">Заказ №{ord.id}</span>
                          <span className="block text-[10px] text-slate-400">{ord.date}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          {ord.status || 'Готовится'}
                        </span>
                      </div>

                      <div className="space-y-1 my-2">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-slate-700">
                            <span>{it.product_name} × {it.quantity}</span>
                            <span className="font-semibold">{Number(it.price * it.quantity).toLocaleString('ru-RU')} сум</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#E5D7C8]/60 flex items-center justify-between mt-2">
                        <div>
                          <span className="block text-[9px] text-slate-400 uppercase">Итого</span>
                          <span className="text-xs font-black text-[#5C2C1D]">
                            {Number(ord.totalAmount).toLocaleString('ru-RU')} сум
                          </span>
                        </div>
                        <button
                          onClick={() => handleReorder(ord)}
                          className="px-3 py-1.5 bg-[#5C2C1D] hover:bg-[#4A2318] text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                        >
                          <RefreshCw className="w-3 h-3 text-[#C88E53]" />
                          <span>Повторить заказ</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-4 shadow-2xl relative border border-[#E5D7C8]">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="text-xs font-bold font-serif text-[#5C2C1D]">Вход в Аккаунт</h3>
                <p className="text-[10px] text-slate-400">Введите ваше имя для оформления</p>
              </div>
              <button onClick={() => setIsAuthModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setUser({ isLoggedIn: true, name: authForm.name || 'Клиент', phone: authForm.phone, telegram: authForm.telegram });
                setIsAuthModalOpen(false);
              }} 
              className="space-y-2.5"
            >
              <div>
                <label className="block text-[9px] font-bold text-[#5C2C1D] mb-0.5">Ваше Имя</label>
                <input
                  type="text"
                  required
                  placeholder="Азиз"
                  value={authForm.name}
                  onChange={e => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-1.5 rounded-lg border border-[#E5D7C8] text-xs focus:ring-1 focus:ring-[#C88E53] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-[#5C2C1D] mb-0.5">Телефон</label>
                <input
                  type="text"
                  required
                  value={authForm.phone}
                  onChange={e => setAuthForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full p-1.5 rounded-lg border border-[#E5D7C8] text-xs focus:ring-1 focus:ring-[#C88E53] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#5C2C1D] hover:bg-[#4A2318] text-white font-bold text-xs rounded-lg shadow transition"
              >
                Войти
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      <footer className="bg-white border-t border-[#E5D7C8] mt-auto py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#5C2C1D] text-xs">
          <div className="flex items-center space-x-2">
            <SladkiyMirLogo className="w-5 h-5" />
            <span className="font-serif font-black text-xs">СЛАДКИЙ МИР.uz</span>
            <span className="text-slate-400 text-[10px]">© 2026. Ташкент</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Заказ и доставка десертов по Ташкенту • С 2000 года
          </div>
        </div>
      </footer>
    </div>
  );
}