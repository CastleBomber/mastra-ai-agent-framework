const run = await stockWorkflow.createRunAsync();
const result = await run.start({
    inputData: { symbol: "SPY" }
});

console.log(result);