import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const FarmHelperChat = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: t("chatbot.welcome", "Hello! I am your AgriSat Assistant. How can I help you today?"), sender: "bot" }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (text) => {
        if (!text.trim()) return;

        const newUserMessage = { id: Date.now(), text, sender: "user" };
        setMessages(prev => [...prev, newUserMessage]);
        setInputValue("");

        // Simple Rule-based AI logic
        setTimeout(() => {
            const botResponse = getBotResponse(text);
            const newBotMessage = { id: Date.now() + 1, text: botResponse, sender: "bot" };
            setMessages(prev => [...prev, newBotMessage]);
            speak(botResponse);
        }, 800);
    };

    const getBotResponse = (input) => {
        const query = input.toLowerCase();
        if (query.includes("weather")) return t("chatbot.res_weather", "You can check the detailed weather in the Weather section. It looks like a good day for farming!");
        if (query.includes("disease") || query.includes("pest")) return t("chatbot.res_disease", "I recommend using the Crop Diagnosis tool to upload a photo of your crop for accurate detection.");
        if (query.includes("price") || query.includes("market")) return t("chatbot.res_market", "Market prices are updated daily in the Market Prices section. Check them out!");
        if (query.includes("scheme") || query.includes("govt")) return t("chatbot.res_scheme", "There are several government schemes available for farmers. Visit the Govt Schemes page for more info.");
        if (query.includes("hello") || query.includes("hi")) return t("chatbot.res_hello", "Hi there! How can I assist you with your farm today?");
        
        return t("chatbot.res_default", "I'm not sure I understand. Could you please rephrase? I can help with weather, diseases, market prices, and govt schemes.");
    };

    const speak = (text) => {
        if (!window.speechSynthesis) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = i18n.language === "hi" ? "hi-IN" : i18n.language === "or" ? "or-IN" : "en-US";
        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = i18n.language === "hi" ? "hi-IN" : i18n.language === "or" ? "or-IN" : "en-US";
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handleSend(transcript);
        };

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    return (
        <div className="fixed bottom-20 right-4 z-[1000]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-80 h-96 flex flex-col overflow-hidden mb-4 border border-gray-200 dark:border-gray-700"
                    >
                        {/* Header */}
                        <div className="bg-green-600 text-white p-3 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2">
                                <span>🤖</span> AgriSat Helper
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-xl">×</button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-2 rounded-xl text-sm ${
                                        msg.sender === "user" 
                                        ? "bg-green-600 text-white rounded-br-none" 
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-2 border-t dark:border-gray-700 flex gap-1">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSend(inputValue)}
                                placeholder={t("chatbot.placeholder", "Type a message...")}
                                className="flex-1 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <button 
                                onClick={toggleListening}
                                className={`p-2 rounded-lg ${isListening ? "bg-red-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
                            >
                                {isListening ? "⏹" : "🎤"}
                            </button>
                            <button 
                                onClick={() => handleSend(inputValue)}
                                className="bg-green-600 text-white p-2 rounded-lg"
                            >
                                ➔
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-green-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl"
            >
                {isOpen ? "💬" : "🤖"}
            </motion.button>
        </div>
    );
};

export default FarmHelperChat;
