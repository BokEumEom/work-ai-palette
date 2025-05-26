
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, ArrowLeft, Settings, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GeminiService } from "@/services/geminiApi";
import { useToast } from "@/hooks/use-toast";
import { ApiKeyManager } from "@/utils/apiKeyManager";
import { AgentManager, AgentData } from "@/utils/agentManager";
import { PromptGenerator } from "@/utils/promptGenerator";

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const AgentChat = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<AgentData | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 현재 에이전트 로드
    const agent = AgentManager.getCurrentAgent();
    if (!agent) {
      navigate('/create-agent');
      return;
    }
    setCurrentAgent(agent);

    // 저장된 API 키 확인
    const savedApiKey = ApiKeyManager.getApiKey();
    if (savedApiKey) {
      const service = new GeminiService(savedApiKey);
      setGeminiService(service);
      
      // 환영 메시지 추가
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'agent',
        content: `안녕하세요! 저는 ${agent.name}입니다. ${agent.purpose}를 도와드릴 수 있어요. 무엇을 도와드릴까요?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    } else {
      setShowApiKeyInput(true);
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleApiKeySubmit = () => {
    if (!ApiKeyManager.validateApiKey(apiKey)) {
      toast({
        title: "잘못된 API 키",
        description: "유효한 Gemini API 키를 입력해주세요. (AIza로 시작해야 합니다)",
        variant: "destructive",
      });
      return;
    }

    try {
      ApiKeyManager.saveApiKey(apiKey);
      const service = new GeminiService(apiKey);
      setGeminiService(service);
      setShowApiKeyInput(false);
      
      if (currentAgent) {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          type: 'agent',
          content: `안녕하세요! 저는 ${currentAgent.name}입니다. ${currentAgent.purpose}를 도와드릴 수 있어요. 무엇을 도와드릴까요?`,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }

      toast({
        title: "연결 완료",
        description: "Gemini API가 성공적으로 연결되었습니다.",
      });
    } catch (error) {
      toast({
        title: "연결 실패",
        description: "API 키 설정에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !geminiService || isLoading || !currentAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const systemPrompt = PromptGenerator.generateSystemPrompt(currentAgent);
      const response = await geminiService.generateResponse(input.trim(), { systemPrompt });
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      toast({
        title: "오류 발생",
        description: "메시지 전송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetApiKey = () => {
    ApiKeyManager.removeApiKey();
    setGeminiService(null);
    setShowApiKeyInput(true);
    setMessages([]);
    toast({
      title: "API 키 삭제",
      description: "API 키가 삭제되었습니다.",
    });
  };

  const handleClearChat = () => {
    setMessages([]);
    if (currentAgent) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'agent',
        content: `안녕하세요! 저는 ${currentAgent.name}입니다. ${currentAgent.purpose}를 도와드릴 수 있어요. 무엇을 도와드릴까요?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showApiKeyInput) {
        handleApiKeySubmit();
      } else {
        handleSendMessage();
      }
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AgentMe</span>
          </Link>
          <Link to="/create-agent">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              에이전트 설계로
            </Button>
          </Link>
        </header>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">API 키 설정</CardTitle>
                <p className="text-gray-600">Gemini API 키를 입력하여 AI 에이전트를 활성화하세요</p>
                <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg mt-2">
                  API 키는 안전하게 브라우저에 저장되며 한 번만 입력하면 됩니다.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Gemini API Key</label>
                  <Input
                    type="password"
                    placeholder="AIza로 시작하는 API 키를 입력하세요"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Google AI Studio에서 API 키 받기
                    </a>
                  </p>
                </div>
                <Button onClick={handleApiKeySubmit} className="w-full">
                  연결하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!currentAgent) {
    return <div>에이전트를 불러오는 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">AgentMe</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleClearChat}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            대화 초기화
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetApiKey}
          >
            <Settings className="h-4 w-4 mr-2" />
            API 재설정
          </Button>
          <Link to="/create-agent">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              에이전트 설계로
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="h-[600px] flex flex-col shadow-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{currentAgent.name}</CardTitle>
                  <p className="text-sm text-gray-600">{currentAgent.purpose}</p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                <div>대상: {currentAgent.targetUser}</div>
                <div>분야: {currentAgent.industry}</div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.type === 'agent' && (
                          <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        {message.type === 'user' && (
                          <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="메시지를 입력하세요..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={isLoading || !input.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AgentChat;
