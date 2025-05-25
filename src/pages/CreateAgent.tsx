
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Bot, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

const CreateAgent = () => {
  const [searchParams] = useSearchParams();
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
        name: "마케팅 보고서 도우미",
        purpose: "캠페인 성과 분석 및 보고서 자동 생성",
        targetUser: "마케팅 담당자",
        industry: "마케팅/광고"
      }
    },
    developer: {
      title: "개발자",
      suggestions: {
        name: "코드 리뷰 어시스턴트",
        purpose: "코드 품질 검토 및 개선 제안",
        targetUser: "소프트웨어 개발자",
        industry: "IT/소프트웨어"
      }
    },
    hr: {
      title: "HR/인사",
      suggestions: {
        name: "채용 면접 도우미",
        purpose: "면접 질문 생성 및 평가 기준 제시",
        targetUser: "HR 담당자",
        industry: "인사/채용"
      }
    },
    planner: {
      title: "기획자",
      suggestions: {
        name: "회의록 정리 AI",
        purpose: "회의 내용 요약 및 액션 아이템 추출",
        targetUser: "기획 담당자",
        industry: "기획/전략"
      }
    },
    sales: {
      title: "영업/세일즈",
      suggestions: {
        name: "영업 제안서 생성기",
        purpose: "고객 맞춤형 제안서 초안 작성",
        targetUser: "영업 담당자",
        industry: "영업/세일즈"
      }
    },
    cs: {
      title: "고객지원",
      suggestions: {
        name: "고객 응답 어시스턴트",
        purpose: "고객 문의 응답 템플릿 생성",
        targetUser: "고객지원 담당자",
        industry: "고객서비스"
      }
    }
  };

  const toneOptions = [
    { id: 'professional', label: '정중하고 전문적인', description: '비즈니스 환경에 적합한 공식적인 톤' },
    { id: 'creative', label: '창의적이고 친근한', description: '아이디어 발굴과 브레인스토밍에 적합' },
    { id: 'analytical', label: '분석적이고 정확한', description: '데이터 분석과 정확한 정보 전달에 중점' },
    { id: 'concise', label: '간결하고 요약 위주', description: '핵심만 빠르게 전달하는 효율적인 스타일' }
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
    // 완료 로직 - 실제로는 에이전트 생성 API 호출
    alert('에이전트가 성공적으로 생성되었습니다!');
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
                {currentStep === 1 && "이 에이전트가 무엇을 도와줄지 정의해주세요"}
                {currentStep === 2 && "누가 이 에이전트를 사용할지 알려주세요"}
                {currentStep === 3 && "에이전트의 커뮤니케이션 스타일을 선택해주세요"}
                {currentStep === 4 && "설정을 확인하고 에이전트를 생성하세요"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Name and Purpose */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">에이전트 이름</Label>
                    <Input
                      id="name"
                      placeholder="예: 마케팅 보고서 도우미"
                      value={agentData.name}
                      onChange={(e) => setAgentData({...agentData, name: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purpose">주요 목적</Label>
                    <Input
                      id="purpose"
                      placeholder="예: 캠페인 성과 분석 및 보고서 자동 생성"
                      value={agentData.purpose}
                      onChange={(e) => setAgentData({...agentData, purpose: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Target User */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="targetUser">주요 사용자</Label>
                    <Input
                      id="targetUser"
                      placeholder="예: 마케팅 팀 담당자"
                      value={agentData.targetUser}
                      onChange={(e) => setAgentData({...agentData, targetUser: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">업종/분야</Label>
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
                  <Label>커뮤니케이션 스타일</Label>
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
