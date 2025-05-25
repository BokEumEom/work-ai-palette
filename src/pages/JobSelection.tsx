
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Monitor, 
  TrendingUp, 
  Users, 
  FileText, 
  Phone, 
  Headphones,
  ArrowRight,
  Bot
} from "lucide-react";
import { Link } from "react-router-dom";

const JobSelection = () => {
  const jobs = [
    {
      id: "marketer",
      title: "마케터",
      description: "캠페인 기획, 성과 분석, 보고서 작성",
      icon: <TrendingUp className="h-12 w-12 text-blue-600" />,
      templates: ["보고서 자동화", "캠페인 아이디어 생성", "성과 분석"],
      color: "border-blue-200 hover:border-blue-400"
    },
    {
      id: "developer",
      title: "개발자",
      description: "코드 리뷰, 문서화, 기술 조사",
      icon: <Monitor className="h-12 w-12 text-green-600" />,
      templates: ["코드 리뷰", "API 문서 생성", "버그 분석"],
      color: "border-green-200 hover:border-green-400"
    },
    {
      id: "hr",
      title: "HR/인사",
      description: "채용, 면접, 직원 관리",
      icon: <Users className="h-12 w-12 text-purple-600" />,
      templates: ["면접 질문 생성", "직무 기술서 작성", "평가 피드백"],
      color: "border-purple-200 hover:border-purple-400"
    },
    {
      id: "planner",
      title: "기획자",
      description: "프로젝트 기획, 요구사항 정리, 전략 수립",
      icon: <FileText className="h-12 w-12 text-orange-600" />,
      templates: ["회의록 요약", "기획서 구조화", "아이디어 정리"],
      color: "border-orange-200 hover:border-orange-400"
    },
    {
      id: "sales",
      title: "영업/세일즈",
      description: "고객 관리, 제안서 작성, 영업 전략",
      icon: <Phone className="h-12 w-12 text-red-600" />,
      templates: ["제안서 초안", "고객 분석", "영업 이메일"],
      color: "border-red-200 hover:border-red-400"
    },
    {
      id: "cs",
      title: "고객지원",
      description: "고객 응대, 문제 해결, FAQ 관리",
      icon: <Headphones className="h-12 w-12 text-teal-600" />,
      templates: ["응답 템플릿", "FAQ 생성", "문제 해결 가이드"],
      color: "border-teal-200 hover:border-teal-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Bot className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">AgentMe</span>
        </Link>
        <Link to="/">
          <Button variant="outline">돌아가기</Button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            어떤 직무이신가요?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            귀하의 직무를 선택하시면 맞춤형 AI 에이전트 템플릿을 추천해드립니다
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {jobs.map((job) => (
            <Card 
              key={job.id} 
              className={`${job.color} border-2 transition-all duration-300 hover:shadow-lg cursor-pointer group`}
            >
              <Link to={`/create-agent?job=${job.id}`}>
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {job.icon}
                  </div>
                  <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {job.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">추천 에이전트:</h4>
                    <ul className="space-y-2">
                      {job.templates.map((template, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <ArrowRight className="h-4 w-4 mr-2 text-gray-400" />
                          {template}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button className="w-full group-hover:bg-blue-600 transition-colors">
                      선택하기
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            원하는 직무가 없나요?
          </p>
          <Link to="/create-agent?job=custom">
            <Button variant="outline" className="px-8">
              직접 설계하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobSelection;
