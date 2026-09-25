import type { ReactNode } from 'react';
import { useRef } from 'react';
import { toast as toastify, type TypeOptions } from 'react-toastify';

type ToastType = TypeOptions | 'loading' | 'dismiss';

type toastLoadingProp = {
  message?: string;
  type?: ToastType;
  isLoading?: boolean;
  onClose?: () => void;
};

type useToastProp = (prop: toastLoadingProp) => void;

export default function useToastLoading(): useToastProp {
  const toastRef = useRef<string | number | null>(null);

  function toast(props: toastLoadingProp) {
    const renderedMessage: ReactNode = props.message ? (
      <div dangerouslySetInnerHTML={{ __html: props.message }} />
    ) : (
      props.message
    );

    if (props.type) {
      if (props.type == 'dismiss') {
        toastify.dismiss(toastRef.current ?? undefined);
        toastRef.current = null;
      } else {
        if (toastRef.current) {
          toastify.update(toastRef.current, {
            render: renderedMessage,
            type: props.type as TypeOptions,
            autoClose: 5000,
            isLoading: false,
            closeButton: true,
          });
          if (props.onClose) setTimeout(props.onClose, 50);
        } else {
          const renderToast = (
            toastify as unknown as Record<string, (content: ReactNode) => void>
          )[props.type];
          renderToast(renderedMessage);
        }
      }
    } else toastRef.current = toastify.loading(renderedMessage);
  }

  return toast;
}
