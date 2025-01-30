import { useToast, TYPE } from 'vue-toastification';

export function useNotification() {
  const toast = useToast();

  return {
    success: (content: string) => toast(content, { type: TYPE.SUCCESS }),
    info: (content: string) => toast(content, { type: TYPE.INFO }),
    error: (content: string) => toast(content, { type: TYPE.ERROR }),
    warning: (content: string) => toast(content, { type: TYPE.WARNING }),
  };
}
