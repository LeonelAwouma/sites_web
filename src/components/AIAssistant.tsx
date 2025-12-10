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
      content: 'Bonjour ! Je suis l\'assistant virtuel de MatrixConnect. Comment puis-je vous aider aujourd\'hui ? Je peux répondre à vos questions sur nos solutions de connectivité, SD-WAN, cybersécurité et bien plus encore.',
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
    const context = `Tu es l'assistant virtuel de MatrixConnect, une entreprise camerounaise spécialisée dans les solutions télécoms et IT. 

Informations sur MatrixConnect :
- Solutions de Connectivité : Fibre dédiée, Faisceau Hertzien, VSAT, Backup 4G/5G
- Solutions d'Interconnexion : MPLS IP/VPN, VPLS (LAN to LAN), Internet VPN (Site to Site)
- Solutions de Sécurité : MSSP 24/7, SOC, Firewall managé, DDoS protection
- Solutions SD-WAN : Optimisation WAN, Gestion centralisée, Sécurité intégrée
- Console Connect : Plateforme cloud pour connectivité multi-cloud
- Localisation : Cameroun (Douala, Yaoundé)
- Expertise : Plus de 10 ans d'expérience
- Clients : Entreprises, PME, grandes organisations

Ton rôle :
- Répondre de manière professionnelle et concise
- Orienter les clients vers les bonnes solutions
- Expliquer les technologies de manière accessible
- Encourager les visiteurs à contacter l'équipe commerciale
- Parler en français avec un ton amical mais professionnel

Question du client : ${userMessage}

Réponds de manière claire et utile, en limitant ta réponse à 3-4 phrases maximum.`;

    return context;
  };

  // Appel à l'API Gemini
  const sendToGemini = async (userMessage: string): Promise<string> => {
    try {
      // Note: En production, l'API key doit être dans .env côté serveur
      // Pour cette démo, nous simulons l'appel
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'DEMO_KEY';
      
      if (apiKey === 'DEMO_KEY') {
        // Mode démo sans vraie API
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
        const errorData = await response.json();
        
        // Si quota dépassé, bascule automatiquement en mode démo
        if (response.status === 429) {
          console.warn('⚠️ Quota Gemini dépassé, utilisation du mode démo');
          return getDemoResponse(userMessage);
        }
        
        console.warn('Erreur API Gemini - Status:', response.status);
        console.warn('Détails:', errorData);
        throw new Error(`Erreur API Gemini: ${response.status}`);
      }

      const data = await response.json();
      console.log('Réponse Gemini:', data);
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Erreur complète Gemini:', error);
      // En cas d'erreur, utilise le mode démo comme fallback
      return getDemoResponse(userMessage);
    }
  };

  // Réponses de démo intelligentes
  const getDemoResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('prix') || msg.includes('tarif') || msg.includes('coût')) {
      return 'Nos tarifs sont personnalisés selon vos besoins spécifiques. Je vous invite à contacter notre équipe commerciale qui établira un devis adapté à votre infrastructure et vos objectifs. Souhaitez-vous que je vous mette en relation ?';
    }
    
    if (msg.includes('fibre') || msg.includes('connectivité') || msg.includes('internet')) {
      return 'Nous proposons plusieurs solutions de connectivité : Fibre dédiée symétrique, Faisceau Hertzien, VSAT pour les zones isolées, et Backup 4G/5G pour garantir votre continuité. Quelle est votre problématique principale ?';
    }
    
    if (msg.includes('sd-wan') || msg.includes('sdwan')) {
      return 'Notre solution SD-WAN optimise votre réseau WAN en combinant plusieurs liens (Fibre, 4G, MPLS) avec une gestion centralisée. Vous bénéficiez de meilleures performances, réduction des coûts et sécurité renforcée. Voulez-vous en savoir plus ?';
    }
    
    if (msg.includes('sécurité') || msg.includes('mssp') || msg.includes('cyberattaque')) {
      return 'Notre service MSSP (Managed Security Service Provider) assure une protection 24/7 avec SOC, firewall managé, détection d\'intrusions et protection DDoS. Votre sécurité est notre priorité. Puis-je vous orienter vers un expert ?';
    }
    
    if (msg.includes('contact') || msg.includes('rendez-vous') || msg.includes('commercial')) {
      return 'Parfait ! Vous pouvez nous contacter au +237 XXX XXX XXX ou par email à contact@matrixconnect.cm. Notre équipe vous rappellera sous 24h pour discuter de vos besoins. Préférez-vous un contact téléphonique ou email ?';
    }
    
    if (msg.includes('mpls') || msg.includes('vpn') || msg.includes('interconnexion')) {
      return 'Nos solutions d\'interconnexion (MPLS IP/VPN, VPLS LAN to LAN) permettent de relier vos sites de manière sécurisée avec QoS garantie. Idéal pour les multi-sites. Combien de sites souhaitez-vous interconnecter ?';
    }
    
    return 'Je suis là pour vous aider ! MatrixConnect propose des solutions complètes : Connectivité (Fibre, VSAT), SD-WAN, Sécurité managée (MSSP), et Interconnexion de sites. Que puis-je vous expliquer en détail ?';
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
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Ouvrir l'assistant IA"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            1
          </span>
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Besoin d'aide ?
          </span>
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Assistant MatrixConnect</h3>
                <p className="text-xs text-blue-100">En ligne • Propulsé par Gemini AI</p>
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === 'user' ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-700" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-2xl p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <span className={`text-xs mt-1 block ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gray-700" />
                </div>
                <div className="bg-white rounded-2xl p-3 border border-gray-200">
                  <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors"
                aria-label="Envoyer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              L'IA peut faire des erreurs.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;