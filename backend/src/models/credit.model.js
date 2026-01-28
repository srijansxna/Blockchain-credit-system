/**
 * Credit / Loan Application Model
 * Pure data model – no business logic
 */

export function createCreditApplication(payload) {
  return {
    loanId: payload.loanId,

    applicant: {
      name: String(payload.applicant.name),
      aadhaar: String(payload.applicant.aadhaar),
      pan: String(payload.applicant.pan)
    },

    financials: {
      salary_3_month_avg: Number(payload.financials.salary_3_month_avg),

      itr: {
        year_1: Number(payload.financials.itr.year_1),
        year_2: Number(payload.financials.itr.year_2),
        year_3: Number(payload.financials.itr.year_3)
      }
    },

    loan: {
      amount_requested: Number(payload.loan.amount_requested)
    },

    metadata: {
      created_at: new Date().toISOString()
    }
  };
}
