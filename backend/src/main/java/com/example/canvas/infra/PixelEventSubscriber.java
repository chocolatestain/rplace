package com.example.canvas.infra;

import java.nio.charset.StandardCharsets;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.example.canvas.dto.PixelEvent;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class PixelEventSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public PixelEventSubscriber(ObjectMapper objectMapper, SimpMessagingTemplate messagingTemplate,
                                RedisMessageListenerContainer container) {
        this.objectMapper = objectMapper;
        this.messagingTemplate = messagingTemplate;
        // 구독 등록
        container.addMessageListener(this, new PatternTopic("canvas:pixel"));
    }

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody(), StandardCharsets.UTF_8);
            PixelEvent event = objectMapper.readValue(json, PixelEvent.class);
            // WebSocket 브로드캐스트
            messagingTemplate.convertAndSend("/topic/canvas", event);
        } catch (Exception e) {
            // TODO: 로깅 프레임워크 사용할 것
            e.printStackTrace();
        }
    }
} 