import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  HelpCircle
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TTSButton } from './TTSButton';

interface AskAIProps {
  language: LanguageCode;
  selectedCropContext?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string;
  timestamp: string;
}

const DEFAULT_QUESTIONS: Record<LanguageCode, string[]> = {
  en: [
    'How to prepare black soil for Cotton sowing?',
    'What organic fertilizer is best for Wheat during tillering?',
    'Drip irrigation tips for low rainfall areas?',
    'How to manage Pink Bollworm in Cotton naturally?',
    'Best companion crop with Maize in Rabi season?',
  ],
  hi: [
    'कपास की बुवाई के लिए काली मिट्टी कैसे तैयार करें?',
    'गेहूं में कल्ले फूटते समय कौन सी खाद डालनी चाहिए?',
    'कम पानी वाले क्षेत्रों में ड्रिप सिंचाई का सही तरीका क्या है?',
    'कपास में गुलाबी सुंडी (Pink Bollworm) की रोकथाम कैसे करें?',
    'मक्का के साथ सह-फसल (Companion Crop) के रूप में क्या लगाएं?',
  ],
  pa: [
    'ਕਣਕ ਵਿੱਚ ਪੀਲੀ ਕੁੰਗੀ ਦੀ ਰੋਕਥਾਮ ਲਈ ਕੀ ਸਪਰੇਅ ਕਰੀਏ?',
    'ਨਰਮੇ ਦੀ ਫ਼ਸਲ ਲਈ ਜ਼ਮੀਨ ਦੀ ਤਿਆਰੀ ਕਿਵੇਂ ਕਰੀਏ?',
    'ਘੱਟ ਪਾਣੀ ਵਿੱਚ ਮੂੰਗੀ ਦੀ ਬਿਜਾਈ ਦੇ ਫ਼ਾਇਦੇ?',
    'ਝੋਨੇ ਵਿੱਚ ਸਿੱਧੀ ਬਿਜਾਈ (DSR) ਦਾ ਸਹੀ ਤਰੀਕਾ ਕੀ ਹੈ?',
    'ਯੂਰੀਆ ਖਾਦ ਪਾਉਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕਿਹಡਾ ਹੈ?',
  ],
  mr: [
    'कापूस लागवडीसाठी काळी कसदार जमीन कशी तयार करावी?',
    'गव्हामध्ये फुटवे फुटताना कोणते खत द्यावे?',
    'कमी पावसाच्या भागात ठिबक सिंचनाचा प्रभावी वापर कसा करावा?',
    'सोयाबीनवरील चक्रीभुंगा नियंत्रणासाठी काय उपाय करावेत?',
    'हरभरा पिकात जास्त घाटे भरण्यासाठी काय करावे?',
  ],
  te: [
    'పత్తి సాగుకు నల్లరేగడి నేలను ఎలా సిద్ధం చేసుకోవాలి?',
    'గోధుమ లేదా వరి పిలకలు వేసే దశలో ఏ ఎరువులు వాడాలి?',
    'తక్కువ వర్షపాతం ఉన్న ప్రాంతాల్లో బిందు సేద్యం (డ్రిప్) చిట్కాలు?',
    'పత్తిలో గులాబీ రంగు పురుగు నివారణకు మార్గాలు?',
    'మొక్కజొన్నతో అంతరపంటగా ఏది మంచిది?',
  ],
  ta: [
    'பருத்தி சாகுபடிக்கு கரிசல் மண்ணை எவ்வாறு தயார் செய்வது?',
    'நெற்பயிரில் தூர் கட்டும் பருவத்தில் எந்த உரம் இட வேண்டும்?',
    'குறைந்த நீர் பாசனத்தில் சொட்டுநீர் பாசனத்தின் பயன்கள் என்ன?',
    'பருத்தியில் இளஞ்சிவப்பு காய்ப்புழுவை கட்டுப்படுத்துவது எப்படி?',
    'மக்காச்சோளத்துடன் ஊடுபயிராக எதை பயிரிடலாம்?',
  ],
  kn: [
    'ರಾಗಿ ಬೆಳೆಗೆ ಮುಂಗಾರಿನಲ್ಲಿ ಯಾವ ಗೊಬ್ಬರ ಉತ್ತಮ?',
    'ಕಪ್ಪು ಮಣ್ಣಿನಲ್ಲಿ ಹತ್ತಿ ಬಿತ್ತನೆಗೆ ಜಮೀನು ಹೇಗೆ ಸಿದ್ಧಪಡಿಸಬೇಕು?',
    'ಕಡಿಮೆ ಮಳೆಯ ಪ್ರದೇಶಗಳಲ್ಲಿ ಹನಿ ನೀರಾವರಿ ನಿರ್ವಹಣೆ ಹೇಗೆ?',
    'ಮೆಕ್ಕೆಜೋಳದಲ್ಲಿ ಲದ್ದಿ ಹುಳು (Fall Armyworm) ನಿಯಂತ್ರಣ ಹೇಗೆ?',
    'ಕಡಲೆ ಬೆಳೆಯಲ್ಲಿ ಕಾಯಿ ಕೊರೆಯುವ ಹುಳು ನಿಯಂತ್ರಣ ಕ್ರಮಗಳು?',
  ],
};

