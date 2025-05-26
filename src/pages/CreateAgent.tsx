import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Bot, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AgentManager } from "@/utils/agentManager";

const CreateAgent = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const jobType = searchParams.get('job') || 'custom';
  const [currentStep, setCurrentStep] = useState(1);
  const [agentData, setAgentData] = useState({
    name: '',
    purpose: '',
    tone: '',
    targetUser: '',
    industry: ''
  });

  const jobTemplates = {
    marketer: {
      title: "마케터",
      suggestions: {
        name: "마케팅 전략 어시스턴트",
        purpose: "캠페인 기획, 성과 분석, 고객 인사이트 도출 및 마케팅 전략 수립 지원",
        targetUser: "마케팅 담당자 및 브랜드 매니저",
        industry: "마케팅/광고"
      }
    },
    developer: {
      title: "개발자",
      suggestions: {
        name: "코드 리뷰 & 아키텍처 어드바이저",
        purpose: "코드 품질 향상, 아키텍처 설계, 기술 문서 작성 및 개발 프로세스 최적화",
        targetUser: "소프트웨어 개발자 및 팀 리더",
        industry: "IT/소프트웨어"
      }
    },
    hr: {
      title: "HR/인사",
      suggestions: {
        name: "인재 채용 & 조직 문화 컨설턴트",
        purpose: "채용 프로세스 설계, 면접 가이드, 조직 문화 개선 및 인사 제도 기획",
        targetUser: "HR 담당자 및 인사팀",
        industry: "인사/채용"
      }
    },
    planner: {
      title: "기획자",
      suggestions: {
        name: "전략 기획 & 프로젝트 매니저",
        purpose: "사업 기획, 시장 분석, 프로젝트 관리 및 데이터 기반 의사결정 지원",
        targetUser: "기획 담당자 및 PM",
        industry: "기획/전략"
      }
    },
    sales: {
      title: "영업/세일즈",
      suggestions: {
        name: "영업 전략 & 고객 관계 전문가",
        purpose: "영업 전략 수립, 고객 관계 관리, 제안서 작성 및 영업 프로세스 최적화",
        targetUser: "영업 담당자 및 세일즈 매니저",
        industry: "영업/세일즈"
      }
    },
    cs: {
      title: "고객지원",
      suggestions: {
        name: "고객 경험 & 서비스 품질 전문가",
        purpose: "고객 응대 가이드, 서비스 품질 관리, 고객 만족도 향상 및 클레임 해결",
        targetUser: "고객지원 담당자 및 CS팀",
        industry: "고객서비스"
      }
    }
  };

  const toneOptions = [
    { id: 'professional', label: '정중하고 전문적인', description: '비즈니스 환경에 적합한 공식적인 톤으로 신뢰성 있는 조언 제공' },
    { id: 'creative', label: '창의적이고 친근한', description: '혁신적인 아이디어와 브레인스토밍에 적합한 열린 사고의 톤' },
    { id: 'analytical', label: '분석적이고 정확한', description: '데이터 기반의 논리적 분석과 정확한 정보 전달에 중점' },
    { id: 'concise', label: '간결하고 요약 위주', description: '핵심만 빠르게 전달하는 효율적이고 실용적인 스타일' }
  ];

  useEffect(() => {
    if (jobType !== 'custom' && jobTemplates[jobType as keyof typeof jobTemplates]) {
      const template = jobTemplates[jobType as keyof typeof jobTemplates];
      setAgentData({
        ...agentData,
        ...template.suggestions
      });
    }
  }, [jobType]);

  const progress = (currentStep / 4) * 100;

  const handleNext = () => {
    // 현재 단계 검증
    if (currentStep === 1 && (!agentData.name || !agentData.purpose)) {
      toast({
        title: "필수 정보 입력",
        description: "에이전트 이름과 목적을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep === 2 && (!agentData.targetUser || !agentData.industry)) {
      toast({
        title: "필수 정보 입력",
        description: "대상 사용자와 업종을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 3 && !agentData.tone) {
      toast({
        title: "스타일 선택",
        description: "커뮤니케이션 스타일을 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    try {
      const savedAgent = AgentManager.saveAgent(agentData);
      
      toast({
        title: "에이전트 생성 완료!",
        description: `${savedAgent.name}이(가) 성공적으로 생성되었습니다.`,
      });

      // 챗 페이지로 이동
      navigate('/chat');
    } catch (error) {
      toast({
        title: "생성 실패",
        description: "에이전트 생성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">AgentMe</span>
        </Link>
        <Link to="/jobs">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            직무 선택으로
          </Button>
        </Link>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {jobType !== 'custom' && jobTemplates[jobType as keyof typeof jobTemplates]
                ? `${jobTemplates[jobType as keyof typeof jobTemplates].title} 에이전트 설계`
                : 'AI 에이전트 설계'}
            </h2>
            <span className="text-sm text-gray-600">{currentStep}/4 단계</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">
                {currentStep === 1 && "에이전트 이름과 목적"}
                {currentStep === 2 && "대상 사용자 정의"}
                {currentStep === 3 && "에이전트 스타일 선택"}
                {currentStep === 4 && "설정 확인 및 완료"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "이 에이전트가 무엇을 도와줄지 구체적으로 정의해주세요"}
                {currentStep === 2 && "누가 이 에이전트를 사용할지 명확히 해주세요"}
                {currentStep === 3 && "에이전트의 커뮤니케이션 스타일을 선택해주세요"}
                {currentStep === 4 && "설정을 확인하고 에이전트를 생성하세요"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Name and Purpose */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">에이전트 이름 *</Label>
                    <Input
                      id="name"
                      placeholder="예: 마케팅 전략 어시스턴트"
                      value={agentData.name}
                      onChange={(e) => setAgentData({...agentData, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">주요 목적 및 역할 *</Label>
                    <Input
                      id="purpose"
                      placeholder="예: 캠페인 기획, 성과 분석 및 마케팅 전략 수립 지원"
                      value={agentData.purpose}
                      onChange={(e) => setAgentData({...agentData, purpose: e.target.value})}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">구체적이고 명확한 목적을 작성하면 더 정확한 도움을 받을 수 있습니다.</p>
                  </div>
                </div>
              )}

              {/* Step 2: Target User */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="targetUser">주요 사용자 *</Label>
                    <Input
                      id="targetUser"
                      placeholder="예: 마케팅 담당자 및 브랜드 매니저"
                      value={agentData.targetUser}
                      onChange={(e) => setAgentData({...agentData, targetUser: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">업종/분야 *</Label>
                    <Input
                      id="industry"
                      placeholder="예: 마케팅/광고"
                      value={agentData.industry}
                      onChange={(e) => setAgentData({...agentData, industry: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Tone Selection */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <Label>커뮤니케이션 스타일 *</Label>
                  <div className="grid gap-3">
                    {toneOptions.map((option) => (
                      <Card
                        key={option.id}
                        className={`cursor-pointer transition-all ${
                          agentData.tone === option.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setAgentData({...agentData, tone: option.id})}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{option.label}</h4>
                              <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                            </div>
                            {agentData.tone === option.id && (
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">설정 확인</h3>
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">에이전트 이름:</span> {agentData.name}
                    </div>
                    <div>
                      <span className="font-medium">목적:</span> {agentData.purpose}
                    </div>
                    <div>
                      <span className="font-medium">사용자:</span> {agentData.targetUser}
                    </div>
                    <div>
                      <span className="font-medium">업종:</span> {agentData.industry}
                    </div>
                    <div>
                      <span className="font-medium">스타일:</span> {
                        toneOptions.find(t => t.id === agentData.tone)?.label || '미선택'
                      }
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium mb-1">생성 후 다음과 같은 기능을 사용할 수 있습니다:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>맞춤형 AI 대화 및 업무 지원</li>
                      <li>전문 분야별 정확한 조언 제공</li>
                      <li>선택한 스타일로 일관된 커뮤니케이션</li>
                      <li>언제든지 설정 변경 및 새 에이전트 생성 가능</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  이전
                </Button>

                {currentStep < 4 ? (
                  <Button onClick={handleNext}>
                    다음
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
                    에이전트 생성
                    <CheckCircle className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateAgent;
