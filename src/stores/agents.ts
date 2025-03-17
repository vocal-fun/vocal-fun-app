import { useLocalStorage } from '@vueuse/core';
import type {
  Agent,
  PreviewDto,
  AgentsResponse,
  Trade,
  UserDetailsResponse,
  CommentsApiResponse,
  TokenHoldersResponse,
  Comment,
} from '~/types';

export const useAgentsStore = defineStore('agents', () => {
  const loading = ref(false);
  const agents = ref<Agent[]>([]);
  
  const agentsPagination = ref({
    page: 1,
    limit: 20,
    sort: 'newest',
  });

  const agentComments = ref<Record<
    string,
    {
      data: Comment[];
      total: number;
      page: number;
      limit: number;
    }
  >>({});

  const tokenHolders = ref<Record<
    string,
    {
      holders: {
        holders: TokenHoldersResponse['holders']['holders'];
        total: number;
      };
      page: number;
      limit: number;
    }
    >>({});
  
  const agentTrades = ref<Record<
    string,
    {
      trades: Trade[];
      total: number;
      page: number;
      limit: number;
    }
    >>({});
  
  const config = ref<{ createAgentFees: string; chainId: number } | null>(null);
  const userDetails = ref<UserDetailsResponse | null>(null);
  const previews = ref<Record<string, PreviewDto>>({});

  async function getAgents(
    page = agentsPagination.value.page,
    limit = agentsPagination.value.limit,
    sort = agentsPagination.value.sort
  ): Promise<void> {
    try {
      loading.value = true;
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        sort: sort,
      });

      const url = `https://api.vocal.fun/api/v1/launchpad/agents?${queryParams.toString()}`;
      const res = await $fetch<AgentsResponse & { pagination: { page: number; limit: number } }>(url);
      agents.value = res.agents.map(({ _id, name, symbol, marketCap, currentPrice, createdBy, tokenAddress, rate, imageUrl, createdAt }) => ({
        id: _id,
        name,
        image: imageUrl,
        rate: rate !== undefined ? rate : Number((Math.random() * 10).toFixed(2)),
        createdAt: createdAt || '3days',
        createdBy: createdBy._id,
        route: name.toLowerCase().replace(/\s/g, '-'),
        tokenName: symbol,
        mcap: Number(marketCap),
        price: Number(currentPrice),
        contract: tokenAddress,
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

      agentsPagination.value.page = res.pagination.page;
      agentsPagination.value.limit = res.pagination.limit;

      await Promise.all(
        agents.value.map(async (agent) => {
          await Promise.all([
            getAgentComments(agent.id),
            getTokenHolders(agent.id),
            getAgentTrades(agent.id)
          ]);

          agent.comments = {
            comments: agentComments.value[agent.id]?.data ?? [],
          };

          agent.tokenHolders = {
            holders: {
              holders: tokenHolders.value[agent.id]?.holders.holders ?? [],
              total: tokenHolders.value[agent.id]?.holders.total ?? 0
            }
          };

          agent.trades = {
            trades: agentTrades.value[agent.id]?.trades ?? []
          };
        })
      );

    } catch (error) {
      console.warn('[AGENTS] Error fetching agents:', error);
      agents.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function getAgentComments(
    agentId: string,
    page = 1,
    limit = 20
  ): Promise<void> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const res = await $fetch<CommentsApiResponse>(
        `https://api.vocal.fun/api/v1/launchpad/comments/${agentId}?${params.toString()}`
      );
      agentComments.value[agentId] = {
        data: res.comments?.comments || [],
        total: res.comments?.total || 0,
        page: res.pagination.page,
        limit: res.pagination.limit,
      };
    } catch (error) {
      console.warn(`[AGENT COMMENTS] Error fetching comments for agent ${agentId}:`, error);
      agentComments.value[agentId] = {
        data: [],
        total: 0,
        page: 1,
        limit: 20,
      };
    }
  }

  async function getCommentsForAllAgents(page = 1, limit = 20): Promise<void> {
    try {
      loading.value = true;
      const promises = agents.value.map((agent) =>
        getAgentComments(agent.id, page, limit)
      );
      await Promise.all(promises);
    } catch (error) {
      console.warn('[ALL AGENT COMMENTS] Error fetching comments for all agents:', error);
    } finally {
      loading.value = false;
    }
  }

  async function getTokenHolders(
    agentId: string,
    page = 1,
    limit = 20
  ): Promise<void> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      const res = await $fetch<{
        holders: { holders: TokenHoldersResponse['holders']['holders']; total: number };
        pagination: { page: number; limit: number };
      }>(`https://api.vocal.fun/api/v1/launchpad/holders/${agentId}?${params.toString()}`);

      tokenHolders.value[agentId] = {
        holders: {
          holders: res.holders.holders,
          total: res.holders.total,
        },
        page: res.pagination.page,
        limit: res.pagination.limit,
      };
    } catch (error) {
      console.warn(`[TOKEN HOLDERS] Error fetching holders for agent ${agentId}:`, error);
      tokenHolders.value[agentId] = {
        holders: {
          holders: [],
          total: 0,
        },
        page,
        limit,
      };
    }
  }

  async function getAgentTrades(
    agentId: string,
    page = 1,
    limit = 20
  ): Promise<void> {
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      const res = await $fetch<{
        trades: { trades: Trade[]; total: number };
        pagination: { page: number; limit: number };
      }>(
        `https://api.vocal.fun/api/v1/launchpad/trades/${agentId}?${params.toString()}`
      );

      agentTrades.value[agentId] = {
        trades: res.trades.trades,
        total: res.trades.total,
        page: res.pagination.page,
        limit: res.pagination.limit,
      };
    } catch (error) {
      console.warn(`[AGENT TRADES] Error fetching trades for agent ${agentId}:`, error);
      agentTrades.value[agentId] = {
        trades: [],
        total: 0,
        page,
        limit,
      };
    }
  }

  async function getTradesForAllAgents(page = 1, limit = 20): Promise<void> {
    try {
      loading.value = true;
      const promises = agents.value.map((agent) =>
        getAgentTrades(agent.id, page, limit)
      );
      await Promise.all(promises);
    } catch (error) {
      console.warn('[ALL AGENT TRADES] Error fetching trades for all agents:', error);
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
      console.log('res', res);
      config.value = res;
    } catch (error) {
      console.warn('[CONFIG] Error fetching configuration:', error);
      config.value = null;
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
      } catch (error) { console.info(error) }
    }
    return null;
  }

  function writePreviewCache(agentId: string, data: PreviewDto): void {
    try {
      useLocalStorage(`preview-${agentId}`, JSON.stringify(data));
    } catch (error) {
      console.info(error)
    }
  }

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
      writePreviewCache(agentId, res);
      previews.value[agentId] = res;
    } catch (error) {
      console.warn(`[PREVIEW] Error fetching ${agent.name} (id: ${agentId}) agent preview:`, error);
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

  async function createAgent(params: {
    name: string;
    symbol: string;
    description: string;
    systemPrompt: string;
    twitter?: string;
    website?: string;
    image: File | string;
    voiceSample: File | string;
  }): Promise<any> {
    try {
      loading.value = true;
      const authStore = useAuthStore();
      const formData = new FormData();

      formData.append('name', params.name);
      formData.append('symbol', params.symbol);
      formData.append('description', params.description);
      formData.append('systemPrompt', params.systemPrompt);
      formData.append('twitter', params.twitter || '');
      formData.append('website', params.website || '');

      if (params.image instanceof File) {
        formData.append('image', params.image);
      } else {
        const imageResponse = await fetch(params.image);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image from ${params.image}`);
        }
        const imageBlob = await imageResponse.blob();
        const imageFile = new File([imageBlob], 'image.png', { type: imageBlob.type });
        formData.append('image', imageFile);
      }

      if (params.voiceSample instanceof File) {
        formData.append('voiceSample', params.voiceSample);
      } else {
        const voiceResponse = await fetch(params.voiceSample);
        if (!voiceResponse.ok) {
          throw new Error(`Failed to fetch voice sample from ${params.voiceSample}`);
        }
        const voiceBlob = await voiceResponse.blob();
        const voiceFile = new File([voiceBlob], 'voiceSample.mp3', { type: voiceBlob.type });
        formData.append('voiceSample', voiceFile);
      }

      const res = await $fetch('https://api.vocal.fun/api/v1/launchpad/create', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      });
      return res;
    } catch (error) {
      console.warn('[CREATE AGENT] Error creating agent:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function addComment(agentId: string, content: string): Promise<any> {
    try {
      loading.value = true;
      const authStore = useAuthStore();
      const res = await $fetch(`https://api.vocal.fun/api/v1/launchpad/comments/${agentId}`, {
        method: 'POST',
        body: { content },
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        }
      });
      return res;
    } catch (error) {
      console.warn(`[ADD COMMENT] Error adding comment for agent ${agentId}:`, error);
      throw error;
    } finally {
      loading.value = false;
    }
  }


  return {
    loading,
    agents,
    agentsPagination,
    previews,
    config,
    agentComments,
    tokenHolders,
    agentTrades,
    userDetails,
    getAgents,
    getAgentPreview,
    getConfig,
    getAgentComments,
    getCommentsForAllAgents,
    getTokenHolders,
    getAgentTrades,
    getTradesForAllAgents,
    getUserDetails,
    createAgent,
    addComment,
  };
});
