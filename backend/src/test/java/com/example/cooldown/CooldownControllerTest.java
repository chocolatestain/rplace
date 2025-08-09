package com.example.cooldown;

import com.example.config.WebConfig;
import com.example.shared.UserIdArgumentResolver;
import com.example.shared.cooldown.CooldownController;
import com.example.shared.cooldown.CooldownService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CooldownController.class)
@Import({WebConfig.class, UserIdArgumentResolver.class})
class CooldownControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockBean
    CooldownService cooldownService;

    @Test
    @DisplayName("쿨다운 미적용 시 0 반환")
    void getCooldown_noCooldown() throws Exception {
        Mockito.when(cooldownService.getRemainingCooldown(0L)).thenReturn(0);
        mockMvc.perform(get("/api/cooldown"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cooldown").value(0));
    }
}
