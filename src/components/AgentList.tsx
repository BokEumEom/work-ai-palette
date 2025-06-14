
import React, { useEffect, useState } from "react";
import { AgentManager, AgentData } from "@/utils/agentManager";
import { Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AgentListProps {
  onSelect?: (agent: AgentData) => void;
}

const AgentList: React.FC<AgentListProps> = ({ onSelect }) => {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [current, setCurrent] = useState<AgentData | null>(null);

  useEffect(() => {
    setAgents(AgentManager.getAllAgents());
    setCurrent(AgentManager.getCurrentAgent());
  }, []);

  const handleSelect = (agent: AgentData) => {
    AgentManager.setCurrentAgent(agent);
    setCurrent(agent);
    if (onSelect) onSelect(agent);
  };

  const handleDelete = (id: string) => {
    AgentManager.deleteAgent(id);
    const updated = AgentManager.getAllAgents();
    setAgents(updated);

    // If selected agent was deleted, reset current agent
    if (current && current.id === id) {
      const nextCurrent = updated.length > 0 ? updated[0] : null;
      if (nextCurrent) {
        AgentManager.setCurrentAgent(nextCurrent);
        setCurrent(nextCurrent);
      } else {
        AgentManager.setCurrentAgent(null as any);
        setCurrent(null);
      }
    }
  };

  return (
    <div className="p-4 bg-card shadow rounded-xl space-y-2 max-w-md mx-auto">
      <div className="mb-2 font-semibold text-lg">에이전트 목록</div>
      {agents.length === 0 && (
        <div className="text-muted-foreground">에이전트를 생성해보세요!</div>
      )}
      <ul className="space-y-1">
        {agents.map(agent => (
          <li
            key={agent.id}
            className={cn(
              "flex items-center justify-between px-2 py-1 rounded hover:bg-accent",
              current && current.id === agent.id && "bg-primary/10 font-bold"
            )}
          >
            <button
              className="flex-1 text-left truncate"
              onClick={() => handleSelect(agent)}
              aria-current={current && current.id === agent.id}
            >
              <span className="truncate">{agent.name}</span>
            </button>
            <div className="flex gap-1 items-center ml-2">
              {/* 별 아이콘 - 즐겨찾기(차후 확장용, 현재 비활성화) */}
              <Star className="w-4 h-4 text-muted-foreground opacity-40" />
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => handleDelete(agent.id)}
                title="삭제"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
                <span className="sr-only">삭제</span>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentList;

