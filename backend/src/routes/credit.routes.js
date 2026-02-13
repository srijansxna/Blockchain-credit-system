export const applyForCredit = async (req, res) => {
  try {
    const { userId, amount, income } = req.body;

    // Simulated approval logic
    const approved = income > 50000; // simple rule for demo

    const fakeTransactionId =
      "TX-" + Math.random().toString(36).substring(2, 10);

    const response = {
      success: true,
      approved,
      transactionId: fakeTransactionId,
      userId,
      amount,
      timestamp: new Date().toISOString(),
      message: approved
        ? "Credit approved successfully"
        : "Credit application rejected"
    };

    return res.status(200).json(response);

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
