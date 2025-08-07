package com.cdac.acts.transactionservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponseDto {
    private SummaryDto summary;
    private List<MonthlyOverviewDto> monthlyOverview;
    private List<CategorySpendingDto> spendingByCategory;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SummaryDto {
        private MonthlyTotals currentMonth;
        private PercentageChange percentageChange;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyTotals {
        private BigDecimal incoming = BigDecimal.ZERO;
        private BigDecimal outgoing = BigDecimal.ZERO;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PercentageChange {
        private double incoming = 0.0;
        private double outgoing = 0.0;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyOverviewDto {
        private String month;
        private BigDecimal sent;
        private BigDecimal received;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySpendingDto {
        private String category;
        private BigDecimal amount;
    }
}
