"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Configuration
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'assistant virtuel de MatrixConnect, leader camerounais des télécommunications depuis 1997. Avec 28 ans d\'expertise et une infrastructure jusqu\'à 80 Gbps, comment puis-je vous accompagner ? (Connectivité, SD-WAN, Sécurité MSSP, Interconnexion...)',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // Contexte enrichi de MatrixConnect
  const getEnrichedPrompt = (userMessage: string): string => {
    const context = `Tu es l'assistant virtuel de MatrixConnect, leader camerounais des télécommunications et services IP depuis 1997.

INFORMATIONS ENTREPRISE :
- Fondation : 1997, filiale du Groupe ICCNET (créé en 1995 sous le nom International Computer Center - ICC)
- Expérience : 28 ans d'expertise (2025)
- Mission : "Connecting People. Inspiring Solutions"
- Positionnement : Hub majeur pour entreprises, organisations publiques/privées, acteurs internationaux au Cameroun
- Capital social : 80 millions FCFA
- Infrastructure : Vitesses jusqu'à 80 Gbps, haute disponibilité
- Focus : Solutions B2B (Business to Business)

COORDONNÉES OFFICIELLES :
📍 Siège Yaoundé : 4124 Yaoundé, Cameroun
   ☎️ +237 242 13 95 45 / +237 222 21 26 11 / +237 242 23 22 01
📍 Succursale Douala : 24122 Douala, Cameroun
   ☎️ +237 222 21 26 11 / +237 233 43 88 18
📧 Email : info@matrixconnect.cm

SOLUTIONS TÉLÉCOMS COMPLÈTES :
1. 🌐 Connectivité Haut Débit :
   - Fibre dédiée symétrique (jusqu'à 80 Gbps)
   - Faisceau Hertzien
   - VSAT (zones isolées)
   - Backup 4G/5G (continuité de service)

2. 🔗 Interconnexion Multi-Sites :
   - MPLS IP/VPN (QoS garantie)
   - VPLS (LAN to LAN)
   - Internet VPN (Site to Site)
   - Réseaux privés sécurisés

3. 🛡️ Sécurité Managée (MSSP) :
   - SOC 24/7 (Security Operations Center)
   - Firewall managé nouvelle génération
   - Détection et prévention d'intrusions
   - Protection DDoS
   - Audits de sécurité

4. 🚀 SD-WAN (Software-Defined WAN) :
   - Optimisation multi-liens WAN
   - Gestion centralisée cloud
   - Réduction des coûts opérationnels
   - Sécurité intégrée
   - Performances optimisées

5. ☁️ Console Connect :
   - Plateforme cloud connectivité
   - Accès multi-cloud (AWS, Azure, Google Cloud)
   - Gestion self-service
   - Interconnexion datacenter

EXPERTISE ET CONTRIBUTION :
- Participation à l'essor des TIC au Cameroun
- Projets d'infrastructure nationale
- Formation de talents locaux
- Plus de 28 ans de contribution au développement technologique du pays

CLIENTS CIBLES :
- Grandes entreprises multinationales
- PME en croissance
- Organisations publiques et gouvernementales
- Institutions financières (banques, assurances)
- Opérateurs télécoms
- Datacenters et cloud providers

VALEURS FONDAMENTALES :
✅ Excellence et innovation
✅ Formation talents locaux
✅ Relation client proactive
✅ Services fiables et sécurisés
✅ Accompagnement personnalisé

TON RÔLE EN TANT QU'ASSISTANT :
- Répondre professionnellement avec expertise technique
- Mettre en avant les 28 ans d'expérience et infrastructure 80 Gbps
- Orienter vers les bonnes solutions selon les besoins
- Expliquer les technologies de manière accessible
- Encourager le contact direct (téléphone/email) pour devis personnalisés
- Valoriser la mission "Connecting People. Inspiring Solutions"
- Parler français avec un ton amical mais expert

Question du client : ${userMessage}

Réponds de manière claire, précise et professionnelle en 3-4 phrases maximum. Valorise l'expertise MatrixConnect et guide vers l'action (contact, devis, démo).`;

    return context;
  };

  // Appel à l'API Gemini
  const sendToGemini = async (userMessage: string): Promise<string> => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'DEMO_KEY';
      
      if (apiKey === 'DEMO_KEY') {
        return getDemoResponse(userMessage);
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
            maxOutputTokens: 500,
          }
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('⚠️ Quota Gemini dépassé, utilisation du mode démo');
          return getDemoResponse(userMessage);
        }
        throw new Error(`Erreur API Gemini: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Erreur Gemini:', error);
      return getDemoResponse(userMessage);
    }
  };

  // Réponses de démo intelligentes enrichies
  const getDemoResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    // Prix et tarifs
    if (msg.includes('prix') || msg.includes('tarif') || msg.includes('coût') || msg.includes('budget')) {
      return 'Nos tarifs sont personnalisés selon votre infrastructure. Avec 28 ans d\'expérience, nous établissons des devis adaptés à vos besoins. Contactez-nous au +237 242 13 95 45 (Yaoundé) ou +237 233 43 88 18 (Douala) pour un audit gratuit et un devis sur mesure.';
    }
    
    // Connectivité et fibre
    if (msg.includes('fibre') || msg.includes('connectivité') || msg.includes('internet') || msg.includes('bande passante')) {
      return 'MatrixConnect propose des connexions jusqu\'à 80 Gbps avec haute disponibilité : Fibre dédiée symétrique, Faisceau Hertzien, VSAT pour zones isolées, Backup 4G/5G. Leader depuis 1997, nous garantissons la continuité de service. Quelle est votre problématique principale ?';
    }
    
    // SD-WAN
    if (msg.includes('sd-wan') || msg.includes('sdwan') || msg.includes('wan')) {
      return 'Notre SD-WAN optimise vos liens WAN (Fibre, 4G, MPLS) avec gestion centralisée cloud. Réduction des coûts jusqu\'à 40%, meilleures performances et sécurité renforcée. Filiale du Groupe ICCNET, 28 ans d\'expertise. Souhaitez-vous une démonstration ?';
    }
    
    // Sécurité et MSSP
    if (msg.includes('sécurité') || msg.includes('mssp') || msg.includes('cyberattaque') || msg.includes('firewall') || msg.includes('soc')) {
      return 'Notre MSSP assure une protection 24/7 : SOC dédié, Firewall nouvelle génération, détection d\'intrusions, protection DDoS avancée. MatrixConnect, expert sécurité depuis 1997 au Cameroun. Contactez info@matrixconnect.cm pour un audit de sécurité gratuit.';
    }
    
    // Contact et commercial
    if (msg.includes('contact') || msg.includes('rendez-vous') || msg.includes('commercial') || msg.includes('devis')) {
      return '📞 Yaoundé : +237 242 13 95 45 | Douala : +237 233 43 88 18 | 📧 info@matrixconnect.cm. Notre équipe commerciale vous rappelle sous 24h. Filiale du Groupe ICCNET, 28 ans d\'expertise et infrastructure 80 Gbps à votre service. Préférez-vous un rendez-vous téléphonique ou en agence ?';
    }
    
    // MPLS, VPN, Interconnexion
    if (msg.includes('mpls') || msg.includes('vpn') || msg.includes('interconnexion') || msg.includes('multi-sites')) {
      return 'Nos solutions d\'interconnexion (MPLS IP/VPN, VPLS LAN to LAN) relient vos sites de manière sécurisée avec QoS garantie. Infrastructure 80 Gbps, depuis 1997. Idéal pour entreprises multi-sites. Combien de sites souhaitez-vous interconnecter ?';
    }

    // Histoire et présentation
    if (msg.includes('histoire') || msg.includes('entreprise') || msg.includes('qui êtes') || msg.includes('présentation') || msg.includes('iccnet')) {
      return 'MatrixConnect, fondée en 1997, filiale du Groupe ICCNET (créé en 1995 sous le nom ICC). 28 ans d\'expertise, leader télécoms B2B au Cameroun. Infrastructure 80 Gbps. Mission : "Connecting People. Inspiring Solutions". Capital 80 millions FCFA. Hub majeur pour entreprises et organisations publiques.';
    }

    // Localisation
    if (msg.includes('yaoundé') || msg.includes('douala') || msg.includes('localisation') || msg.includes('adresse') || msg.includes('où')) {
      return '📍 Siège Yaoundé (4124) : +237 242 13 95 45 | Succursale Douala (24122) : +237 233 43 88 18. Nous couvrons tout le Cameroun avec des solutions adaptées aux entreprises, organisations publiques et acteurs internationaux. Quelle ville vous intéresse ?';
    }

    // Console Connect et Cloud
    if (msg.includes('console connect') || msg.includes('cloud') || msg.includes('aws') || msg.includes('azure') || msg.includes('multi-cloud')) {
      return 'Console Connect est notre plateforme cloud pour connectivité multi-cloud (AWS, Azure, Google Cloud). Gestion self-service, interconnexion datacenter, accès instantané. Infrastructure 80 Gbps. Souhaitez-vous une démonstration de la plateforme ?';
    }

    // Support et assistance
    if (msg.includes('support') || msg.includes('assistance') || msg.includes('help') || msg.includes('problème') || msg.includes('panne')) {
      return 'Notre support technique 24/7 est disponible : +237 242 23 22 01 (Yaoundé) ou info@matrixconnect.cm. Avec 28 ans d\'expérience, nous garantissons une haute disponibilité et intervention rapide. Quel est le problème rencontré ?';
    }

    // Clients et références
    if (msg.includes('client') || msg.includes('référence') || msg.includes('partenaire') || msg.includes('qui utilise')) {
      return 'MatrixConnect accompagne des grandes entreprises multinationales, PME, organisations publiques, institutions financières et opérateurs télécoms au Cameroun. 28 ans d\'expertise, infrastructure 80 Gbps. Souhaitez-vous des cas d\'usage spécifiques à votre secteur ?';
    }

    // VSAT et zones isolées
    if (msg.includes('vsat') || msg.includes('satellite') || msg.includes('zone isolée') || msg.includes('rural')) {
      return 'Notre solution VSAT permet la connectivité haut débit dans les zones isolées non couvertes par la fibre. Idéal pour sites miniers, bases pétrolières, zones rurales. Depuis 1997, expert connectivité au Cameroun. Quelle est votre localisation ?';
    }

    // Backup et continuité
    if (msg.includes('backup') || msg.includes('4g') || msg.includes('5g') || msg.includes('continuité') || msg.includes('redondance')) {
      return 'Nos solutions Backup 4G/5G garantissent la continuité de service en cas de panne fibre. Basculement automatique, infrastructure redondante. 28 ans d\'expertise, disponibilité maximale. Souhaitez-vous un devis pour une solution de secours ?';
    }
    
    // Réponse par défaut enrichie
    return 'Bienvenue chez MatrixConnect, leader télécoms depuis 1997 ! 🚀 Infrastructure 80 Gbps, filiale du Groupe ICCNET. Nos solutions : Connectivité haut débit, SD-WAN, Sécurité MSSP 24/7, Interconnexion multi-sites, Console Connect cloud. Comment puis-je vous aider ? 📞 +237 242 13 95 45';
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
        content: 'Désolé, une erreur est survenue. Veuillez réessayer ou nous contacter au +237 242 13 95 45.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion de la touche Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
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

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Assistant MatrixConnect</h3>
                <p className="text-xs text-green-100">En ligne • 28 ans d'expertise</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
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

          {/* Input */}
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
                aria-label="Envoyer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Propulsé par Google Gemini AI • MatrixConnect © 2025
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;