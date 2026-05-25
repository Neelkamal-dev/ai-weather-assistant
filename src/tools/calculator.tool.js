async function calculatorTool(input) {

  try {

    const result = eval(input);

    return {
      success: true,
      data: result
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = calculatorTool;