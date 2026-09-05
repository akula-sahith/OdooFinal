package com.odoo.DealFlow360.approval;

import java.util.Objects;

/**
 * Domain model representing an ordered step in an approval chain (APPROVAL_CHAIN_STEPS table).
 */
public class ApprovalChainStep {

    private Long id;
    private Long ruleId;
    private Integer stepNumber;
    private String role;
    private Long userId;

    public ApprovalChainStep() {
    }

    public ApprovalChainStep(Long id, Long ruleId, Integer stepNumber, String role, Long userId) {
        this.id = id;
        this.ruleId = ruleId;
        this.stepNumber = stepNumber;
        this.role = role;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRuleId() {
        return ruleId;
    }

    public void setRuleId(Long ruleId) {
        this.ruleId = ruleId;
    }

    public Integer getStepNumber() {
        return stepNumber;
    }

    public void setStepNumber(Integer stepNumber) {
        this.stepNumber = stepNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApprovalChainStep that = (ApprovalChainStep) o;
        return Objects.equals(id, that.id) &&
               Objects.equals(ruleId, that.ruleId) &&
               Objects.equals(stepNumber, that.stepNumber) &&
               Objects.equals(role, that.role) &&
               Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, ruleId, stepNumber, role, userId);
    }

    @Override
    public String toString() {
        return "ApprovalChainStep{" +
               "id=" + id +
               ", ruleId=" + ruleId +
               ", stepNumber=" + stepNumber +
               ", role='" + role + '\'' +
               ", userId=" + userId +
               '}';
    }
}
