(() => {
    const CONFIG = {
        API_URL: 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json',
        CACHE_KEY: 'productList',
        FAVORITES_KEY: 'favorites',
        HERO_SELECTOR: 'eb-hero-banner-carousel',
        TITLE: 'Sizin için Seçtiklerimiz'
    };

    const formatPrice = (price) => price.toLocaleString('tr-TR') + ' TL';
    const calculateDiscount = (original, current) => 
        original && current < original ? Math.round(((original - current) / original) * 100) : 0;
    const randomBool = (probability = 0.5) => Math.random() < probability;
    const getFavorites = () => JSON.parse(localStorage.getItem(CONFIG.FAVORITES_KEY)) || [];
    const saveFavorites = (favorites) => localStorage.setItem(CONFIG.FAVORITES_KEY, JSON.stringify(favorites));

    const init = () => {
        if (window.location.pathname === "/" || window.location.pathname.includes("index.html")) {
            console.log('Home page detected');
            loadProducts();
        } else {
            console.log('Wrong Page!');
        }
    };

    const loadProducts = async () => {
        const products = await getProductList();
        if (products.length > 0) {
            buildHTML(products);
            buildCSS();
            setEvents(products);
        }
    };

    const getProductList = async () => {
        try {
            const response = await fetch(CONFIG.API_URL);
            if (!response.ok)
                throw new Error(`HTTP error! status: ${response.status}`);
            
            const products = await response.json();
            localStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(products));
            return products;
        } catch (error) {
            console.error('API request failed:', error);
            const cached = localStorage.getItem(CONFIG.CACHE_KEY);
            return cached ? JSON.parse(cached) : [];
        }
    };

    const buildHTML = (products) => {
        const mainWrapper = document.createElement('div');
        mainWrapper.classList.add('carousel-main-wrapper');

        const prevButton = document.createElement('button');
        prevButton.classList.add('carousel-button', 'prev');
        prevButton.innerHTML = '&#8249;';

        const bannerContainer = document.createElement('div');
        bannerContainer.classList.add('banner-container');
        
        const bannerTitle = document.createElement('h2');
        bannerTitle.textContent = CONFIG.TITLE;
        bannerTitle.classList.add('banner-title');
        bannerContainer.appendChild(bannerTitle);
        
        const carouselContainer = document.createElement('div');
        carouselContainer.classList.add('carousel-container');

        const carouselScrollable = document.createElement('div');
        carouselScrollable.classList.add('carousel-scrollable');
        
        products.forEach(product => {
            const productCard = createProductCard(product);
            carouselScrollable.appendChild(productCard);
        });
        
        carouselContainer.appendChild(carouselScrollable);
        bannerContainer.appendChild(carouselContainer);

        const nextButton = document.createElement('button');
        nextButton.classList.add('carousel-button', 'next');
        nextButton.innerHTML = '&#8250;';

        mainWrapper.appendChild(prevButton);
        mainWrapper.appendChild(bannerContainer);
        mainWrapper.appendChild(nextButton);

        const heroBanner = document.querySelector(CONFIG.HERO_SELECTOR);
        if (heroBanner) {
            heroBanner.insertAdjacentElement("afterend", mainWrapper);
        }
    };

    const createProductCard = (product) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.dataset.productId = product.id;

        const favorites = getFavorites();
        const isFavorite = favorites.includes(product.id);
        const discount = calculateDiscount(product.original_price, product.price);
        
        let badges = [];
        if (randomBool(0.4)) {
            badges.push('<img src="https://www.e-bebek.com/assets/images/cok-satan@2x.png" class="badge" alt="Çok Satan">');
        }
        if (badges.length < 2 && randomBool(0.3)) {
            badges.push('<img src="https://www.e-bebek.com/assets/images/kargo-bedava@2x.png" class="badge" alt="Kargo Bedava">');
        }
        
        productCard.innerHTML = `
            <div class="product-badges">
                <div class="badge-group">${badges.join('')}</div>
                <button class="favorite-button ${isFavorite ? 'filled' : ''}">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                </button>
            </div>
            
            <img src="${product.img}" class="product-image" alt="${product.name}">
            
            <div class="product-details">
                <p class="product-title">
                    <span class="product-brand">${product.brand}</span> - ${product.name}
                </p>

                <div class="product-rating">
                    <div class="stars">★★★★☆</div>
                    <span class="review-count">(${Math.floor(Math.random() * 500) + 1})</span>
                </div>

                <div class="price-section">
                    ${discount > 0 ? `
                        <div class="discount-area">
                            <span class="original-price">${formatPrice(product.original_price)}</span>
                            <span class="discount-percent">%${discount}</span>
                        </div>
                    ` : '<div class="discount-area"></div>'}
                    <div class="current-price ${discount > 0 ? 'has-discount' : 'no-discount'}">
                        ${formatPrice(product.price)}
                    </div>
                </div>

                <div class="promotion-area">
                    ${randomBool(0.4) ? '<p class="product-promotion">Farklı ürünlerde 3 al 2 öde</p>' : ''}
                </div>

                <button class="add-to-cart-button">Sepete Ekle</button>
            </div>
        `;
        
        return productCard;
    };

    const buildCSS = () => {
        if (document.getElementById('product-carousel-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'product-carousel-styles';
        style.textContent = `
            .carousel-main-wrapper {
                margin: 20px auto;
                width: fit-content;
                max-width: min(1200px, calc(100vw - 40px));
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
            }

            .banner-container {
                background-color: #fff;
                border-radius: 35px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                width: fit-content;
                max-width: 100%;
            }

            .banner-title {
                font-size: 24px;
                font-family: 'Quicksand', sans-serif;
                font-weight: 700;
                color: #f28e00;
                margin: 0;
                padding: 20px 30px;
                background-color: #fff6eb;
                border-top-left-radius: 35px;
                border-top-right-radius: 35px;
            }

            .carousel-container {
                padding: 20px 25px 25px 25px;
                overflow: hidden;
            }

            .carousel-scrollable {
                display: flex;
                gap: 12px;
                overflow-x: auto;
                scroll-behavior: smooth;
                scrollbar-width: none;
                -ms-overflow-style: none;
                padding: 15px 0 20px 0;
                width: calc(5 * 220px + 4 * 12px);
                max-width: 100%;
            }

            .carousel-scrollable::-webkit-scrollbar {
                display: none;
            }

            .carousel-button {
                background-color: #f28e00;
                color: white;
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                transition: all 0.3s ease;
                flex-shrink: 0;
            }

            .carousel-button:hover {
                opacity: 1;
                transform: scale(1.05);
            }

            .product-card {
                flex: 0 0 auto;
                width: 220px;
                height: 450px;
                background-color: #fff;
                border-radius: 8px;
                border: 1px solid #e5e5e5;
                position: relative;
                cursor: pointer;
                overflow: visible;
                margin: 8px 0;
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;
            }

            .product-card:hover {
                border-color: #f28e00;
            }

            .product-badges {
                position: absolute;
                top: 10px;
                left: 10px;
                right: 10px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                z-index: 5;
                gap: 5px;
            }

            .badge-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .badge {
                width: 50px;
                height: 50px;
                object-fit: contain;
                display: block;
            }

            .favorite-button {
                background-color: rgba(255,255,255,0.95);
                border: none;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                backdrop-filter: blur(10px);
            }

            .favorite-button:hover {
                background-color: #fff;
                transform: scale(1.05);
            }

            .favorite-button svg {
                width: 20px;
                height: 20px;
                fill: none;
                stroke: #f28e00;
                stroke-width: 2.5;
            }

            .favorite-button.filled svg {
                fill: #f28e00;
                stroke: #f28e00;
            }

            .product-image {
                width: 100%;
                height: 160px;
                object-fit: cover;
                border-radius: 8px 8px 0 0;
            }

            .product-details {
                padding: 12px 12px 18px 12px;
                display: flex;
                flex-direction: column;
                flex-grow: 1;
                justify-content: space-between;
            }

            .product-title {
                font-size: 11px;
                color: #7d7d7d;
                margin: 0 0 8px 0;
                line-height: 1.3;
                height: 42px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
            }

            .product-brand {
                font-weight: 700;
                color: #333;
            }

            .product-rating {
                display: flex;
                align-items: center;
                gap: 5px;
                margin-bottom: 8px;
            }

            .stars {
                color: #ffc107;
                font-size: 14px;
                letter-spacing: 1px;
            }

            .review-count {
                font-size: 11px;
                color: #999;
            }

            .price-section {
                margin-bottom: 8px;
            }

            .discount-area {
                min-height: 24px;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 4px;
            }

            .original-price {
                font-size: 12px;
                color: #999;
                text-decoration: line-through;
            }

            .discount-percent {
                background-color: #00a365;
                color: white;
                font-size: 12px;
                font-weight: 700;
                padding: 3px 6px;
                border-radius: 3px;
                display: inline-block;
            }

            .current-price {
                font-size: 20px;
                font-weight: 700;
                margin-top: 4px;
            }

            .current-price.has-discount {
                color: #00a365;
            }

            .current-price.no-discount {
                color: #7d7d7d;
            }

            .promotion-area {
                min-height: 30px;
                display: flex;
                align-items: flex-start;
                margin: 8px 0;
                margin-top: auto;
            }

            .product-promotion {
                font-size: 10px;
                color: #00a365;
                background-color: rgba(0, 163, 101, 0.1);
                padding: 4px 8px;
                border-radius: 12px;
                margin: 0;
                display: inline-block;
            }

            .add-to-cart-button {
                width: 100%;
                background-color: #fff7ec;
                color: #f28e00;
                border: none;
                padding: 12px;
                border-radius: 20px;
                font-weight: 700;
                font-size: 13px;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 15px;
            }

            .add-to-cart-button:hover {
                background-color: #f28e00;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(242, 142, 0, 0.3);
            }

            @media (max-width: 1200px) {
                .carousel-main-wrapper {
                    margin: 15px auto;
                    max-width: calc(100vw - 30px);
                    gap: 12px;
                }
                
                .carousel-button {
                    width: 32px;
                    height: 32px;
                    font-size: 16px;
                }
                
                .carousel-scrollable {
                    gap: 10px;
                    width: calc(3 * 200px + 2 * 10px);
                }
                
                .product-card {
                    width: 200px;
                    height: 430px;
                }
            }

            @media (max-width: 768px) {
                .carousel-main-wrapper {
                    margin: 15px auto;
                    gap: 10px;
                }
                
                .banner-title {
                    font-size: 20px;
                    padding: 18px 25px;
                    text-align: center;
                }
                
                .carousel-container {
                    padding: 20px 15px 25px 15px;
                }
                
                .carousel-scrollable {
                    padding: 12px 0 20px 0;
                    gap: 8px;
                    width: calc(2 * 180px + 1 * 8px);
                }
                
                .carousel-button {
                    width: 30px;
                    height: 30px;
                    font-size: 16px;
                }
                
                .product-card {
                    width: 180px;
                    height: 400px;
                    margin: 6px 0;
                }
                
                .product-image {
                    height: 140px;
                }
                
                .badge {
                    width: 45px;
                    height: 45px;
                }
                
                .current-price {
                    font-size: 16px;
                }
                
                .add-to-cart-button {
                    padding: 10px;
                    font-size: 12px;
                }
            }

            @media (max-width: 480px) {
                .carousel-main-wrapper {
                    margin: 10px auto;
                    gap: 8px;
                }
                
                .banner-title {
                    font-size: 18px;
                    padding: 15px 18px;
                }
                
                .carousel-container {
                    padding: 15px 12px 20px 12px;
                }
                
                .carousel-scrollable {
                    padding: 8px 0 15px 0;
                    gap: 6px;
                    width: calc(2 * 160px + 1 * 6px);
                }
                
                .carousel-button {
                    width: 28px;
                    height: 28px;
                    font-size: 14px;
                }
                
                .product-card {
                    width: 160px;
                    height: 370px;
                    margin: 4px 0;
                }
                
                .product-image {
                    height: 120px;
                }
                
                .badge {
                    width: 40px;
                    height: 40px;
                }
                
                .favorite-button {
                    width: 32px;
                    height: 32px;
                }
                
                .favorite-button svg {
                    width: 18px;
                    height: 18px;
                }
                
                .current-price {
                    font-size: 15px;
                }
                
                .add-to-cart-button {
                    font-size: 11px;
                    padding: 8px;
                }
            }
        `;
        document.head.appendChild(style);
    };

    const setEvents = (products) => {
        const scrollable = document.querySelector('.carousel-scrollable');
        const prevButton = document.querySelector('.carousel-button.prev');
        const nextButton = document.querySelector('.carousel-button.next');

        const getScrollAmount = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth <= 480) return 166;
            if (screenWidth <= 768) return 188;
            if (screenWidth <= 1200) return 210;
            return 232;
        };

        if (prevButton && nextButton && scrollable) {
            prevButton.addEventListener('click', () => {
                scrollable.scrollBy({
                    left: -getScrollAmount(),
                    behavior: 'smooth'
                });
            });

            nextButton.addEventListener('click', () => {
                scrollable.scrollBy({
                    left: getScrollAmount(),
                    behavior: 'smooth'
                });
            });

            const updateButtonVisibility = () => {
                const { scrollLeft, scrollWidth, offsetWidth } = scrollable;
                prevButton.style.opacity = scrollLeft > 0 ? '1' : '0.3';
                nextButton.style.opacity = scrollLeft + offsetWidth < scrollWidth ? '1' : '0.3';
                prevButton.style.pointerEvents = scrollLeft > 0 ? 'auto' : 'none';
                nextButton.style.pointerEvents = scrollLeft + offsetWidth < scrollWidth ? 'auto' : 'none';
            };

            scrollable.addEventListener('scroll', updateButtonVisibility);
            window.addEventListener('resize', updateButtonVisibility);
            updateButtonVisibility();
        }

        document.querySelectorAll('.product-card').forEach(card => {
            const productId = parseInt(card.dataset.productId);
            const heartIcon = card.querySelector('.favorite-button');
            
            heartIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                const favorites = getFavorites();
                const index = favorites.indexOf(productId);
                
                if (index > -1) {
                    favorites.splice(index, 1);
                    heartIcon.classList.remove('filled');
                } else {
                    favorites.push(productId);
                    heartIcon.classList.add('filled');
                }
                
                saveFavorites(favorites);
            });

            card.addEventListener('click', () => {
                const product = products.find(p => p.id === productId);
                if (product && product.url) {
                    window.open(product.url, '_blank');
                }
            });
        });
    };

    init();
})(); 