import { useLocalStorage } from '@vueuse/core';
import type { AgentDto, Agent, PreviewDto, AgentsResponse, AgentTradesResponse, Trade, UserDetailsResponse } from '~/types';

export const useAgentsStore = defineStore('agents', () => {
  const loading = ref(false);
  const agents = ref<Agent[]>([]);
  const previews = ref<Record<string, PreviewDto>>({});
  const config = ref<{ createAgentFees: string; chainId: number } | null>(null);
  const agentComments = ref<Record<string, any>>({});
  const tokenHolders = ref<Record<string, any>>({});
  const agentTrades = ref<Record<string, AgentTradesResponse>>({});
  const userDetails = ref<UserDetailsResponse | null>(null);

  async function getAgents(): Promise<void> {
    try {
      loading.value = true;
      const res = await $fetch<AgentsResponse>('https://api.vocal.fun/api/v1/launchpad/agents');
      agents.value = res.agents.map(({ _id, name, rate, imageUrl, createdAt }) => ({
        id: _id,
        name,
        image: imageUrl,
        rate: rate !== undefined ? rate : Number((Math.random() * 10).toFixed(2)),
        createdAt: createdAt || '3days',
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
        comments: { comments: [] },
        tokenHolders: { holders: { holders: [], total: 0 } },
        trades: { trades: [] },
      }));

      await Promise.all(
        agents.value.map(async (agent) => {
          await Promise.all([getAgentComments(agent.id), getTokenHolders(agent.id), getAgentTrades(agent.id)]);
          agent.comments = agentComments.value[agent.id];
          agent.tokenHolders = tokenHolders.value[agent.id];
          agent.trades = agentTrades.value[agent.id];
        })
      );
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
      useLocalStorage(`preview-${agentId}`, JSON.stringify(data));
    } catch (error) {
      // Might be full; ignore.
    }
  }

  /**
   * Fetches the agent preview data. Returns base64 wav audio data.
   */
  async function getAgentPreview(agent: Agent): Promise<void> {
    const agentId = agent.id;
    if (previews.value[agentId]) return;
    const previewCache = readPreviewCache(agentId);
    if (previewCache) {
      previews.value[agentId] = previewCache;
      return;
    }
    try {
      loading.value = true;
      const res = await $fetch<PreviewDto>(`/api/v1/agents/preview?agentId=${agentId}`, {
        method: 'POST',
        headers: { 'Cache-Control': 'max-age=86400' },
      });
      console.info('result agent preview', res);
      writePreviewCache(agentId, res);
      previews.value[agentId] = res;
    } catch (error) {
      console.warn(`[PREVIEW] Error fetching ${agent.name} (id: ${agentId}) agent preview:`, error);
    } finally {
      loading.value = false;
    }
  }

  async function getConfig(): Promise<void> {
    try {
      loading.value = true;
      const res = await $fetch<{ createAgentFees: string; chainId: number }>(
        'https://api.vocal.fun/api/v1/launchpad/config'
      );
      console.info('res', res);
      config.value = res;
    } catch (error) {
      console.warn('[CONFIG] Error fetching configuration:', error);
      config.value = null;
    } finally {
      loading.value = false;
    }
  }

  async function getAgentComments(agentId: string): Promise<void> {
    try {
      const res = await $fetch(`https://api.vocal.fun/api/v1/launchpad/comments/${agentId}`);
      agentComments.value[agentId] = res;
    } catch (error) {
      console.warn(`[AGENT COMMENTS] Error fetching comments for agent ${agentId}:`, error);
      agentComments.value[agentId] = null;
    }
  }

  async function getTokenHolders(agentId: string): Promise<void> {
    try {
      const res = await $fetch(`https://api.vocal.fun/api/v1/launchpad/holders/${agentId}`);
      tokenHolders.value[agentId] = res;
    } catch (error) {
      console.warn(`[TOKEN HOLDERS] Error fetching holders for agent ${agentId}:`, error);
      tokenHolders.value[agentId] = null;
    }
  }

  async function getCommentsForAllAgents(): Promise<void> {
    try {
      loading.value = true;
      const promises = agents.value.map((agent) => getAgentComments(agent.id));
      await Promise.all(promises);
    } catch (error) {
      console.warn('[ALL AGENT COMMENTS] Error fetching comments for all agents:', error);
    } finally {
      loading.value = false;
    }
  }

  async function getAgentTrades(agentId: string): Promise<void> {
    try {
      const res = await $fetch<{ trades: { trades: Trade[]; total: number } }>(
        `https://api.vocal.fun/api/v1/launchpad/trades/${agentId}`
      );
      agentTrades.value[agentId] = { trades: res.trades.trades };
    } catch (error) {
      console.warn(`[AGENT TRADES] Error fetching trades for agent ${agentId}:`, error);
      agentTrades.value[agentId] = { trades: [] };
    }
  }


  async function getTradesForAllAgents(): Promise<void> {
    try {
      loading.value = true;
      const promises = agents.value.map((agent) => getAgentTrades(agent.id));
      await Promise.all(promises);
    } catch (error) {
      console.warn('[ALL AGENT TRADES] Error fetching trades for all agents:', error);
    } finally {
      loading.value = false;
    }
  }

  async function getUserDetails(userId: string): Promise<void> {
    try {
      loading.value = true;
      const res = await $fetch<UserDetailsResponse>(`https://api.vocal.fun/api/v1/launchpad/user/${userId}`);
      userDetails.value = res;
    } catch (error) {
      console.warn(`[USER DETAILS] Error fetching details for user ${userId}:`, error);
      userDetails.value = null;
    } finally {
      loading.value = false;
    }
  }



  return {
    loading,
    agents,
    config,
    previews,
    agentComments,
    tokenHolders,
    userDetails,
    getAgents,
    getAgentPreview,
    getConfig,
    getCommentsForAllAgents,
    getUserDetails,
    getTradesForAllAgents,
  };
});
