import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage, Stomp } from '@stomp/stompjs';

interface UseCanvasSocketOptions {
  jwtToken?: string;
  onPixelEvent: (event: any) => void;
}

export function useCanvasSocket({ jwtToken, onPixelEvent }: UseCanvasSocketOptions) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    // SockJS + STOMP 클라이언트 생성
    const socket = new SockJS('/ws/canvas');
    const client = Stomp.over(socket);
    clientRef.current = client;

    client.connect(
      jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
      () => {
        client.subscribe('/topic/canvas', (message: IMessage) => {
          try {
            const payload = JSON.parse(message.body);
            onPixelEvent(payload);
          } catch (e) {
            // 파싱 오류 무시
          }
        });
      },
      (error) => {
        // 연결 실패/종료 시 처리
        // TODO: 자동 재연결, 사용자 피드백 등 구현 가능
      }
    );

    return () => {
      client.disconnect(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtToken]);
} 