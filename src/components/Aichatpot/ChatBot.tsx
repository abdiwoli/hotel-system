// components/ChatBot.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { FiSend, FiX, FiMessageSquare } from 'react-icons/fi';
import { IoMdChatbubbles } from 'react-icons/io';
import { BsRobot } from 'react-icons/bs';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
};

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hello! How can I help you today?',
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const res = await fetch('/api/groq-test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: inputValue }),
            });

            const data = await res.json();

            const botMessage: Message = {
                id: Date.now().toString(),
                text: data.message || 'Sorry, something went wrong.',
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            const errorMessage: Message = {
                id: Date.now().toString(),
                text: '⚠️ Error: Unable to fetch response.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Close chat when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const chatContainer = document.querySelector('.chat-container');
            const chatButton = document.querySelector('.chat-button');

            if (isOpen &&
                chatContainer &&
                !chatContainer.contains(event.target as Node) &&
                chatButton &&
                !chatButton.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Window - Now responsive */}
            {isOpen && (
                <div className="chat-container relative">
                    <div className="absolute bottom-full right-0 mb-2 w-[90vw] max-w-md sm:w-80 rounded-t-lg shadow-xl overflow-hidden border border-gray-200 bg-white">
                        {/* Header */}
                        <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <BsRobot className="text-xl" />
                                <h3 className="font-bold text-lg">AI Assistant</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                                aria-label="Close chat"
                            >
                                <FiX className="text-lg" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="h-[50vh] sm:h-80 p-4 overflow-y-auto bg-gray-50">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-2 rounded-lg ${message.sender === 'user'
                                            ? 'bg-blue-500 text-white rounded-br-none'
                                            : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
                                    >
                                        <p className="text-sm break-words">{message.text}</p>
                                        <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start mb-4">
                                    <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none max-w-[80%]">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-gray-200 p-3 bg-white">
                            <div className="flex items-center">
                                <textarea
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    rows={1}
                                    className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    style={{ minHeight: '44px', maxHeight: '120px' }}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={inputValue.trim() === ''}
                                    className={`bg-blue-600 text-white px-4 py-2 rounded-r-lg h-[44px] ${inputValue.trim() === '' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'} transition-colors`}
                                    aria-label="Send message"
                                >
                                    <FiSend className="text-lg" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                                AI assistant may produce inaccurate information
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chat-button flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                aria-label={isOpen ? "Close chat" : "Open chat"}
            >
                {isOpen ? (
                    <FiX className="text-2xl" />
                ) : (
                    <div className="relative">
                        <IoMdChatbubbles className="text-2xl" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ChatBot;