import { useLocalStorage } from '@vueuse/core';
import type { AgentDto, Agent, PreviewDto } from '~/types';

export const useAgentsStore = defineStore('agents', () => {
  const loading = ref(false);
  const agents = ref<Agent[]>([]);
  const previews = ref<Record<string, PreviewDto>>({}); // agentId -> preview

  async function getAgents(): Promise<void> {
    try {
      loading.value = true;
      const res = await $fetch<AgentDto[]>('/api/v1/agents', {
        headers: { 'Cache-Control': 'max-age=86400' }, // Cache for 1 day
      });
      agents.value = res.map(({ _id, name, rate, image, createdAt }) => {
        return { id: _id, name, rate, image, createdAt, route: name.toLowerCase().replace(/\s/g, '-') };
      });
    } catch (error) {
      console.warn('[AGENTS] Error fetching agents:', error);
      agents.value = [];
    } finally {
      loading.value = false;
    }
  }

  function readPreviewCache(agentId: string): PreviewDto | null {
    const previewCookie = useLocalStorage(`preview-${agentId}`, null);
    if (previewCookie.value) {
      try {
        const data: PreviewDto = JSON.parse(previewCookie.value);
        if (data.audio) return data;
      } catch (error) {}
    }
    return null;
  }

  function writePreviewCache(agentId: string, data: PreviewDto): void {
    try {
      useLocalStorage(`preview-${agentId}`, JSON.stringify(data)); // Unlimited duration
    } catch (error) {} // Might be full
  }

  /**
   * Fetches the agent preview data. Returns base64 wav audio data.
   */
  async function getAgentPreview(agent: Agent): Promise<void> {
    const agentId = agent.id;
    if (previews.value[agentId]) return; // Already fetched
    const previewCookie = readPreviewCache(agentId);
    if (previewCookie) {
      previews.value[agentId] = previewCookie;
      return; // Already stored in local storage
    }
    try {
      loading.value = true;
      const res = await $fetch<PreviewDto>(`/api/v1/agents/preview?agentId=${agentId}`, {
        method: 'POST',
        headers: { 'Cache-Control': 'max-age=86400' }, // Cache for 1 day
      });
      writePreviewCache(agentId, res);
      previews.value[agentId] = res;
    } catch (error) {
      console.warn(`[PREVIEW] Error fetching ${agent.name} (id: ${agentId}) agent preview:`, error);
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
