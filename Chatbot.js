// ============================================================
// CLEVER CHAT - Assistant Revenue Management
// TTS : Web Speech API (natif, 0 clé, fonctionne partout)
//       + Kokoro WASM optionnel (modèle IA dans le navigateur)
// ============================================================

(function () {

    // ==================== BASE DE CONNAISSANCE ====================
    const knowledgeBase = [
        { keywords: ["bonjour", "salut", "hello", "coucou"], response: "Bonjour ! Je suis Clever, votre assistant IA pour le Revenue Management. Comment puis-je vous aider ?" },
        { keywords: ["bénéfice", "net", "gain", "combien"], response: "Clever calcule votre bénéfice net réel en soustrayant les coûts matière, les charges fixes et les commissions." },
        { keywords: ["marge", "rentabilité"], response: "Je surveille la marge de chaque produit. Si une marge descend sous 40%, je vous alerte immédiatement." },
        { keywords: ["analyse prédictive", "prévision", "affluence"], response: "Clever analyse vos historiques de vente pour prévoir l'affluence jusqu'à 14 jours à l'avance avec une précision de 94%." },
        { keywords: ["roi", "ads", "publicité", "campagne"], response: "Le retour sur investissement moyen des campagnes Ads avec Clever est de x3.8." },
        { keywords: ["alerte", "problème", "coût"], response: "Je surveille vos coûts en temps réel. Dès qu'un seuil critique est atteint, je vous alerte." },
        { keywords: ["processus", "étapes", "méthodologie"], response: "Notre processus en 4 étapes : 1) Discovery, 2) Development, 3) Implementation, 4) Monitoring." }
    ];

    // ==================== WEB SPEECH API ====================
    // Solution 100% native, zéro API externe, fonctionne dans Chrome/Edge/Safari/Firefox
    // Chrome & Edge ont des voix HD "Google français" et "Microsoft" très naturelles

    let isVoiceEnabled = true;
    let voicesLoaded = false;
    let frenchVoice = null;

    function loadVoices() {
        return new Promise((resolve) => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                frenchVoice = pickBestFrenchVoice(voices);
                voicesLoaded = true;
                resolve();
                return;
            }
            // Les voix chargent de façon asynchrone
            window.speechSynthesis.onvoiceschanged = () => {
                const v = window.speechSynthesis.getVoices();
                frenchVoice = pickBestFrenchVoice(v);
                voicesLoaded = true;
                resolve();
            };
        });
    }

    function pickBestFrenchVoice(voices) {
        // Ordre de priorité : voix premium d'abord
        const priority = [
            'Google français',          // Chrome — meilleure qualité
            'Google French',
            'Microsoft Denise',         // Edge — très naturelle
            'Microsoft Julie',
            'Microsoft Paul',
            'Amélie',                   // macOS/Safari
            'Thomas',
            'Marie',
        ];

        for (const name of priority) {
            const found = voices.find(v => v.name.includes(name));
            if (found) {
                console.log('🎙️ Voix sélectionnée :', found.name);
                return found;
            }
        }

        // Fallback : n'importe quelle voix française
        const anyFr = voices.find(v => v.lang && v.lang.startsWith('fr'));
        if (anyFr) {
            console.log('🎙️ Voix FR fallback :', anyFr.name);
            return anyFr;
        }

        console.warn('⚠️ Aucune voix française trouvée. Voix disponibles :', voices.map(v => v.name + ' (' + v.lang + ')').join(', '));
        return null;
    }

    function speak(text) {
        if (!isVoiceEnabled || !text?.trim()) return;
        if (!window.speechSynthesis) {
            console.error('speechSynthesis non disponible dans ce navigateur');
            return;
        }

        // Annule toute lecture en cours
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        if (frenchVoice) {
            utterance.voice = frenchVoice;
        }

        utterance.onerror = (e) => {
            console.error('SpeechSynthesis erreur :', e.error);
        };

        utterance.onstart = () => {
            console.log('🔊 Lecture démarrée');
        };

        // Workaround bug Chrome : la synthèse s'arrête après ~15s sur long texte
        // On relance si nécessaire
        const CHROME_BUG_INTERVAL = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
                clearInterval(CHROME_BUG_INTERVAL);
                return;
            }
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
        }, 10000);

        utterance.onend = () => clearInterval(CHROME_BUG_INTERVAL);

        window.speechSynthesis.speak(utterance);
    }

    function stopVoice() {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    }

    function toggleVoice() {
        isVoiceEnabled = !isVoiceEnabled;
        const btn = document.getElementById('cleverVoiceBtn');
        if (btn) {
            btn.innerHTML = isVoiceEnabled ? '🔊' : '🔇';
            btn.title = isVoiceEnabled ? 'Désactiver la voix' : 'Activer la voix';
            btn.style.opacity = isVoiceEnabled ? '1' : '0.5';
        }
        if (!isVoiceEnabled) stopVoice();
    }

    // ==================== LOGIQUE CHAT ====================
    function normalize(str) {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function findResponse(question) {
        const q = normalize(question);
        for (let entry of knowledgeBase) {
            for (let kw of entry.keywords) {
                if (q.includes(normalize(kw))) return entry.response;
            }
        }
        return "Je n'ai pas bien compris. Essayez : bénéfice net, marge, analyse prédictive, ou ROI Ads.";
    }

    // ==================== STYLES ====================
    function injectStyles() {
        const style = document.createElement('style');
        style.id = 'clever-styles';
        style.textContent = `
            #clever-chat-root * { box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
            .clever-fab { position: fixed; bottom: 24px; right: 24px; width: 62px; height: 62px; background: linear-gradient(135deg,#0066FF,#0040CC); border: none; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,102,255,0.45); z-index: 9998; transition: transform .2s, box-shadow .2s; }
            .clever-fab:hover { transform: scale(1.09); box-shadow: 0 6px 28px rgba(0,102,255,0.55); }
            .clever-fab:active { transform: scale(0.96); }
            .clever-window { position: fixed; bottom: 100px; right: 24px; width: 380px; max-width: calc(100vw - 32px); height: 580px; background: #fff; border-radius: 22px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); display: flex; flex-direction: column; z-index: 9999; overflow: hidden; border: 1px solid #E0E7FF; transition: transform .3s cubic-bezier(.4,0,.2,1), opacity .3s; transform: translateY(16px) scale(0.97); opacity: 0; pointer-events: none; }
            .clever-window.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: auto; }
            .clever-header { background: linear-gradient(135deg,#0066FF,#0040CC); padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; }
            .clever-header-info h3 { margin: 0; color: #fff; font-size: 15px; font-weight: 700; }
            .clever-header-info p { margin: 2px 0 0; color: rgba(255,255,255,0.75); font-size: 11px; }
            .clever-header-actions { display: flex; gap: 6px; }
            .clever-hbtn { background: rgba(255,255,255,0.18); border: none; width: 33px; height: 33px; border-radius: 50%; cursor: pointer; color: #fff; font-size: 15px; display: flex; align-items: center; justify-content: center; transition: background .2s, transform .15s; }
            .clever-hbtn:hover { background: rgba(255,255,255,0.32); transform: scale(1.08); }
            .clever-messages { flex: 1; overflow-y: auto; padding: 18px 16px; background: #F5F8FF; display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth; }
            .clever-messages::-webkit-scrollbar { width: 4px; }
            .clever-messages::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
            .clever-msg { max-width: 82%; padding: 10px 14px; border-radius: 18px; font-size: 13.5px; line-height: 1.5; animation: cFade .25s ease; word-break: break-word; }
            .clever-msg.user { background: #0066FF; color: #fff; align-self: flex-end; border-bottom-right-radius: 5px; }
            .clever-msg.bot { background: #fff; color: #1E293B; align-self: flex-start; border-bottom-left-radius: 5px; border: 1px solid #E2E8F0; box-shadow: 0 1px 5px rgba(0,0,0,0.05); }
            .clever-typing-dots { display: flex; gap: 5px; padding: 4px 2px; }
            .clever-typing-dots span { width: 7px; height: 7px; border-radius: 50%; background: #94A3B8; display: inline-block; animation: cBounce 1.1s infinite ease-in-out; }
            .clever-typing-dots span:nth-child(2) { animation-delay: .18s; }
            .clever-typing-dots span:nth-child(3) { animation-delay: .36s; }
            @keyframes cBounce { 0%,80%,100%{transform:translateY(0);background:#94A3B8} 40%{transform:translateY(-7px);background:#0066FF} }
            @keyframes cFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
            .clever-chips { padding: 10px 14px; display: flex; flex-wrap: wrap; gap: 7px; border-top: 1px solid #EEF2FF; background: #fff; }
            .clever-chip { background: #EEF2FF; border: 1px solid #C7D2FE; border-radius: 20px; padding: 5px 12px; font-size: 12px; color: #4338CA; cursor: pointer; transition: all .18s; font-weight: 500; white-space: nowrap; }
            .clever-chip:hover { background: #E0E7FF; transform: scale(1.04); }
            .clever-input-area { display: flex; gap: 8px; padding: 12px 14px; border-top: 1px solid #EEF2FF; background: #fff; }
            .clever-input { flex: 1; border: 1.5px solid #E2E8F0; border-radius: 24px; padding: 10px 16px; font-size: 13.5px; outline: none; transition: border-color .2s; background: #F8FAFF; color: #1E293B; }
            .clever-input:focus { border-color: #0066FF; background: #fff; }
            .clever-send { background: #0066FF; border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background .2s, transform .15s; box-shadow: 0 2px 8px rgba(0,102,255,0.35); }
            .clever-send:hover { background: #0040CC; transform: scale(1.08); }
            .clever-send:active { transform: scale(0.93); }
            .clever-voice-indicator { position: absolute; top: -3px; right: -3px; width: 12px; height: 12px; background: #22C55E; border-radius: 50%; border: 2px solid #0066FF; animation: pulse 2s infinite; }
            @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.6} }
        `;
        document.head.appendChild(style);
    }

    // ==================== DOM ====================
    function injectChat() {
        if (document.getElementById('clever-chat-root')) return;
        injectStyles();

        const root = document.createElement('div');
        root.id = 'clever-chat-root';
        root.innerHTML = `
            <button class="clever-fab" id="cFab" title="Clever Assistant">
                <span style="position:relative">
                    <svg viewBox="0 0 24 24" width="26" height="26" fill="white"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                    <span class="clever-voice-indicator" id="cVoiceIndicator"></span>
                </span>
            </button>
            <div class="clever-window" id="cWindow">
                <div class="clever-header">
                    <div class="clever-header-info">
                        <h3>🤖 Clever Assistant</h3>
                        <p id="cVoiceName">Voix : chargement...</p>
                    </div>
                    <div class="clever-header-actions">
                        <button class="clever-hbtn" id="cVoiceBtn" title="Activer/désactiver la voix">🔊</button>
                        <button class="clever-hbtn" id="cClose" title="Fermer">✕</button>
                    </div>
                </div>
                <div class="clever-messages" id="cMessages">
                    <div class="clever-msg bot">Bonjour ! Je suis <strong>Clever</strong>, votre assistant IA spécialisé en Revenue Management. Comment puis-je vous aider ?</div>
                </div>
                <div class="clever-chips">
                    <button class="clever-chip" data-msg="Quel est mon bénéfice net ?">💰 Bénéfice net</button>
                    <button class="clever-chip" data-msg="Quelle est ma marge ?">📊 Marge</button>
                    <button class="clever-chip" data-msg="Analyse prédictive">📈 Prévisions</button>
                    <button class="clever-chip" data-msg="Quel est votre processus ?">🔄 Processus</button>
                    <button class="clever-chip" data-msg="ROI des campagnes Ads">📢 ROI Ads</button>
                </div>
                <div class="clever-input-area">
                    <input class="clever-input" id="cInput" type="text" placeholder="Posez votre question..." autocomplete="off">
                    <button class="clever-send" id="cSend">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(root);

        const fab        = document.getElementById('cFab');
        const win        = document.getElementById('cWindow');
        const closeBtn   = document.getElementById('cClose');
        const voiceBtn   = document.getElementById('cVoiceBtn');
        const messages   = document.getElementById('cMessages');
        const input      = document.getElementById('cInput');
        const sendBtn    = document.getElementById('cSend');
        const voiceName  = document.getElementById('cVoiceName');
        const voiceInd   = document.getElementById('cVoiceIndicator');

        // Charger les voix et afficher le nom sélectionné
        loadVoices().then(() => {
            if (frenchVoice) {
                voiceName.textContent = '🎙️ ' + frenchVoice.name;
                voiceInd.style.display = 'block';
            } else {
                voiceName.textContent = '⚠️ Aucune voix FR trouvée';
                voiceInd.style.background = '#EF4444';
            }
        });

        function addMsg(text, isUser) {
            const div = document.createElement('div');
            div.className = 'clever-msg ' + (isUser ? 'user' : 'bot');
            div.innerHTML = isUser
                ? text.replace(/</g,'&lt;')
                : text;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
            return div;
        }

        function showTyping() {
            const div = document.createElement('div');
            div.className = 'clever-msg bot';
            div.id = 'cTyping';
            div.innerHTML = '<div class="clever-typing-dots"><span></span><span></span><span></span></div>';
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function hideTyping() {
            const el = document.getElementById('cTyping');
            if (el) el.remove();
        }

        function send(text) {
            text = text.trim();
            if (!text) return;
            input.value = '';
            addMsg(text, true);
            showTyping();
            setTimeout(() => {
                hideTyping();
                const resp = findResponse(text);
                addMsg(resp, false);
                speak(resp);
            }, 450);
        }

        // Events
        fab.addEventListener('click', () => {
            win.classList.add('open');
            input.focus();
        });

        closeBtn.addEventListener('click', () => {
            win.classList.remove('open');
            stopVoice();
        });

        voiceBtn.addEventListener('click', toggleVoice);

        sendBtn.addEventListener('click', () => send(input.value));

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') send(input.value);
        });

        document.querySelectorAll('.clever-chip').forEach(btn => {
            btn.addEventListener('click', () => send(btn.dataset.msg));
        });

        // Message de bienvenue vocal à la première ouverture
        let firstOpen = true;
        fab.addEventListener('click', () => {
            if (!firstOpen) return;
            firstOpen = false;
            setTimeout(() => {
                speak("Bonjour, je suis Clever, votre assistant en Revenue Management. Comment puis-je vous aider ?");
            }, 800);
        });
    }

    // ==================== INIT ====================
    if (!window.speechSynthesis) {
        console.error('Ce navigateur ne supporte pas SpeechSynthesis. Utilisez Chrome, Edge ou Safari.');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChat);
    } else {
        injectChat();
    }

})();

// ============================================================
// OPTIONNEL — Intégration ElevenLabs (clé gratuite = 10k chars/mois)
// Pour activer : remplacer la fonction speak() par celle-ci
// et mettre votre clé ElevenLabs gratuite
// ============================================================
/*
const EL_API_KEY = 'VOTRE_CLE_GRATUITE';
const EL_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Voix FR "Adam" ou choisir sur elevenlabs.io/voices

async function speakElevenLabs(text) {
    try {
        const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${EL_VOICE_ID}`, {
            method: 'POST',
            headers: {
                'xi-api-key': EL_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: { stability: 0.5, similarity_boost: 0.75 }
            })
        });
        const blob = await res.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
    } catch(e) {
        console.warn('ElevenLabs erreur, fallback Web Speech', e);
        fallbackWebSpeech(text);
    }
}
*/