export const AskAI: React.FC<AskAIProps> = ({ language, selectedCropContext }) => {
  const t = TRANSLATIONS[language];
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: language === 'kn'
        ? 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು ಭೂಮಿತ್ರ AI ಕೃಷಿ ಸಲಹೆಗಾರ. ನೀವು ಮಣ್ಣು, ಗೊಬ್ಬರ, ಕೀಟ ನಿಯಂತ್ರಣ ಅಥವಾ ಬೆಳೆ ನಿರ್ವಹಣೆಯ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಬಹುದು.'
        : language === 'hi'
        ? 'नमस्ते किसान साथी! मैं भूमिमित्र AI कृषी सहायक हूँ। आप मुझसे मिट्टी, खाद, बीज उपचार, कीट नियंत्रण या फसल प्रबंधन के बारे में कोई भी प्रश्न पूछ सकते हैं।'
        : 'Welcome to BHUMITRA AI Agri-Advisor! Ask me anything regarding soil preparation, fertilizer dosage, natural pest management, or irrigation schedules.',
      timestamp: 'Just now',
    },
  ]);

  const quickQuestions = DEFAULT_QUESTIONS[language] || DEFAULT_QUESTIONS.en;

  const handleSend = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || isLoading) return;

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          language: language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : language === 'pa' ? 'Punjabi' : language === 'mr' ? 'Marathi' : language === 'te' ? 'Telugu' : language === 'ta' ? 'Tamil' : 'English',
          cropContext: selectedCropContext,
        }),
      });

      const data = await res.json();
      const aiReply = data.answer || 'Kindly test your soil with KVK or consult the local agriculture officer for specific field conditions.';

      const aiMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: aiReply,
        source: data.source || 'gemini-3.8-flash',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const fallbackMsg: Message = {
        id: 'ai-' + Date.now(),
        sender: 'ai',
        text: 'For optimal results, ensure balanced NPK fertilization, treat seeds with bio-fungicide, and maintain moisture during flowering stages.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ask-ai-section" className="scroll-mt-24">
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-6 sm:p-10">
        {/* Header with Listen Audio Option */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-100">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Agri-Agronomist · Instant Practical Advisory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {t.askAiTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t.askAiSub}
            </p>
          </div>

          <TTSButton
            id="ask-ai-header-intro"
            title="Ask AI Agronomist Introduction"
            textToSpeak={`${t.askAiTitle}. ${t.askAiSub}`}
            language={language}
            size="sm"
            variant="secondary"
          />
        </div>

        {/* Suggested Quick Questions */}
        <div className="mb-6 space-y-2">
          <span className="text-xs font-bold text-slate-500 block flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Popular Practical Questions (Click to Ask):</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((qq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(qq)}
                disabled={isLoading}
                className="text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:text-emerald-800 hover:bg-emerald-50/50 font-medium text-slate-700 transition-colors text-left"
              >
                {qq}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Stream Window */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-6 mb-4 min-h-[280px] max-h-[460px] overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-xs shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  <div className="flex items-center justify-between gap-4 pt-1 text-[11px] opacity-80 border-t border-slate-100/60">
                    <span>{msg.timestamp}</span>

                    {!isUser && (
                      <TTSButton
                        id={`msg-${msg.id}`}
                        title="AI Advisory Response"
                        textToSpeak={msg.text}
                        language={language}
                        size="sm"
                        variant="subtle"
                        labelOverride="Listen Answer"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs p-3 shadow-xs text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce delay-200" />
                <span className="ml-1">Consulting agronomic knowledge base...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputQuery);
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.askAiPlaceholder}
              disabled={isLoading}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-2xs"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className={`px-5 py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all flex items-center gap-2 ${
              isLoading || !inputQuery.trim()
                ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                : 'bg-emerald-700 hover:bg-emerald-800 shadow-sm shadow-emerald-700/20'
            }`}
          >
            <span>{t.askAiButton}</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
