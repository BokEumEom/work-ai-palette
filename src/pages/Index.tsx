import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ApiKeyManager } from "@/utils/apiKeyManager";
import { useNavigate } from "react-router-dom";
import AgentList from "@/components/AgentList";

const Index = () => {
  const navigate = useNavigate();
  const hasApiKey = ApiKeyManager.hasApiKey();

  const handleGetStarted = () => {
    if (hasApiKey) {
      navigate("/jobs");
    } else {
      // Prompt for API key
      const apiKey = prompt("Please enter your Gemini API key:");
      if (apiKey && ApiKeyManager.validateApiKey(apiKey)) {
        ApiKeyManager.saveApiKey(apiKey);
        navigate("/jobs");
      } else if (apiKey) {
        alert("Invalid API key format. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 기존 인덱스 페이지 내용 */}
      {/* 에이전트 목록 관리 기능 추가 */}
      <div className="max-w-4xl mx-auto pt-10 flex flex-col md:flex-row gap-8">
        <section className="md:w-1/2">
          <AgentList />
        </section>
        <section className="md:w-1/2">
          <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl shadow">
            <h1 className="text-3xl font-bold mb-4">AI Agent Creator</h1>
            <p className="text-center text-muted-foreground mb-6">
              Create custom AI agents tailored to your specific needs
            </p>
            <div className="flex gap-4">
              <Button onClick={handleGetStarted} size="lg">
                Get Started
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/create-agent">Create Agent</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
