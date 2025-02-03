import type { AgentDto, PreviewDto } from '~/types';

export const useAgentsStore = defineStore('agents', () => {
  const loading = ref(false);
  const agents = ref<AgentDto[]>([]);
  const previews = ref<Record<string, PreviewDto>>({}); // agentId -> preview

  async function getAgents(): Promise<void> {
    try {
      loading.value = true;
      const res = await $fetch<AgentDto[]>('/api/v1/agents');
      agents.value = res;
    } catch (error) {
      console.warn('[AGENTS] Error fetching agents:', error);
      agents.value = [];
    } finally {
      loading.value = false;
    }
  }

  /**
   * Fetches the agent preview data. Returns base64 wav audio data.
   */
  async function getAgentPreview(agent: AgentDto): Promise<void> {
    if (previews.value[agent._id]) return; // Already fetched
    try {
      loading.value = true;
      const res = await $fetch<PreviewDto>(`/api/v1/agents/preview?agentId=${agent._id}`, {
        method: 'POST',
      });
      previews.value[agent._id] = res;
    } catch (error) {
      console.warn(`[PREVIEW] Error fetching ${agent.name} (id: ${agent._id}) agent preview:`, error);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    agents,
    previews,
    getAgents,
    getAgentPreview,
  };
});
