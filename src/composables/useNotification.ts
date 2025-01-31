import { useToast, type TYPE } from 'vue-toastification';

export function useNotification() {
  const toast = useToast();

  return {
    success: (content: string) => toast(content, { type: 'success' as TYPE }),
    info: (content: string) => toast(content, { type: 'info' as TYPE }),
    error: (content: string) => toast(content, { type: 'error' as TYPE }),
    warning: (content: string) => toast(content, { type: 'warning' as TYPE }),
  };
}
