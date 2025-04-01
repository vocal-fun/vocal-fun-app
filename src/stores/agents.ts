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

  function mapAgent(apiAgent: any): Agent {
    return {
      id: apiAgent._id,
      name: apiAgent.name,
      image: apiAgent.imageUrl,
      rate: apiAgent.rate !== undefined ? apiAgent.rate : Number((Math.random() * 10).toFixed(2)),
      createdAt: apiAgent.createdAt || '3days',
      createdBy: apiAgent.createdBy._id,
      route: apiAgent.name.toLowerCase().replace(/\s/g, '-'),
      tokenName: apiAgent.symbol,
      mcap: Number(apiAgent.marketCap),
      price: Number(apiAgent.currentPrice),
      contract: apiAgent.tokenAddress,
      liquidity: Number((Math.random() * 10000).toFixed(2)),
      volume24h: Number((Math.random() * 500).toFixed(2)),
      change5m: Number((Math.random() * 10).toFixed(2)),
      change1h: Number((Math.random() * 10).toFixed(2)),
      change24h: Number((Math.random() * 10).toFixed(2)),
      change7d: Number((Math.random() * 20).toFixed(2)),
      comments: { comments: [] },
      tokenHolders: { holders: { holders: [], total: 0 } },
      trades: { trades: [] },
    };
  }
  async function getAgents(sort = agentsPagination.value.sort, fetchLatestOnly = false): Promise<void> {
    try {
      loading.value = true;

      if (fetchLatestOnly) {
        const limit = 1;
        const page = 1;
        const queryParams = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort,
        });
        const url = `https://api.vocal.fun/api/v1/launchpad/agents?${queryParams.toString()}`;
        const res = await $fetch<AgentsResponse & {
          pagination: { page: number; limit: number; total?: number }
        }>(url);

        if (res.agents.length === 0) {
          return;
        }

        const latestAgent = res.agents.map(mapAgent)[0];
        agents.value = [latestAgent, ...agents.value];
      } else {
        const limit = 100;
        let page = 1;
        const allAgents: Agent[] = [];

        while (true) {
          const queryParams = new URLSearchParams({
            page: String(page),
            limit: String(limit),
            sort,
          });
          const url = `https://api.vocal.fun/api/v1/launchpad/agents?${queryParams.toString()}`;
          const res = await $fetch<AgentsResponse & {
            pagination: { page: number; limit: number; total?: number }
          }>(url);

          if (res.agents.length === 0) {
            break;
          }
          const mappedAgents = res.agents.map(mapAgent);
          allAgents.push(...mappedAgents);
          page++;
        }
        agents.value = allAgents;
      }
    } catch (error) {
      console.warn("[AGENTS] Error fetching agents:", error);
      agents.value = [];
    } finally {
      loading.value = false;
    }
  }


  async function loadAgentDetails(agentId: string): Promise<void> {
    try {
      const commentsLoaded = agentComments.value[agentId]?.data?.length > 0;
      const holdersLoaded = tokenHolders.value[agentId]?.holders?.holders?.length > 0;
      const tradesLoaded = agentTrades.value[agentId]?.trades?.length > 0;

      if (!commentsLoaded) {
        await getAgentComments(agentId, true);
      }
      if (!holdersLoaded) {
        await getTokenHolders(agentId);
      }
      if (!tradesLoaded) {
        await getAgentTrades(agentId);
      }

      const index = agents.value.findIndex((agent) => agent.id === agentId);
      if (index !== -1) {
        agents.value[index].comments = {
          comments: agentComments.value[agentId]?.data ?? [],
        };
        agents.value[index].tokenHolders = {
          holders: {
            holders: tokenHolders.value[agentId]?.holders.holders ?? [],
            total: tokenHolders.value[agentId]?.holders.total ?? 0,
          },
        };
        agents.value[index].trades = {
          trades: agentTrades.value[agentId]?.trades ?? [],
        };
      }
    } catch (error) {
      console.warn(`[LOAD AGENT DETAILS] Error loading details for agent ${agentId}:`, error);
    }
  }


  async function getAgentComments(agentId: string, updateAgent: boolean = false): Promise<void> {
    try {
      const limit = 20;
      let page = 1;
      const allComments: Comment[] = [];

      while (true) {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        const url = `https://api.vocal.fun/api/v1/launchpad/comments/${agentId}?${params.toString()}`;
        const res = await $fetch<CommentsApiResponse>(url);
        const commentsPage = res.comments?.comments || [];
        allComments.push(...commentsPage);
        if (commentsPage.length < limit) break;
        page++;
      }

      agentComments.value[agentId] = {
        data: allComments,
        total: allComments.length,
        page,
        limit,
      };
      if (updateAgent) {
        const agentIndex = agents.value.findIndex((agent) => agent.id === agentId);
        if (agentIndex !== -1) {
          agents.value[agentIndex].comments = { comments: allComments };
        }
      }
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


  async function getCommentsForAllAgents(): Promise<void> {
    try {
      loading.value = true;
      const promises = agents.value.map((agent) =>
        getAgentComments(agent.id)
      );
      await Promise.all(promises);
    } catch (error) {
      console.warn('[ALL AGENT COMMENTS] Error fetching comments for all agents:', error);
    } finally {
      loading.value = false;
    }
  }

  async function getTokenHolders(agentId: string): Promise<void> {
    try {
      const limit = 20;
      let page = 1;
      const allHolders: TokenHoldersResponse['holders']['holders'] = [];

      while (true) {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        const url = `https://api.vocal.fun/api/v1/launchpad/holders/${agentId}?${params.toString()}`;
        const res = await $fetch<{
          holders: { holders: TokenHoldersResponse['holders']['holders']; total: number };
          pagination: { page: number; limit: number };
        }>(url);
        const holdersPage = res.holders.holders || [];
        allHolders.push(...holdersPage);

        if (holdersPage.length < limit) {
          break;
        }
        page++;
      }

      tokenHolders.value[agentId] = {
        holders: {
          holders: allHolders,
          total: allHolders.length,
        },
        page,
        limit,
      };
    } catch (error) {
      console.warn(`[TOKEN HOLDERS] Error fetching holders for agent ${agentId}:`, error);
      tokenHolders.value[agentId] = {
        holders: {
          holders: [],
          total: 0,
        },
        page: 1,
        limit: 20,
      };
    }
  }

  async function getAgentTrades(agentId: string): Promise<void> {
    try {
      const limit = 20;
      let page = 1;
      const allTrades: Trade[] = [];

      while (true) {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        const url = `https://api.vocal.fun/api/v1/launchpad/trades/${agentId}?${params.toString()}`;
        const res = await $fetch<{
          trades: { trades: Trade[]; total: number };
          pagination: { page: number; limit: number };
        }>(url);
        const tradesPage = res.trades.trades || [];
        allTrades.push(...tradesPage);

        if (tradesPage.length < limit) {
          break;
        }
        page++;
      }

      agentTrades.value[agentId] = {
        trades: allTrades,
        total: allTrades.length,
        page,
        limit,
      };
    } catch (error) {
      console.warn(`[AGENT TRADES] Error fetching trades for agent ${agentId}:`, error);
      agentTrades.value[agentId] = {
        trades: [],
        total: 0,
        page: 1,
        limit: 20,
      };
    }
  }

  async function getTradesForAllAgents(): Promise<void> {
    try {
      loading.value = true;
      const promises = agents.value.map((agent) =>
        getAgentTrades(agent.id)
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
    loadAgentDetails,
  };
});
