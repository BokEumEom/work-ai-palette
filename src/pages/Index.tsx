
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Bot, Users, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-blue-600" />,
      title: "직무별 맞춤 에이전트",
      description: "마케터, 개발자, HR 등 내 직무에 최적화된 AI 에이전트를 10분 만에 설계"
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      title: "즉시 사용 가능한 템플릿",
      description: "검증된 워크플로우와 프롬프트로 바로 업무에 적용 가능"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "팀 협업 최적화",
      description: "팀원들과 AI 에이전트를 공유하고 조직의 AI 문화 확산"
    }
  ];

  const jobExamples = [
    "마케터 - 보고서 자동화 에이전트",
    "개발자 - 코드 리뷰 & 정리 GPT",
    "HR - 면접 피드백 생성 도우미",
    "기획자 - 회의록 요약 에이전트"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">AgentMe</span>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">기능</a>
          <a href="#examples" className="text-gray-600 hover:text-blue-600 transition-colors">활용 예시</a>
          <Link to="/jobs" className="text-gray-600 hover:text-blue-600 transition-colors">시작하기</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            나의 직무에 맞는 
            <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"> AI를 10분</span>
            <br />만에 설계해드립니다
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            복잡한 AI 프롬프트 고민은 그만! 내 업무에 딱 맞는 전용 AI 에이전트를 쉽고 빠르게 만들어보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/jobs">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              활용 예시 보기
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            왜 AgentMe인가요?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI 활용이 어려웠던 직장인들을 위한 가장 쉬운 솔루션
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              이런 에이전트를 만들 수 있어요
            </h2>
            <p className="text-xl text-gray-600">
              각 직무별로 검증된 AI 에이전트 템플릿
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {jobExamples.map((example, index) => (
              <div key={index} className="flex items-center p-6 bg-white rounded-lg shadow-md">
                <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-lg text-gray-800">{example}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            지금 바로 시작해보세요
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            10분이면 충분합니다. 내 업무를 혁신할 AI 에이전트를 만나보세요.
          </p>
          <Link to="/jobs">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-12 py-4 text-lg">
              AgentMe 시작하기
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="h-6 w-6" />
            <span className="text-xl font-bold">AgentMe</span>
          </div>
          <p className="text-gray-400">
            직무별 맞춤형 AI 에이전트 설계 플랫폼
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
