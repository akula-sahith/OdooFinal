package com.odoo.DealFlow360.reporting;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

class ReportingServiceTest {

    private ReportingRepository repository;
    private ReportingService service;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ReportingRepository.class);
        service = new ReportingService(repository);
    }

    @Test
    @DisplayName("Should retrieve sales performance summary from repository")
    void testGetSalesPerformanceSummary() {
        Map<String, Object> mockSummary = new HashMap<>();
        mockSummary.put("total_quotations", 10L);
        mockSummary.put("confirmed_value", 50000.00);

        when(repository.getSalesPerformanceSummary(null, null, 1L, null)).thenReturn(mockSummary);

        Map<String, Object> result = service.getSalesPerformanceSummary(null, null, 1L, null);
        assertThat(result).containsEntry("total_quotations", 10L);
    }
}
