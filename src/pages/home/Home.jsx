import React, {useState} from 'react';
import './Home.scss'

const Home = () => {
    const products = [
        {
            id: 1,
            name: "YouTube Premium",
            category: "streaming",
            price: 15,
            image: "../../../public/products/youtube-premium.png",
            description: "Xem video không quảng cáo, nghe nhạc background.",
        },
        {
            id: 2,
            name: "CapCut Pro",
            category: "creative",
            price: 10,
            image: "../../../public/products/capcut-pro.png",
            description: "Mở khóa toàn bộ hiệu ứng và tính năng cao cấp.",
        },
        {
            id: 3,
            name: "Google One 100GB",
            category: "cloud",
            price: 5,
            image: "../../../public/products/google-one.png",
            description: "Mở rộng không gian lưu trữ cho Drive và Photos.",
        }
    ];

    const [selectProduct, setSelectProduct] = useState(null);
    const handleQuickView = (product) => {
        setSelectProduct(product);
    };

    return (
        <div id="home">
            {/* HERO */}
            <section className="hero" id="hero">
                <div className="hero-content">
                    <span className="hero-tag" data-i18n="hero.tag">Digital Services 2026</span>
                    <h1 data-i18n="hero.title">Premium Subs,<br /><em>Instant Access</em></h1>
                    <p className="hero-desc" data-i18n="hero.desc">Get the best digital subscriptions at unbeatable prices. YouTube Premium, CapCut Pro,
                        Duolingo, Google One — activated within minutes.</p>
                    <a href="#products" className="btn-primary">
                        <span data-i18n="hero.cta">Browse Services</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </a>
                </div>
                <div className="scroll-indicator">
                    <span data-i18n="hero.scroll">Scroll</span>
                    <div className="scroll-line"></div>
                </div>
            </section>

            {/* List Products */}
            <section className="products-section" id="products">
                <div className="section-header">
                    <h2 className="section-title" data-i18n="products.title">Our Services</h2>
                    <div className="category-filters" role="tablist" aria-label="Filter services by category">
                        <button className="filter-btn active" data-category="all" role="tab" aria-selected="true" data-i18n="nav.all">All</button>
                        <button className="filter-btn" data-category="streaming" role="tab" aria-selected="false" data-i18n="nav.streaming">Streaming</button>
                        <button className="filter-btn" data-category="creative" role="tab" aria-selected="false" data-i18n="nav.creative">Creative</button>
                        <button className="filter-btn" data-category="learning" role="tab" aria-selected="false" data-i18n="nav.learning">Learning</button>
                        <button className="filter-btn" data-category="cloud" role="tab" aria-selected="false" data-i18n="nav.cloud">Cloud</button>
                    </div>
                </div>
                <div className="product-grid" id="product-grid" role="tabpanel">
                    {
                        products.map((item) => (
                            <div className="product-cart visible">
                                <div className="product-image" onClick={() => handleQuickView(item)}>
                                    <img src={item.image} alt={item.name}/>
                                    <span className="product-variant-badge">3 select</span>
                                    <div className="product-actions">
                                        <button className="btn-add-cart">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path></svg>
                                            Thêm vào giỏ
                                        </button>

                                        <button className="btn-quick-view">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="product-info">
                                    <span className="product-category">{item.category}</span>
                                    <h3 className="product-name">{item.name}</h3>
                                    <span className="product-stock-badge in-stock">45 con lai</span>
                                    <span className="product-price">{item.price}</span>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </section>

            {/* Quick View */}
            <div className={`modal-overlay ${selectProduct ? "open" : ""}`} id="modal-overlay"
                onClick={() => setSelectProduct(null)}
            >
                <div className="product-modal" onClick={(e) => e.stopPropagation()} id="product-modal">
                    {
                        selectProduct && (
                            <div className="product-modal" id="product-modal">
                                <button className="modal-close" id="modal-close-btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                                <div className="modal-image">
                                    <img src={selectProduct.image} alt="Google One 100GB"/>
                                </div>
                                <div className="modal-content">
                                    <span className="modal-category">{selectProduct.category}</span>
                                    <h2 className="modal-name">{selectProduct.name}</h2>
                                    <p className="modal-desc">{selectProduct.description}</p>

                                    <div className="modal-variants">
                                        <h4>Thời hạn sử dụng</h4>
                                        <div className="modal-variants-list">
                                            <button className="modal-variant-btn active " data-id="8">
                                                <span className="variant-name">1 Month</span>
                                                <span className="variant-price">50.000&nbsp;₫</span>
                                                <span className="variant-stock-badge">18 còn lại</span>
                                            </button>
                                            <button className="modal-variant-btn  " data-id="9">
                                                <span className="variant-name">3 Months</span>
                                                <span className="variant-price">130.000&nbsp;₫</span>
                                                <span className="variant-stock-badge">5 còn lại</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="modal-meta">
                                        <h4>Thông Tin Dịch Vụ</h4>
                                        <div className="meta-grid">
                                            <div className="meta-item">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                                                </svg>
                                                <div><strong>Giao hàng</strong><span>1-24h</span></div>
                                            </div>
                                            <div className="meta-item">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                                    <polyline points="12 5 19 12 12 19"></polyline>
                                                </svg>
                                                <div><strong>Kích hoạt</strong><span>Account linked</span></div>
                                            </div>
                                            <div className="meta-item">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                     stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                                <div><strong>Thời hạn</strong><span>1 Month</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-price-row">
                                        <span className="modal-price" id="modal-price">50.000&nbsp;₫</span>
                                        <button className="btn-primary modal-add-cart" id="modal-add-btn" data-id="8">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="9" cy="21" r="1"></circle>
                                                <circle cx="20" cy="21" r="1"></circle>
                                                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"></path>
                                            </svg>
                                            Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

            <div className="toast" id="toast"></div>
        </div>
    );
};

export default Home;