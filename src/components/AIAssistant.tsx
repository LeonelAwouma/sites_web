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
const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

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
      
      doc.querySelectorAll('script, style, nav, header, footer, button, iframe, img, svg, .cookie-banner, .navigation, .menu, noscript').forEach(el => el.remove());
      
      const title = doc.querySelector('title')?.textContent || 
                    doc.querySelector('h1')?.textContent || 
                    url;
      
      const mainContent = doc.querySelector('main') || doc.querySelector('.content') || doc.querySelector('article') || doc.querySelector('body');
      
      const textNodes: string[] = [];
      
      mainContent?.querySelectorAll('h1, h2, h3, h4, p, ul, ol, li, td, th, div').forEach(el => {
        const text = el.textContent?.trim();
        
        if (!text || text.length < 20 || text.match(/(Obtenir un Devis|En savoir plus|Cliquez ici|Cookie)/i)) {
          return;
        }
        
        if (el.tagName.match(/H[1-4]/)) {
          textNodes.push(`\n### ${text}\n`);
        }
        else if (el.tagName === 'UL' || el.tagName === 'OL') {
          const listItems = Array.from(el.querySelectorAll('li'))
            .map(li => `• ${li.textContent?.trim()}`)
            .filter(item => item.length > 5)
            .join('\n');
          if (listItems) {
            textNodes.push(listItems);
          }
        }
        else if (!el.closest('ul, ol') && text.length > 30) {
          textNodes.push(text);
        }
      });
      
      const cleanContent = textNodes
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      
      if (cleanContent.length < 100) return null;
      
      return {
        url,
        title: title.trim(),
        content: cleanContent.substring(0, 6000),
        lastIndexed: new Date()
      };
    } catch (error) {
      console.error(`Erreur indexation ${url}:`, error);
      return null;
    }
  };

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
      '/solution-de-connectivite',
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

  // Détection du type de question
  const detectQuestionType = (query: string): 'matrix' | 'general' | 'unclear' => {
    const queryLower = query.toLowerCase();
    
    // Si trop court ou trop vague
    if (query.trim().length < 3) {
      return 'unclear';
    }
    
    // ÉTAPE 1 : Détecter d'abord les questions CLAIREMENT GÉNÉRALES
    const clearlyGeneralPatterns = [
      // Connaissance générale
      /tu connais|tu sais|connais(-| )tu|sais(-| )tu/,
      /qui est|qu'est(-| )ce que|c'est quoi|définition de|explique(-| )moi/,
      
      // Lieux et géographie (NON liés aux télécoms)
      /paris|londres|new york|tokyo|rome|berlin|madrid/,
      /capitale de|ville de|pays|continent|océan/,
      
      // Culture et divertissement
      /film|série|livre|musique|chanson|acteur|chanteur/,
      /recette|cuisine|plat|restaurant|manger/,
      /sport|football|basket|tennis|match|équipe/,
      
      // Temps et actualité
      /météo|temps qu'il fait|température|date|heure|jour|année/,
      /actualité|news|aujourd'hui|hier|demain/,
      
      // Science et histoire
      /histoire de|historique|guerre|roi|président|empereur/,
      /mathématique|physique|chimie|biologie|planète|espace/,
      
      // Technologie générale (non télécom)
      /comment (faire|créer|programmer|coder|développer)/,
      /python|javascript|java|html|css|react|code/,
      
      // Santé et bien-être
      /santé|maladie|médecin|hôpital|symptôme|traitement/,
      /sport|exercice|fitness|yoga|course/,
      
      // Voyage
      /voyage|vacances|tourisme|visa|passeport|hôtel/
    ];
    
    // Si c'est clairement une question générale, retourner immédiatement
    const isClearlyGeneral = clearlyGeneralPatterns.some(pattern => pattern.test(queryLower));
    if (isClearlyGeneral) {
      return 'general';
    }
    
    // ÉTAPE 2 : Détecter les mentions EXPLICITES de Matrix ou services télécoms
    const explicitMatrixKeywords = [
      'matrix', 'matrixconnect', 'matrix telecoms', 'matrixtelecom',
      'votre entreprise', 'votre société', 'votre service', 'chez vous',
      'vous proposez', 'vous offrez', 'vos solutions', 'vos tarifs'
    ];
    
    const hasExplicitMatrix = explicitMatrixKeywords.some(keyword => queryLower.includes(keyword));
    
    // ÉTAPE 3 : Détecter les termes télécoms spécifiques
    const telecomKeywords = [
      'connectivité', 'fibre optique', 'mpls', 'vpn', 'sd-wan', 'sdwan',
      'mssp', 'firewall', 'sécurité réseau', 'téléphonie ip', 'voip',
      'interconnexion', 'bande passante', 'wan', 'lan',
      'redondance', 'haute disponibilité', 'sla', 'qos',
      'datacenter', 'data center'
    ];
    
    const hasTelecomKeywords = telecomKeywords.some(keyword => queryLower.includes(keyword));
    
    // ÉTAPE 4 : Détecter les patterns de questions professionnelles
    const professionalPatterns = [
      /quelle (solution|offre) (de|pour) (connectivité|réseau|internet)/,
      /comment (connecter|relier|sécuriser) (mes|nos) (sites|bureaux|agences)/,
      /besoin (de|d'un|d'une) (solution|connexion|réseau) (professionnel|entreprise)/,
      /problème (de|avec) (connexion|réseau|internet) (entreprise|bureau)/,
      /devis (pour|de)|tarif|prix (de|pour) (connexion|fibre|mpls|vpn|sd-wan)/,
      /contact.*\+237|téléphone.*\+237|appeler.*matrix/
    ];
    
    const matchesProfessionalPattern = professionalPatterns.some(pattern => pattern.test(queryLower));
    
    // ÉTAPE 5 : Détecter les mots ambigus (peuvent être généraux OU télécoms)
    const ambiguousTerms = [
      'internet', 'réseau', 'connexion', 'débit', 'wifi', 'cloud',
      'sécurité', 'entreprise', 'professionnel', 'b2b',
      'cameroun', 'yaoundé', 'douala', 'prix', 'tarif', 'contact', 'service'
    ];
    
    const hasAmbiguousTerm = ambiguousTerms.some(term => queryLower.includes(term));
    
    // DÉCISION FINALE
    // Si mention explicite de Matrix OU termes télécoms spécifiques OU pattern professionnel
    if (hasExplicitMatrix || hasTelecomKeywords || matchesProfessionalPattern) {
      return 'matrix';
    }
    
    // Si terme ambigu SANS contexte clair, demander précision
    if (hasAmbiguousTerm && query.trim().split(/\s+/).length <= 4) {
      return 'unclear';
    }
    
    // Par défaut, considérer comme question générale
    // (changement majeur : on privilégie GENERAL par défaut au lieu de MATRIX)
    return 'general';
  };

  const findRelevantContent = (query: string, topK: number = 3): string => {
    const queryLower = query.toLowerCase();
    
    const stopWords = ['quels', 'sont', 'les', 'des', 'une', 'pour', 'avec', 'dans', 'sur', 'est', 'que', 'qui', 'comment', 'pourquoi'];
    const keywords = queryLower
      .split(/\s+/)
      .filter(w => w.length > 3 && !stopWords.includes(w));
    
    const scored = siteContent.map(page => {
      let score = 0;
      const contentLower = page.content.toLowerCase();
      const titleLower = page.title.toLowerCase();
      
      keywords.forEach(keyword => {
        if (titleLower.includes(keyword)) {
          score += 20;
        }
      });
      
      keywords.forEach(keyword => {
        const matches = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
        score += matches * 3;
      });
      
      if (contentLower.includes(queryLower)) {
        score += 15;
      }
      
      if (keywords.length > 1) {
        keywords.forEach((kw1, i) => {
          keywords.slice(i + 1).forEach(kw2 => {
            const regex = new RegExp(`${kw1}.{0,50}${kw2}|${kw2}.{0,50}${kw1}`, 'g');
            const proximityMatches = (contentLower.match(regex) || []).length;
            score += proximityMatches * 5;
          });
        });
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

  const getSystemPrompt = (questionType: 'matrix' | 'general' | 'unclear'): string => {
    if (questionType === 'general') {
      return `Tu es un assistant virtuel intelligent. L'utilisateur te pose une question générale qui n'est pas liée à MatrixConnect ou aux télécommunications.

**RÈGLES :**
1. Réponds comme un assistant général compétent et utile
2. Sois professionnel, clair et concis
3. Si la question nécessite des informations actualisées, indique-le
4. Reste factuel et objectif
5. Réponds en français de manière naturelle

Réponds directement à la question posée.`;
    }
    
    if (questionType === 'unclear') {
      return `Tu es un assistant virtuel pour MatrixConnect. L'utilisateur a posé une question peu claire ou trop vague.

**RÈGLES :**
1. Demande poliment des précisions
2. Propose des options si tu peux deviner l'intention
3. Reste professionnel et aidant
4. Suggère des sujets populaires si pertinent

Aide l'utilisateur à formuler sa question.`;
    }
    
    // Matrix-specific prompt
    return `Tu es un assistant virtuel intelligent pour MatrixConnect, entreprise de télécommunications au Cameroun.

**TON RÔLE :**
Analyser si la question concerne :
1. **MatrixConnect/télécoms** → Utilise UNIQUEMENT le contexte fourni du site
2. **Question générale** → Réponds comme assistant général
3. **Question peu claire** → Demande des précisions

**POUR LES QUESTIONS MATRIXCONNECT :**
✅ Utilise UNIQUEMENT les informations du contexte fourni
✅ Mentionne les services pertinents (Connectivité, SD-WAN, MPLS, VPN, Sécurité MSSP, Fibre)
✅ Reste factuel - n'invente JAMAIS de caractéristiques
✅ Ton professionnel et direct
✅ Termine par un appel à l'action (contact, devis)
✅ 3-5 phrases maximum

**INFORMATIONS CLÉS MATRIXCONNECT :**
• Fondation : 1997, filiale ICCNET (créé 1995)
• Expérience : 28 ans en télécom B2B
• Infrastructure : Jusqu'à 80 Gbps
• Services principaux : 
  - **Connectivité** : Fibre optique dédiée, internet haut débit, redondance, haute disponibilité
  - **SD-WAN** : Optimisation WAN, gestion centralisée, sécurité intégrée, économies 40%
  - **MPLS** : Interconnexion multi-sites, réseau privé sécurisé, QoS garantie
  - **VPN** : Connexions distantes sécurisées, chiffrement robuste, accès nomade
  - **Sécurité MSSP** : SOC 24/7, firewalls nouvelle génération, détection intrusions
  - **Téléphonie IP** : IPBX, SDA, mobilité, réduction coûts 60%

**COORDONNÉES :**
📍 Yaoundé : +237 242 13 95 45 | 📍 Douala : +237 233 43 88 18
📧 info@matrixconnect.cm

Réponds de manière professionnelle, précise et orientée action.`;
  };

  const sendToGroq = async (userMessage: string): Promise<string> => {
    try {
      const questionType = detectQuestionType(userMessage);
      
      // Pour les questions peu claires
      if (questionType === 'unclear') {
        return 'Pouvez-vous préciser votre question ? Je peux vous aider sur :\n\n• Les solutions de connectivité MatrixConnect\n• Les services télécom (SD-WAN, MPLS, VPN, Sécurité)\n• Les tarifs et devis\n• Le contact et informations pratiques\n• Ou toute autre question générale\n\nComment puis-je vous aider ?';
      }
      
      const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
      
      if (!apiKey || apiKey === 'DEMO_KEY') {
        console.warn('⚠️ Mode démo - Configurez NEXT_PUBLIC_GROQ_API_KEY');
        return getFallbackResponse(userMessage, questionType);
      }

      const systemPrompt = getSystemPrompt(questionType);
      
      let userPrompt = userMessage;
      
      // Ajouter le contexte seulement pour les questions Matrix
      if (questionType === 'matrix') {
        const relevantContext = findRelevantContent(userMessage);
        userPrompt = `CONTEXTE DU SITE MATRIXCONNECT :\n${relevantContext}\n\n---\n\nQUESTION DU VISITEUR :\n${userMessage}`;
      }

      const response = await fetch(GROQ_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: questionType === 'general' ? 0.8 : 0.7,
          max_tokens: 800,
          top_p: 0.9
        })
      });

      if (!response.ok) {
        if (response.status === 429 || response.status === 401) {
          return getFallbackResponse(userMessage, questionType);
        }
        throw new Error(`Erreur API Groq: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Réponse API invalide');
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Erreur Groq:', error);
      const questionType = detectQuestionType(userMessage);
      return getFallbackResponse(userMessage, questionType);
    }
  };

  const getFallbackResponse = (userMessage: string, questionType: 'matrix' | 'general' | 'unclear'): string => {
    if (questionType === 'general') {
      return 'Je ne peux pas répondre à cette question en mode hors ligne. Pour les questions générales, veuillez réessayer plus tard ou consultez des ressources en ligne spécialisées. Je reste disponible pour toute question sur MatrixConnect et nos services télécom !';
    }
    
    const msg = userMessage.toLowerCase();
    
    if (msg.match(/connectivité|solution.*connectivité|internet|connexion|bande passante/)) {
      return 'MatrixConnect propose des solutions de connectivité haute performance pour entreprises :\n\n• **Accès Internet dédié** : Fibre optique jusqu\'à 80 Gbps, symétrique et ultra-fiable\n• **Redondance** : Liens de secours automatiques (4G/5G, Faisceau Hertzien)\n• **Haute disponibilité** : Infrastructure garantissant la continuité de service\n• **Sécurité intégrée** : Protection réseau et chiffrement\n• **Scalabilité** : Solutions évolutives selon vos besoins\n\nIdéal pour : réseaux d\'entreprise modernes, cloud, VoIP, vidéoconférence. Quelle bande passante recherchez-vous ? 📞 +237 242 13 95 45';
    }
    
    if (msg.match(/sécurité|mssp|cyberattaque|firewall|protection/)) {
      return 'Notre service MSSP offre une protection 24/7 avec un SOC dédié. Nous déployons des firewalls nouvelle génération, détectons les intrusions en temps réel et bloquons les attaques DDoS. Avec 28 ans d\'expertise, nous sécurisons les infrastructures des entreprises camerounaises. Contactez-nous pour un audit gratuit : +237 242 13 95 45.';
    }
    
    if (msg.match(/sd-wan|sdwan|wan/)) {
      return 'Le SD-WAN centralise et optimise vos liaisons WAN (Fibre, 4G, MPLS). Vous gagnez jusqu\'à 40% sur les coûts, améliorez les performances et sécurisez le trafic. Idéal pour interconnecter plusieurs sites avec une gestion cloud centralisée. Demandez une démonstration : info@matrixconnect.cm.';
    }

    if (msg.match(/mpls|interconnexion|multi-sites/)) {
      return 'Le MPLS interconnecte l\'ensemble de vos sites (siège, agences, data centers) au sein d\'un réseau privé sécurisé. Avantages : confidentialité des données, QoS garantie, gestion centralisée, haute disponibilité, performances optimales. Infrastructure 80 Gbps disponible. Combien de sites souhaitez-vous connecter ? 📞 +237 242 13 95 45';
    }
    
    if (msg.match(/vpn/)) {
      return 'Nos solutions VPN sécurisent vos connexions distantes et interconnectent vos sites via Internet. Chiffrement robuste, accès nomade pour vos collaborateurs, et intégration avec votre infrastructure existante. Alternative économique au MPLS pour certains cas d\'usage. Besoin d\'une analyse ? 📞 +237 233 43 88 18';
    }

    if (msg.match(/prix|tarif|coût|devis|budget/)) {
      return 'Nos tarifs sont personnalisés selon vos besoins. Nous commençons par un audit technique gratuit, puis proposons une solution sur mesure avec ROI détaillé. 28 ans d\'expérience pour optimiser votre investissement. Obtenez votre devis : +237 242 13 95 45 (Yaoundé) ou +237 233 43 88 18 (Douala).';
    }

    if (msg.match(/contact|joindre|appeler|rendez-vous|téléphone/)) {
      return 'Coordonnées MatrixConnect :\n📍 Yaoundé : +237 242 13 95 45\n📍 Douala : +237 233 43 88 18\n📧 info@matrixconnect.cm\nRappel sous 24h garanti. Infrastructure 80 Gbps à votre service depuis 1997.';
    }

    return 'MatrixConnect, leader télécom B2B au Cameroun depuis 1997. Infrastructure 80 Gbps pour : Connectivité très haut débit, SD-WAN intelligent, Sécurité MSSP 24/7, Interconnexion multi-sites. Comment puis-je vous aider ? 📞 +237 242 13 95 45';
  };

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
      const response = await sendToGroq(userMessage.content);
      
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
                  {isIndexing ? 'Indexation...' : siteContent.length > 0 ? `${siteContent.length} pages • Groq AI` : 'En ligne'}
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
              Propulsé par Groq AI (Llama 3.3 70B) • MatrixConnect © 2025
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;