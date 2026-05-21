// navbar.js - Version Finale Corrigée
(function() {
    if (document.getElementById('clv-navbar-injected')) return;

    // Chargement automatique de FontAwesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fa = document.createElement('link');
        fa.rel = 'stylesheet';
        fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
        document.head.appendChild(fa);
    }

    // Configuration des tailles
    const CFG = {
        d: { h: '70px', w: '200px', x: '0px', y: '0px' },
        m: { h: '60px', w: '150px', x: '0px', y: '0px' }
    };

    const navbarHTML = `
        <nav class="clv-navbar" id="clv-navbar-injected">
            <div class="clv-container">
                <a class="clv-logo-link" href="rmbase.html">
                    <img src="images/clever.png" class="clv-logo-img" alt="Logo" onerror="this.src='https://placehold.co/300x90/1A6BFF/white?text=Clever'">
                </a>
                
                <ul class="clv-nav-links">
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="apropos.html">À Propos</a></li>
                    <li class="clv-dropdown">
                        <button class="clv-drop-btn">
                            Fonctionnalités <i class="fas fa-chevron-down clv-drop-arrow"></i>
                        </button>
                        <div class="clv-drop-menu">
                            <a href="aiagent.html">
                                <i class="fas fa-robot"></i>
                                <span>AI Agent</span>
                            </a>
                            <a href="analysededonnée.html">
                                <i class="fas fa-chart-pie"></i>
                                <span>Analyse de données</span>
                            </a>
                            <a href="strategie.html">
                                <i class="fas fa-bullseye"></i>
                                <span> Stratégie</span>
                            </a>

                           </a>
                            <a href="ads.html">
                                <i class="fas fa-chart-pie"></i>
                                <span> marketing</span>
                            </a>  
                        </div>
                    </li>
                    <li><a href="tarifs.html">Tarifs</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>

                <div class="clv-nav-right">
                    <button class="clv-btn-main clv-desktop-only">Essayer Gratuitement</button>
                    <button class="clv-hamburger" id="clv-hamburgerBtn">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
        </nav>

        <div class="clv-mobile-menu" id="clv-mobileMenu">
            <div class="clv-mobile-inner">
                <ul class="clv-mobile-links">
                    <li><a href="index.html">Accueil</a></li>
                    <li><a href="apropos.html">À Propos</a></li>
                    <li class="clv-mobile-accordion">
                        <button class="clv-accordion-trigger" id="clv-feat-btn">
                            Fonctionnalités <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="clv-accordion-content">
                            <a href="aiagent.html"><i class="fas fa-robot"></i> AI Agent</a>
                            <a href="analysededonnée.html"><i class="fas fa-chart-pie"></i> Analyse de données</a>
                            <a href="strategie.html"><i class="fas fa-bullseye"></i>  Stratégie</a>
                           <a href="ads.html"><i class="fas fa-bullseye"></i> Marketing </a> 
                        </div>
                    </li>
                    <li><a href="tarifs.html">Tarifs</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li class="clv-mobile-cta">
                        <button class="clv-btn-main" style="width: 100%;">Essayer Gratuitement</button>
                    </li>
                </ul>
            </div>
        </div>
    `;

    const placeholder = document.getElementById('navbar-placeholder');
    if (placeholder) {
        placeholder.innerHTML = navbarHTML;
        placeholder.style.cssText = "margin:0 !important; padding:0 !important; display:block !important;";
    }

    const style = document.createElement('style');
    style.textContent = `

        /* ===== NAVBAR PRINCIPALE ===== */
        .clv-navbar {
            box-sizing: border-box !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: ${CFG.d.h} !important;
            background: #0A0A0A !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
            z-index: 2000000 !important;
            display: flex !important;
            align-items: center !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: 'DM Sans', 'Poppins', sans-serif !important;
        }

        body {
            padding-top: ${CFG.d.h} !important;
            margin: 0 !important;
        }

        /* ===== CONTAINER ===== */
        .clv-container {
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 1400px !important;
            margin: 0 auto !important;
            padding: 0 5% !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }

        /* ===== LOGO ===== */
        .clv-logo-link {
            display: flex !important;
            align-items: center !important;
            text-decoration: none !important;
        }

        .clv-logo-img {
            width: 155px !important;
            height: 100px !important;
            transform: translate(${CFG.d.x}, ${CFG.d.y}) !important;
            display: block !important;
            object-fit: contain !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* ===== LIENS DESKTOP ===== */
        .clv-nav-links {
            display: flex !important;
            gap: 40px !important;
            align-items: center !important;
            list-style: none !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .clv-nav-links > li {
            list-style: none !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .clv-nav-links > li > a {
            color: #e0e0e0 !important;
            font-size: 15px !important;
            font-weight: 500 !important;
            text-decoration: none !important;
            transition: color 0.2s ease !important;
            font-family: 'DM Sans', 'Poppins', sans-serif !important;
        }

        .clv-nav-links > li > a:hover {
            color: #1A6BFF !important;
        }

        /* ===== DROPDOWN DESKTOP ===== */
        .clv-dropdown {
            position: relative !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .clv-drop-btn {
            background: none !important;
            border: none !important;
            color: #e0e0e0 !important;
            font-size: 15px !important;
            font-weight: 500 !important;
            font-family: 'DM Sans', 'Poppins', sans-serif !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            transition: color 0.2s ease !important;
            padding: 8px 0 !important;
            margin: 0 !important;
        }

        .clv-drop-btn:hover {
            color: #1A6BFF !important;
        }

        /* Flèche Fonctionnalités */
        .clv-drop-arrow {
            font-size: 12px !important;
            display: inline-block !important;
            line-height: 1 !important;
            transition: transform 0.25s ease !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .clv-dropdown:hover .clv-drop-arrow {
            transform: rotate(180deg) !important;
        }

        /* Menu déroulant */
        .clv-drop-menu {
            position: absolute !important;
            top: calc(100% + 10px) !important;
            left: 0 !important;
            background: #141414 !important;
            min-width: 270px !important;
            border-radius: 14px !important;
            padding: 10px 0 !important;
            margin: 0 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            transition: all 0.25s ease !important;
            box-shadow: 0 20px 40px rgba(0,0,0,0.6) !important;
            border: 1px solid rgba(255,255,255,0.08) !important;
            z-index: 9999 !important;
        }

        .clv-dropdown:hover .clv-drop-menu {
            opacity: 1 !important;
            visibility: visible !important;
            top: calc(100% + 5px) !important;
        }

        /* Items du sous-menu */
        .clv-drop-menu a {
            display: flex !important;
            align-items: center !important;
            gap: 14px !important;
            padding: 12px 20px !important;
            margin: 0 !important;
            color: #e0e0e0 !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            font-family: 'DM Sans', 'Poppins', sans-serif !important;
            text-decoration: none !important;
            transition: all 0.2s ease !important;
        }

        .clv-drop-menu a:hover {
            background: rgba(26, 107, 255, 0.12) !important;
            color: #1A6BFF !important;
            padding-left: 24px !important;
        }

        .clv-drop-menu a i {
            color: #1A6BFF !important;
            width: 22px !important;
            text-align: center !important;
            font-size: 16px !important;
            flex-shrink: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            display: inline-block !important;
        }

        .clv-drop-menu a span {
            color: inherit !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* ===== NAV RIGHT ===== */
        .clv-nav-right {
            display: flex !important;
            align-items: center !important;
            gap: 16px !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* ===== BOUTON PRINCIPAL ===== */
        .clv-btn-main {
            background: #1A6BFF !important;
            color: white !important;
            padding: 10px 24px !important;
            border-radius: 8px !important;
            font-weight: 600 !important;
            font-size: 14px !important;
            font-family: 'DM Sans', 'Poppins', sans-serif !important;
            border: none !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            margin: 0 !important;
        }

        .clv-btn-main:hover {
            background: #0d4fd1 !important;
            transform: translateY(-2px) !important;
        }

        /* ===== HAMBURGER ===== */
        .clv-hamburger {
            display: none !important;
            flex-direction: column !important;
            justify-content: center !important;
            gap: 5px !important;
            background: none !important;
            border: none !important;
            cursor: pointer !important;
            width: 28px !important;
            height: 24px !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* Les 3 barres du hamburger - ciblées précisément */
        .clv-hamburger span {
            display: block !important;
            width: 28px !important;
            height: 2px !important;
            background: white !important;
            border-radius: 2px !important;
            transition: transform 0.3s ease, opacity 0.3s ease !important;
            margin: 0 !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
        }

        /* Menu mobile caché sur desktop */
        .clv-mobile-menu {
            display: none !important;
        }

        /* ========== MOBILE ========== */
        @media (max-width: 992px) {
            body {
                padding-top: ${CFG.m.h} !important;
            }

            .clv-navbar {
                height: ${CFG.m.h} !important;
            }

            .clv-logo-img {
                width: 170PX !important;
                transform: translate -450px, ${CFG.m.y}) !important;
            }

            .clv-nav-links,
            .clv-desktop-only {
                display: none !important;
            }

            .clv-hamburger {
                display: flex !important;
            }

            .clv-hamburger.open span:nth-child(1) {
                transform: translateY(7px) rotate(45deg) !important;
            }

            .clv-hamburger.open span:nth-child(2) {
                opacity: 0 !important;
            }

            .clv-hamburger.open span:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg) !important;
            }

            /* Menu mobile visible sur mobile */
            .clv-mobile-menu {
                display: block !important;
                position: fixed !important;
                top: -100% !important;
                left: 0 !important;
                width: 100% !important;
                height: 100vh !important;
                background: #0A0A0A !important;
                z-index: 1999999 !important;
                transition: top 0.4s ease-in-out !important;
                overflow-y: auto !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            .clv-mobile-menu.open {
                top: 0 !important;
            }

            .clv-mobile-inner {
                padding: 100px 8% 50px !important;
                min-height: 100vh !important;
                display: flex !important;
                flex-direction: column !important;
                box-sizing: border-box !important;
            }

            .clv-mobile-links {
                width: 100% !important;
                list-style: none !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            .clv-mobile-links li {
                list-style: none !important;
                border-bottom: 1px solid rgba(255,255,255,0.06) !important;
                margin: 0 !important;
                padding: 0 !important;
            }

            .clv-mobile-links a {
                display: block !important;
                color: white !important;
                font-size: 20px !important;
                font-weight: 500 !important;
                font-family: 'DM Sans', 'Poppins', sans-serif !important;
                text-decoration: none !important;
                padding: 18px 0 !important;
                margin: 0 !important;
                transition: color 0.2s ease !important;
            }

            .clv-mobile-links a:hover {
                color: #1A6BFF !important;
            }

            .clv-accordion-trigger {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                width: 100% !important;
                background: none !important;
                border: none !important;
                color: white !important;
                font-size: 20px !important;
                font-weight: 500 !important;
                font-family: 'DM Sans', 'Poppins', sans-serif !important;
                padding: 18px 0 !important;
                margin: 0 !important;
                cursor: pointer !important;
            }

            .clv-accordion-trigger i {
                font-size: 14px !important;
                transition: transform 0.3s ease !important;
                margin: 0 !important;
                padding: 0 !important;
                display: inline-block !important;
            }

            .clv-mobile-accordion.active .clv-accordion-trigger i {
                transform: rotate(180deg) !important;
            }

            .clv-accordion-content {
                display: none !important;
                padding: 0 0 10px 15px !important;
                margin: 0 !important;
            }

            .clv-mobile-accordion.active .clv-accordion-content {
                display: block !important;
            }

            .clv-accordion-content a {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                font-size: 16px !important;
                font-family: 'DM Sans', 'Poppins', sans-serif !important;
                color: #aaa !important;
                padding: 12px 0 !important;
                margin: 0 !important;
                border-bottom: none !important;
                text-decoration: none !important;
            }

            .clv-accordion-content a i {
                color: #1A6BFF !important;
                width: 22px !important;
                font-size: 14px !important;
                margin: 0 !important;
                padding: 0 !important;
                display: inline-block !important;
            }

            .clv-accordion-content a:hover {
                color: #1A6BFF !important;
            }

            .clv-mobile-cta {
                border-bottom: none !important;
                margin-top: 30px !important;
                padding: 0 !important;
            }

            .clv-mobile-cta button {
                width: 100% !important;
                padding: 16px !important;
                font-size: 16px !important;
                box-sizing: border-box !important;
            }
        }
    `;
    document.head.appendChild(style);

    // JAVASCRIPT : Gestion du menu mobile
    function init() {
        const hb = document.getElementById('clv-hamburgerBtn');
        const mm = document.getElementById('clv-mobileMenu');
        const accBtn = document.getElementById('clv-feat-btn');

        if (hb && mm) {
            hb.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('open');
                mm.classList.toggle('open');
                document.body.style.overflow = mm.classList.contains('open') ? 'hidden' : '';
            });
        }

        // Fermeture du menu au clic sur un lien
        const allMobileLinks = document.querySelectorAll('.clv-mobile-links a');
        allMobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mm && mm.classList.contains('open')) {
                    if (hb) hb.classList.remove('open');
                    mm.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        });

        if (accBtn) {
            accBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const parent = this.closest('.clv-mobile-accordion');
                if (parent) {
                    parent.classList.toggle('active');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();