import { useLocalStorage } from '@vueuse/core';
import type { AgentDto, Agent, PreviewDto } from '~/types';

export const useAgentsStore = defineStore('agents', () => {
  const loading = ref(false);
  const agents = ref<Agent[]>(
    Array.from({ length: 33 }, (_, index) => ({
      id: index.toString(),
      name: ``,
      image: '',
      rate: 0,
      createdAt: '3days',
      createdBy: 'Jitaru',
      route: '',
      tokenName: 'token1',
      mcap: Number((Math.random() * 10000).toFixed(2)),
      price: Number((Math.random() * 100).toFixed(2)),
      contract: '0x1cd9a56c8c2ea913c70319a44da75e99255aa46f',
      liquidity: Number((Math.random() * 10000).toFixed(2)),
      volume24h: Number((Math.random() * 500).toFixed(2)),
      change5m: Number((Math.random() * 10).toFixed(2)),
      change1h: Number((Math.random() * 10).toFixed(2)),
      change24h: Number((Math.random() * 10).toFixed(2)),
      change7d: Number((Math.random() * 20).toFixed(2)),
      holders: Math.floor(Math.random() * 1000)
    }))
  );
  const previews = ref<Record<string, PreviewDto>>({}); // agentId -> preview

  async function getAgents(): Promise<void> {
    try {
      loading.value = true;
      const res = await $fetch<AgentDto[]>('/api/v1/agents', {
        headers: { 'Cache-Control': 'max-age=86400' },
      });
      agents.value = res.map(({ _id, name, rate, image, createdAt }) => {
        return {
          id: _id,
          name,
          image,
          rate,
          createdAt: '3days',
          createdBy: 'Jitaru',
          route: name.toLowerCase().replace(/\s/g, '-'),
          tokenName: 'token1',
          mcap: Number((Math.random() * 10000).toFixed(2)),
          price: Number((Math.random() * 100).toFixed(2)),
          contract: '0x1cd9a56c8c2ea913c70319a44da75e99255aa46f',
          liquidity: Number((Math.random() * 10000).toFixed(2)),
          volume24h: Number((Math.random() * 500).toFixed(2)),
          change5m: Number((Math.random() * 10).toFixed(2)),
          change1h: Number((Math.random() * 10).toFixed(2)),
          change24h: Number((Math.random() * 10).toFixed(2)),
          change7d: Number((Math.random() * 20).toFixed(2)),
          holders: Math.floor(Math.random() * 1000)
        };
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
      } catch (error) { }
    }
    return null;
  }

  function writePreviewCache(agentId: string, data: PreviewDto): void {
    try {
      useLocalStorage(`preview-${agentId}`, JSON.stringify(data)); // Unlimited duration
    } catch (error) { } // Might be full
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
