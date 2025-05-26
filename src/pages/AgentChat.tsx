
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send, ArrowLeft, Settings } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { GeminiService } from "@/services/geminiApi";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

const AgentChat = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [geminiService, setGeminiService] = useState<GeminiService | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock agent data - 실제로는 URL params나 localStorage에서 가져올 수 있음
  const agentData = {
    name: "마케팅 보고서 도우미",
    purpose: "캠페인 성과 분석 및 보고서 자동 생성",
    targetUser: "마케팅 담당자",
    tone: "professional"
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleApiKeySubmit = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API 키 필요",
        description: "Gemini API 키를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const service = new GeminiService(apiKey);
      setGeminiService(service);
      setShowApiKeyInput(false);
      
      // 환영 메시지 추가
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'agent',
        content: `안녕하세요! 저는 ${agentData.name}입니다. ${agentData.purpose}를 도와드릴 수 있어요. 무엇을 도와드릴까요?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);

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
    if (!input.trim() || !geminiService || isLoading) return;

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
      const response = await geminiService.generateResponse(input.trim(), agentData);
      
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
        description: "메시지 전송에 실패했습니다. API 키를 확인해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Gemini API Key</label>
                  <Input
                    type="password"
                    placeholder="AIza..."
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">AgentMe</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowApiKeyInput(true)}
          >
            <Settings className="h-4 w-4 mr-2" />
            API 설정
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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{agentData.name}</CardTitle>
                <p className="text-sm text-gray-600">{agentData.purpose}</p>
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
