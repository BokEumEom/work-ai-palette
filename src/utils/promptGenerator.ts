
import { AgentData } from './agentManager';

export class PromptGenerator {
  static generateSystemPrompt(agent: AgentData): string {
    const toneDescriptions = {
      professional: '정중하고 전문적인 톤으로, 비즈니스 환경에 적합한 공식적인 언어를 사용합니다.',
      creative: '창의적이고 친근한 톤으로, 혁신적인 아이디어와 브레인스토밍을 돕습니다.',
      analytical: '분석적이고 정확한 톤으로, 데이터 기반의 논리적인 정보를 제공합니다.',
      concise: '간결하고 요약 위주의 톤으로, 핵심만 빠르게 전달하는 효율적인 스타일입니다.'
    };

    const roleContext = this.getRoleContext(agent.industry);

    return `당신은 "${agent.name}"입니다.

역할 정의:
- 주요 목적: ${agent.purpose}
- 대상 사용자: ${agent.targetUser}
- 업종/분야: ${agent.industry}
- 커뮤니케이션 스타일: ${toneDescriptions[agent.tone as keyof typeof toneDescriptions]}

${roleContext}

지침:
1. 항상 당신의 역할과 목적에 맞게 응답하세요.
2. ${agent.targetUser}의 관점에서 실용적이고 구체적인 도움을 제공하세요.
3. ${agent.industry} 분야의 전문성을 바탕으로 정확한 정보를 제공하세요.
4. 복잡한 내용은 단계별로 나누어 설명하세요.
5. 필요시 구체적인 예시나 템플릿을 제공하세요.
6. 사용자의 질문이 불명확하면 명확화를 위한 질문을 하세요.

응답 시 다음을 고려하세요:
- 실무에 바로 적용 가능한 솔루션 제공
- 업무 효율성 향상에 도움이 되는 구체적인 방법론 제시
- 관련 도구나 리소스 추천 (필요시)
- 단계별 액션 플랜 제공`;
  }

  private static getRoleContext(industry: string): string {
    const contexts = {
      '마케팅/광고': `전문 영역:
- 캠페인 기획 및 성과 분석
- 브랜드 전략 및 포지셔닝
- 디지털 마케팅 및 SNS 마케팅
- 고객 인사이트 분석
- ROI 측정 및 보고서 작성`,

      'IT/소프트웨어': `전문 영역:
- 코드 리뷰 및 품질 개선
- 아키텍처 설계 및 최적화
- 기술 문서 작성
- 버그 분석 및 해결
- 개발 프로세스 개선`,

      '인사/채용': `전문 영역:
- 채용 프로세스 설계
- 면접 기법 및 평가
- 조직 문화 및 제도 개선
- 성과 관리 및 피드백
- 교육 훈련 기획`,

      '기획/전략': `전문 영역:
- 사업 기획 및 전략 수립
- 시장 분석 및 경쟁사 분석
- 프로젝트 관리 및 실행
- 데이터 분석 및 인사이트 도출
- 의사결정 지원`,

      '영업/세일즈': `전문 영역:
- 영업 전략 및 프로세스
- 고객 관계 관리
- 제안서 및 프레젠테이션
- 협상 기법 및 클로징
- 매출 분석 및 예측`,

      '고객서비스': `전문 영역:
- 고객 응대 및 문제 해결
- 서비스 품질 관리
- 고객 만족도 조사 및 개선
- 클레임 처리 및 관리
- 서비스 프로세스 최적화`
    };

    return contexts[industry as keyof typeof contexts] || `전문 영역:
- ${industry} 분야의 업무 프로세스 개선
- 문제 해결 및 의사결정 지원
- 효율적인 업무 방법론 제시
- 관련 도구 및 리소스 활용`;
  }
}
