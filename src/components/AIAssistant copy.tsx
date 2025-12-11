"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User, RefreshCw } from 'lucide-react';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SiteContent {
  url: string;
  title: string;
  content: string;
  lastIndexed: Date;
}

// Configuration
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant virtuel de MatrixConnect, leader camerounais des télécommunications depuis 1997. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isIndexing, setIsIndexing] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus sur l'input quand le chat s'ouvre
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Indexation automatique au chargement (avec état React au lieu de localStorage)
  useEffect(() => {
    const initializeContent = async () => {
      const cachedData = sessionStorage.getItem('matrixconnect_cache');
      const lastIndexed = sessionStorage.getItem('matrixconnect_indexed_at');
      
      const shouldReindex = !lastIndexed || 
        (Date.now() - parseInt(lastIndexed)) > 24 * 60 * 60 * 1000;
      
      if (cachedData && !shouldReindex) {
        setSiteContent(JSON.parse(cachedData));
      } else {
        await indexSite();
      }
    };
    
    initializeContent();
  }, []);

  // Fonction pour extraire le contenu avec meilleure structure
  const extractPageContent = async (url: string): Promise<SiteContent | null> => {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'MatrixConnectBot/1.0 (+https://matrixconnect.cm)'
        }
      });
      const html = await response.text();
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Supprimer les éléments non pertinents
      doc.querySelectorAll('script, style, nav, header, footer, button, iframe, img, svg, .cookie-banner, .navigation, .menu, noscript').forEach(el => el.remove());
      
      const title = doc.querySelector('title')?.textContent || 
                    doc.querySelector('h1')?.textContent || 
                    url;
      
      // Extraire le contenu principal avec structure
      const mainContent = doc.querySelector('main') || doc.querySelector('.content') || doc.querySelector('article') || doc.querySelector('body');
      
      const textNodes: string[] = [];
      
      // Prioriser les éléments structurés
      mainContent?.querySelectorAll('h1, h2, h3, h4, p, li, td, th').forEach(el => {
        const text = el.textContent?.trim();
        if (text && text.length > 30 && !text.match(/(Obtenir un Devis|En savoir plus|Cliquez ici)/i)) {
          // Ajouter contexte pour les titres
          if (el.tagName.match(/H[1-4]/)) {
            textNodes.push(`\n### ${text}\n`);
          } else {
            textNodes.push(text);
          }
        }
      });
      
      const cleanContent = textNodes
        .join('\n')
        .replace(/\s+/g, ' ')
        .replace(/\n\s+/g, '\n')
        .trim();
      
      if (cleanContent.length < 100) return null;
      
      return {
        url,
        title: title.trim(),
        content: cleanContent.substring(0, 5000), // Augmenté pour plus de contexte
        lastIndexed: new Date()
      };
    } catch (error) {
      console.error(`Erreur indexation ${url}:`, error);
      return null;
    }
  };

  // Indexation du site (pages étendues)
  const indexSite = async () => {
    setIsIndexing(true);
    const indexed: SiteContent[] = [];
    
    const baseUrl = window.location.origin;
    const pagesToIndex = [
      '/',
      '/about',
      '/services',
      '/solutions',
      '/connectivity',
      '/fibre',
      '/sd-wan',
      '/sdwan',
      '/security',
      '/securite',
      '/mssp',
      '/mpls',
      '/vpn',
      '/interconnexion',
      '/contact',
      '/infrastructure',
      '/telephonie',
      '/videoconference'
    ];
    
    for (const page of pagesToIndex) {
      const url = `${baseUrl}${page}`;
      const content = await extractPageContent(url);
      
      if (content && content.content.length > 100) {
        indexed.push(content);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setSiteContent(indexed);
    sessionStorage.setItem('matrixconnect_cache', JSON.stringify(indexed));
    sessionStorage.setItem('matrixconnect_indexed_at', Date.now().toString());
    
    setIsIndexing(false);
    console.log(`✅ ${indexed.length} pages indexées avec succès`);
  };

  // Recherche de similarité simple (simulation RAG côté client)
  const findRelevantContent = (query: string, topK: number = 3): string => {
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 3);
    
    const scored = siteContent.map(page => {
      let score = 0;
      const contentLower = page.content.toLowerCase();
      
      keywords.forEach(keyword => {
        const matches = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
        score += matches * 2;
      });
      
      if (contentLower.includes(queryLower)) {
        score += 10;
      }
      
      return { page, score };
    });
    
    const topPages = scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    
    if (topPages.length === 0) {
      return siteContent.slice(0, 2).map(p => p.content).join('\n\n---\n\n');
    }
    
    return topPages.map(item => 
      `PAGE: ${item.page.title}\n${item.page.content}`
    ).join('\n\n---\n\n');
  };

  // Prompt optimisé inspiré du backend Flask
  const getEnrichedPrompt = (userMessage: string): string => {
    const relevantContext = findRelevantContent(userMessage);

    return `Tu es un assistant virtuel pour MatrixConnect, une entreprise de télécommunications B2B au Cameroun. Ton rôle est d'aider les visiteurs à découvrir nos services et répondre à leurs questions.

**RÈGLES DE RÉPONSE :**
1. Utilise un ton professionnel et direct
2. Évite les formules de politesse excessives ("Bonjour", "Merci", "N'hésitez pas")
3. Fournis des réponses précises basées sur le contexte du site
4. Pour les détails techniques complexes, redirige vers : +237 242 13 95 45 ou info@matrixconnect.cm
5. Réponds en français, de manière claire et concise (3-5 phrases maximum)
6. Termine par un appel à l'action pertinent

**INFORMATIONS CLÉS MATRIXCONNECT :**
- Fondation : 1997, filiale du Groupe ICCNET (créé en 1995)
- Expérience : 28 ans d'expertise télécom B2B
- Mission : "Connecting People. Inspiring Solutions"
- Infrastructure : Jusqu'à 80 Gbps, haute disponibilité
- Services : Connectivité haut débit, SD-WAN, Sécurité MSSP, MPLS, VPN, Téléphonie IP

**COORDONNÉES :**
📍 Yaoundé : 4124 Yaoundé | ☎️ +237 242 13 95 45
📍 Douala : 24122 Douala | ☎️ +237 233 43 88 18
📧 info@matrixconnect.cm

**CONTEXTE EXTRAIT DU SITE :**
${relevantContext}

**QUESTION DU VISITEUR :**
${userMessage}

Réponds maintenant de manière naturelle, professionnelle et orientée action.`;
  };

  // Appel à l'API Gemini
  const sendToGemini = async (userMessage: string): Promise<string> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      
      if (!apiKey || apiKey === 'DEMO_KEY') {
        console.warn('⚠️ Mode démo - Configurez NEXT_PUBLIC_GEMINI_API_KEY');
        return getFallbackResponse(userMessage);
      }

      const response = await fetch(`${GEMINI_API_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: getEnrichedPrompt(userMessage)
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 800,
          }
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('⚠️ Quota Gemini dépassé');
          return getFallbackResponse(userMessage);
        }
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Erreur Gemini:', error);
      return getFallbackResponse(userMessage);
    }
  };

  // Réponses de secours améliorées (style direct, sans formules)
  const getFallbackResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.match(/sécurité|mssp|cyberattaque|firewall|protection/)) {
      return 'Notre service MSSP offre une protection 24/7 avec un SOC dédié. Nous déployons des firewalls nouvelle génération, détectons les intrusions en temps réel et bloquons les attaques DDoS. Avec 28 ans d\'expertise, nous sécurisons les infrastructures des entreprises camerounaises. Contactez-nous pour un audit gratuit : +237 242 13 95 45.';
    }
    
    if (msg.match(/sd-wan|sdwan|wan/)) {
      return 'Le SD-WAN centralise et optimise vos liaisons WAN (Fibre, 4G, MPLS). Vous gagnez jusqu\'à 40% sur les coûts, améliorez les performances et sécurisez le trafic. Idéal pour interconnecter plusieurs sites avec une gestion cloud centralisée. Demandez une démonstration : info@matrixconnect.cm.';
    }

    if (msg.match(/mpls|interconnexion|multi-sites|vpn/)) {
      return 'Notre réseau MPLS IP/VPN interconnecte vos sites sur un réseau privé sécurisé avec QoS garantie. Infrastructure 80 Gbps pour des performances optimales, au Cameroun et à l\'international. Combien de sites connecter ? Appelez +237 242 13 95 45.';
    }
    
    if (msg.match(/fibre|connectivité|internet|connexion|bande passante/)) {
      return 'Fibre optique dédiée jusqu\'à 80 Gbps, symétrique et ultra-fiable. Pour les zones non fibrées : Faisceau Hertzien et VSAT disponibles. Solutions de backup 4G/5G automatiques pour garantir la continuité. Quelle bande passante recherchez-vous ? Contact : +237 233 43 88 18.';
    }

    if (msg.match(/prix|tarif|coût|devis|budget/)) {
      return 'Nos tarifs sont personnalisés selon vos besoins. Nous commençons par un audit technique gratuit, puis proposons une solution sur mesure avec ROI détaillé. 28 ans d\'expérience pour optimiser votre investissement. Obtenez votre devis : +237 242 13 95 45 (Yaoundé) ou +237 233 43 88 18 (Douala).';
    }

    if (msg.match(/contact|joindre|appeler|rendez-vous|téléphone/)) {
      return 'Coordonnées MatrixConnect :\n📍 Yaoundé : +237 242 13 95 45\n📍 Douala : +237 233 43 88 18\n📧 info@matrixconnect.cm\nRappel sous 24h garanti. Infrastructure 80 Gbps à votre service depuis 1997. Préférez-vous un rendez-vous en agence ou par téléphone ?';
    }

    if (msg.match(/téléphonie|voip|ip|communication|pbx/)) {
      return 'Solutions de téléphonie IP complètes : IPBX virtuels ou physiques, numéros SDA, appels illimités intra-réseau, mobilité totale. Réduisez vos coûts de communication jusqu\'à 60%. Demandez une démo : +237 242 13 95 45.';
    }

    return 'MatrixConnect, leader télécom B2B au Cameroun depuis 1997. Infrastructure 80 Gbps pour : Connectivité très haut débit, SD-WAN intelligent, Sécurité MSSP 24/7, Interconnexion multi-sites. Filiale du Groupe ICCNET. Comment puis-je vous aider concrètement ? 📞 +237 242 13 95 45';
  };

  // Envoi du message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendToGemini(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Erreur technique survenue. Notre équipe est disponible immédiatement au +237 242 13 95 45.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Ouvrir l'assistant IA"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            AI
          </span>
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-green-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Besoin d'aide ? 💬
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Assistant MatrixConnect</h3>
                <p className="text-xs text-green-100">
                  {isIndexing ? 'Indexation...' : siteContent.length > 0 ? `${siteContent.length} pages • RAG actif` : 'En ligne'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={indexSite}
                disabled={isIndexing}
                className="hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-50"
                title="Réindexer le site"
              >
                <RefreshCw className={`w-4 h-4 ${isIndexing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50/30 to-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' ? 'bg-green-600' : 'bg-gradient-to-br from-green-500 to-green-600'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl p-3 ${
                    message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-800 border border-green-200 shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className={`text-xs mt-1 block ${
                    message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl p-3 border border-green-200 shadow-sm">
                  <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-green-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Propulsé par Gemini AI + RAG • MatrixConnect © 2025
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;