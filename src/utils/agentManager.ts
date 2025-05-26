
export interface AgentData {
  id: string;
  name: string;
  purpose: string;
  tone: string;
  targetUser: string;
  industry: string;
  created: Date;
}

export class AgentManager {
  private static readonly STORAGE_KEY = 'created_agents';
  private static readonly CURRENT_AGENT_KEY = 'current_agent';

  static saveAgent(agentData: Omit<AgentData, 'id' | 'created'>): AgentData {
    const agent: AgentData = {
      ...agentData,
      id: Date.now().toString(),
      created: new Date()
    };

    const agents = this.getAllAgents();
    agents.push(agent);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(agents));
    
    this.setCurrentAgent(agent);
    return agent;
  }

  static getAllAgents(): AgentData[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static setCurrentAgent(agent: AgentData): void {
    localStorage.setItem(this.CURRENT_AGENT_KEY, JSON.stringify(agent));
  }

  static getCurrentAgent(): AgentData | null {
    const stored = localStorage.getItem(this.CURRENT_AGENT_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  static deleteAgent(id: string): void {
    const agents = this.getAllAgents().filter(agent => agent.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(agents));
  }
}
