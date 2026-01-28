// backend/services/credit.service.js

/**
 * Core credit evaluation logic
 * Simple, explainable, bank-realistic
 */

export function evaluateCredit(application) {
  const salary =
    application.financials.salary_3_month_avg;

  const loanAmount =
    application.loan.amount_requested;

  // Basic validation
  if (!salary || !loanAmount) {
    return {
      loanId: application.loanId,
      threshold_passed: false,
      reason: "Invalid financial data"
    };
  }

  // Annual income
  const annualIncome = salary * 12;

  // Loan-to-Income Ratio
  const loanToIncomeRatio = loanAmount / annualIncome;

  /**
   * Decision rule:
   * Banks typically allow loans up to 50–60% of annual income
   * We use 50% for conservative approval
   */
  const THRESHOLD = 0.5;

  const approved = loanToIncomeRatio <= THRESHOLD;

  return {
    loanId: application.loanId,

    metrics: {
      monthly_salary: salary,
      annual_income: annualIncome,
      loan_amount: loanAmount,
      loan_to_income_ratio: Number(
        loanToIncomeRatio.toFixed(3)
      )
    },

    threshold: THRESHOLD,
    threshold_passed: approved
  };
}
