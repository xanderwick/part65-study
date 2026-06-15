// Domain 1 — Economic Factors and Business Information (expansion set)
window.QUESTION_BANK = (window.QUESTION_BANK || []).concat([
  {
    id: "D1-035",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Time Value of Money",
    difficulty: 2,
    question: "A client deposits $5,000 today into an account earning 6% compounded annually. Approximately what will the account be worth in 12 years, and which concept describes this calculation?",
    choices: [
      "About $10,000; this is a future value calculation",
      "About $2,500; this is a present value calculation",
      "About $8,600; this is a discounting calculation",
      "About $3,600; this is an internal rate of return calculation"
    ],
    answer: 0,
    explanation: "Using the Rule of 72, money doubles in 72/6 = 12 years, so $5,000 grows to roughly $10,000; compounding a known sum forward is a future value calculation. Present value works in the opposite direction by discounting a future amount back to today."
  },
  {
    id: "D1-036",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Time Value of Money",
    difficulty: 2,
    question: "An investor wants $100,000 in 9 years and expects an 8% annual return. Which time value of money concept and direction is used to determine how much to invest today?",
    choices: [
      "Present value, discounting backward",
      "Future value, compounding forward",
      "Net present value of an annuity due",
      "Future value of an ordinary annuity"
    ],
    answer: 0,
    explanation: "Solving for a single lump sum needed today to reach a known future goal is a present value problem, which discounts the future amount backward at the assumed rate. Future value would instead grow a known current sum forward in time."
  },
  {
    id: "D1-037",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Time Value of Money",
    difficulty: 1,
    question: "What is the key difference between an ordinary annuity and an annuity due?",
    choices: [
      "An ordinary annuity pays at the end of each period; an annuity due pays at the beginning",
      "An ordinary annuity pays at the beginning of each period; an annuity due pays at the end",
      "An ordinary annuity uses simple interest; an annuity due uses compound interest",
      "An ordinary annuity is always tax-deferred; an annuity due is always taxable"
    ],
    answer: 0,
    explanation: "An ordinary annuity makes payments at the end of each period, while an annuity due makes them at the beginning, giving the annuity due a slightly higher present and future value. The distinction is timing of cash flows, not the interest method or tax treatment."
  },
  {
    id: "D1-038",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Time Value of Money",
    difficulty: 3,
    question: "Two bonds offer the same 6% nominal annual rate, but Bond A compounds semiannually and Bond B compounds quarterly. Which statement is correct?",
    choices: [
      "Both have identical effective annual yields because the nominal rate is the same",
      "Bond A has a higher effective annual yield because fewer compounding periods reduce drag",
      "Bond B has a higher effective annual yield because more frequent compounding raises the effective rate",
      "Effective yield cannot be compared without knowing the maturity dates"
    ],
    answer: 2,
    explanation: "For a given nominal rate, more frequent compounding produces a higher effective annual yield, so quarterly compounding (Bond B) beats semiannual (Bond A). The nominal rate alone does not determine the effective yield once compounding frequency differs."
  },
  {
    id: "D1-039",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Time Value of Money",
    difficulty: 2,
    question: "An adviser computes that a project's expected cash flows discounted at the required rate produce a net present value (NPV) of negative $4,000. What does this indicate?",
    choices: [
      "The project earns exactly the required rate of return",
      "The project's return exceeds the required rate and should be accepted",
      "The project's return is below the required rate and generally should be rejected",
      "The discount rate must be increased to make the project viable"
    ],
    answer: 2,
    explanation: "A negative NPV means the present value of inflows is less than the cost, so the project returns less than the required discount rate and should normally be rejected. A zero NPV would mean the return exactly equals the required rate."
  },
  {
    id: "D1-040",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Time Value of Money",
    difficulty: 3,
    question: "The internal rate of return (IRR) of an investment is best described as the discount rate that:",
    choices: [
      "Maximizes the future value of the cash flows",
      "Equals the risk-free rate plus a risk premium",
      "Sets the net present value of all cash flows equal to zero",
      "Is always higher than the firm's cost of capital"
    ],
    answer: 2,
    explanation: "IRR is the discount rate at which the NPV of all cash flows equals zero, representing the investment's intrinsic compound rate of return. It is not defined by the risk-free rate, and it can be above or below the cost of capital depending on the project."
  },
  {
    id: "D1-041",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Financial Reporting",
    difficulty: 1,
    question: "Which financial statement reports a company's assets, liabilities, and shareholders' equity at a single point in time?",
    choices: [
      "The income statement",
      "The statement of cash flows",
      "The balance sheet",
      "The statement of retained earnings"
    ],
    answer: 2,
    explanation: "The balance sheet is a snapshot at a specific date showing assets, liabilities, and equity, following the identity Assets = Liabilities + Equity. The income statement instead covers a period of time and reports revenues and expenses."
  },
  {
    id: "D1-042",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Financial Reporting",
    difficulty: 2,
    question: "A company has current assets of $600,000 and current liabilities of $400,000. What is its current ratio, and what does it suggest?",
    choices: [
      "1.5; the firm has adequate short-term liquidity",
      "0.67; the firm may struggle to meet short-term obligations",
      "2.4; the firm has excess long-term solvency",
      "1.5; the firm is technically insolvent"
    ],
    answer: 0,
    explanation: "The current ratio equals current assets divided by current liabilities: $600,000 / $400,000 = 1.5, indicating the firm has $1.50 of current assets per $1.00 of current liabilities. A ratio above 1.0 generally signals adequate short-term liquidity, not insolvency."
  },
  {
    id: "D1-043",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Financial Reporting",
    difficulty: 2,
    question: "The quick ratio (acid-test ratio) differs from the current ratio primarily because it:",
    choices: [
      "Adds inventory to current assets",
      "Excludes accounts receivable from current assets",
      "Excludes inventory from current assets",
      "Divides by total liabilities instead of current liabilities"
    ],
    answer: 2,
    explanation: "The quick ratio removes inventory from current assets because inventory is the least liquid current asset and may not convert to cash quickly. It still uses current liabilities in the denominator, providing a stricter liquidity measure than the current ratio."
  },
  {
    id: "D1-044",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Financial Reporting",
    difficulty: 3,
    question: "A firm reports net income of $2 million, has 1 million shares outstanding, and pays a $0.50 per share dividend. What are its EPS and dividend payout ratio?",
    choices: [
      "EPS of $2.00 and a payout ratio of 25%",
      "EPS of $0.50 and a payout ratio of 100%",
      "EPS of $2.00 and a payout ratio of 50%",
      "EPS of $4.00 and a payout ratio of 12.5%"
    ],
    answer: 0,
    explanation: "EPS equals net income divided by shares: $2,000,000 / 1,000,000 = $2.00, and the payout ratio is dividends per share divided by EPS: $0.50 / $2.00 = 25%. The remaining 75% is retained earnings reinvested in the business."
  },
  {
    id: "D1-045",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Financial Reporting",
    difficulty: 2,
    question: "On a statement of cash flows, the purchase of new manufacturing equipment is classified under which activity?",
    choices: [
      "Operating activities",
      "Financing activities",
      "Investing activities",
      "Non-cash supplemental disclosures"
    ],
    answer: 2,
    explanation: "Buying long-term productive assets such as equipment is an investing activity. Operating activities relate to day-to-day cash from running the business, and financing activities involve raising or repaying capital such as issuing stock or paying dividends."
  },
  {
    id: "D1-046",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Financial Reporting",
    difficulty: 1,
    question: "Working capital is calculated as:",
    choices: [
      "Total assets minus total liabilities",
      "Current assets minus inventory",
      "Current assets minus current liabilities",
      "Shareholders' equity plus long-term debt"
    ],
    answer: 2,
    explanation: "Working capital equals current assets minus current liabilities and measures the short-term funds available to operate the business. Total assets minus total liabilities instead defines net worth, or shareholders' equity."
  },
  {
    id: "D1-047",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Financial Reporting",
    difficulty: 3,
    question: "A company has total debt of $8 million and total shareholders' equity of $4 million. Its debt-to-equity ratio is 2.0. What does this most directly indicate?",
    choices: [
      "The firm is highly liquid in the short term",
      "The firm has no ability to issue additional bonds",
      "The firm's net income must be negative",
      "The firm is highly leveraged and carries greater financial risk"
    ],
    answer: 3,
    explanation: "A debt-to-equity ratio of 2.0 means the firm uses twice as much debt as equity, signaling high financial leverage and elevated risk to equity holders, especially in downturns. The ratio measures capital structure, not short-term liquidity or profitability."
  },
  {
    id: "D1-048",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Analytical Methods",
    difficulty: 2,
    question: "An analyst values a stock by projecting its future dividends and discounting them to present value. Which valuation approach is being used?",
    choices: [
      "Technical analysis",
      "The capital asset pricing model",
      "The dividend discount model (a fundamental approach)",
      "Dollar-cost averaging"
    ],
    answer: 2,
    explanation: "Discounting projected dividends to present value is the dividend discount model, a fundamental analysis technique for estimating intrinsic value. Technical analysis instead studies price and volume patterns rather than discounting cash flows."
  },
  {
    id: "D1-049",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Analytical Methods",
    difficulty: 2,
    question: "Which of the following would a technical analyst most likely rely on when making investment decisions?",
    choices: [
      "A company's price-to-earnings ratio and book value",
      "Projected free cash flow and dividend growth rates",
      "Chart patterns, trading volume, and moving averages",
      "The Federal Reserve's interest rate guidance"
    ],
    answer: 2,
    explanation: "Technical analysts study market-generated data such as chart patterns, volume, and moving averages to forecast price direction. Price-to-earnings ratios, cash flow, and book value are tools of fundamental analysis."
  },
  {
    id: "D1-050",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Analytical Methods",
    difficulty: 3,
    question: "A growth-oriented stock trades at a P/E of 40 while the broad market averages a P/E of 18. According to fundamental analysis, this most likely reflects:",
    choices: [
      "That the stock is guaranteed to outperform the market",
      "That the company has lower earnings than the market average",
      "A pure technical buy signal independent of earnings",
      "Investor expectations of higher future earnings growth, with a higher valuation risk"
    ],
    answer: 3,
    explanation: "A high P/E relative to the market typically signals that investors expect above-average earnings growth and are paying a premium for it, which also raises the risk that the stock falls if growth disappoints. A high P/E offers no guarantee of outperformance."
  },
  {
    id: "D1-051",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Analytical Methods",
    difficulty: 1,
    question: "Which type of analysis examines macroeconomic conditions, then industries, then specific companies?",
    choices: [
      "Top-down fundamental analysis",
      "Bottom-up technical analysis",
      "Random walk analysis",
      "Efficient frontier analysis"
    ],
    answer: 0,
    explanation: "Top-down fundamental analysis starts with the broad economy, narrows to attractive industries, and finally selects individual companies. A bottom-up approach reverses this, beginning with individual company analysis regardless of the macro picture."
  },
  {
    id: "D1-052",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Analytical Methods",
    difficulty: 3,
    question: "Under the semi-strong form of the efficient market hypothesis (EMH), which strategy would NOT be expected to consistently generate excess returns?",
    choices: [
      "Trading on material nonpublic (inside) information",
      "Holding a diversified passive index portfolio",
      "Rebalancing to a target asset allocation",
      "Analyzing public financial statements and news (fundamental analysis)"
    ],
    answer: 3,
    explanation: "The semi-strong form holds that all publicly available information is already reflected in prices, so fundamental analysis of public data cannot consistently beat the market. Only the strong form claims that even inside information is already priced in."
  },
  {
    id: "D1-053",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Types of Risk",
    difficulty: 1,
    question: "Which type of risk is also called systematic risk and cannot be eliminated through diversification?",
    choices: [
      "Business risk",
      "Default risk",
      "Market risk",
      "Liquidity risk"
    ],
    answer: 2,
    explanation: "Market (systematic) risk affects the entire market and cannot be diversified away because it stems from broad factors like recessions or interest rate moves. Business and default risks are unsystematic and can be reduced through diversification."
  },
  {
    id: "D1-054",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Types of Risk",
    difficulty: 2,
    question: "A long-term bondholder is most directly exposed to interest rate risk. What happens to the price of an outstanding bond when market interest rates rise?",
    choices: [
      "The bond's coupon payment increases",
      "The bond's price falls",
      "The bond's price rises",
      "The bond's maturity date is extended"
    ],
    answer: 1,
    explanation: "Bond prices move inversely to interest rates, so when market rates rise, the price of an existing fixed-coupon bond falls to make its yield competitive. The stated coupon payment and maturity date are fixed and do not change with market rates."
  },
  {
    id: "D1-055",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Types of Risk",
    difficulty: 2,
    question: "An investor holds a portfolio of long-term Treasury bonds. Although these have minimal default risk, they remain heavily exposed to which risk?",
    choices: [
      "Purchasing power (inflation) risk",
      "Credit (default) risk",
      "Business risk",
      "Currency risk"
    ],
    answer: 0,
    explanation: "Long-term fixed-income securities are especially vulnerable to purchasing power risk because inflation erodes the real value of fixed coupon and principal payments over time. Treasuries carry essentially no default risk, so credit risk is not the main concern."
  },
  {
    id: "D1-056",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Types of Risk",
    difficulty: 3,
    question: "An investor buys a callable corporate bond. If interest rates fall sharply, the investor faces the greatest exposure to which combined risk?",
    choices: [
      "Inflation risk and currency risk",
      "Default risk and liquidity risk",
      "Market risk and timing risk",
      "Call risk and reinvestment risk"
    ],
    answer: 3,
    explanation: "When rates fall, issuers tend to call high-coupon bonds (call risk), forcing the investor to reinvest the returned principal at the new, lower rates (reinvestment risk). These two risks are closely linked and most acute in a declining-rate environment."
  },
  {
    id: "D1-057",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Types of Risk",
    difficulty: 1,
    question: "The risk that an investor cannot quickly sell a security without a significant price concession is known as:",
    choices: [
      "Liquidity (marketability) risk",
      "Systematic risk",
      "Interest rate risk",
      "Legislative risk"
    ],
    answer: 0,
    explanation: "Liquidity, or marketability, risk is the danger that a security cannot be sold promptly at a fair price, common in thinly traded or private securities. Systematic risk by contrast refers to broad market movements affecting all securities."
  },
  {
    id: "D1-058",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Types of Risk",
    difficulty: 2,
    question: "A U.S. investor purchases stock denominated in euros. If the euro weakens against the dollar while the stock price stays flat in euros, the investor primarily experiences:",
    choices: [
      "A gain due to interest rate risk",
      "No effect, because the stock price was unchanged",
      "A loss due to currency (exchange rate) risk",
      "A gain due to inflation risk"
    ],
    answer: 2,
    explanation: "Currency risk means that adverse exchange rate moves can reduce returns on foreign-denominated assets; a weaker euro means each euro converts to fewer dollars, producing a loss when measured in dollars. The unchanged euro price does not protect against the conversion loss."
  },
  {
    id: "D1-059",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Types of Risk",
    difficulty: 3,
    question: "Which of the following risks is considered unsystematic and therefore reducible through diversification?",
    choices: [
      "Interest rate risk",
      "Market risk",
      "Business (company-specific) risk",
      "Purchasing power risk"
    ],
    answer: 2,
    explanation: "Business risk is unique to a particular company or industry and can be diversified away by holding many different securities. Interest rate, market, and purchasing power risks are systematic and affect the broad market regardless of diversification."
  },
  {
    id: "D1-060",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Quantitative Methods",
    difficulty: 2,
    question: "A stock returns 10%, then loses 10% the next year on a $1,000 investment. Which measure best captures the actual compounded result over the two years?",
    choices: [
      "The arithmetic mean return of 0%",
      "The nominal yield of 10%",
      "The standard deviation of returns",
      "The geometric mean (time-weighted) return, which is slightly negative"
    ],
    answer: 3,
    explanation: "The geometric mean reflects compounding: $1,000 grows to $1,100 then falls to $990, a roughly negative 0.5% annualized return. The arithmetic mean of 0% overstates results because it ignores the order and compounding of returns."
  },
  {
    id: "D1-061",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Quantitative Methods",
    difficulty: 2,
    question: "Standard deviation is most commonly used by analysts as a measure of:",
    choices: [
      "A security's sensitivity to the overall market",
      "The correlation between two assets",
      "The total volatility, or dispersion, of an investment's returns",
      "The compounded growth rate of a portfolio"
    ],
    answer: 2,
    explanation: "Standard deviation measures the dispersion of returns around their average and is a standard proxy for total volatility, or risk. Sensitivity to the overall market is measured by beta, not standard deviation."
  },
  {
    id: "D1-062",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Quantitative Methods",
    difficulty: 3,
    question: "A stock has a beta of 1.4. If the overall market rises by 10%, the stock would be expected to:",
    choices: [
      "Rise by approximately 10%, matching the market",
      "Rise by approximately 7%, dampening the market move",
      "Fall by approximately 14%, moving inversely",
      "Rise by approximately 14%, amplifying the market move"
    ],
    answer: 3,
    explanation: "Beta measures sensitivity to market movements; a beta of 1.4 means the stock tends to move 1.4 times the market, so a 10% market gain implies roughly a 14% rise. A beta of 1.0 would move with the market and below 1.0 would be less volatile than the market."
  },
  {
    id: "D1-063",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Quantitative Methods",
    difficulty: 3,
    question: "Using the capital asset pricing model (CAPM) with a risk-free rate of 3%, a market return of 9%, and a beta of 1.5, what is the stock's expected (required) return?",
    choices: [
      "9%",
      "12%",
      "13.5%",
      "18%"
    ],
    answer: 1,
    explanation: "CAPM expected return = risk-free rate + beta x (market return - risk-free rate) = 3% + 1.5 x (9% - 3%) = 3% + 9% = 12%. Forgetting to subtract the risk-free rate inside the market risk premium is a common error that inflates the answer."
  },
  {
    id: "D1-064",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Quantitative Methods",
    difficulty: 3,
    question: "Two assets that are perfectly negatively correlated (correlation of -1.0) are combined in a portfolio. What is the primary diversification benefit?",
    choices: [
      "Returns are maximized while expected return is unchanged",
      "Both assets always move in the same direction, reducing risk",
      "Diversification provides no benefit at this correlation",
      "Portfolio volatility can theoretically be reduced to or near zero"
    ],
    answer: 3,
    explanation: "Perfectly negatively correlated assets move in opposite directions, so their offsetting movements can reduce portfolio volatility toward zero, the greatest possible diversification benefit. Correlation of -1.0 does not mean the assets move together; that would be +1.0, which offers no diversification."
  },
  {
    id: "D1-065",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Quantitative Methods",
    difficulty: 2,
    question: "The Sharpe ratio is best described as a measure of:",
    choices: [
      "Return earned per unit of total risk (standard deviation)",
      "Return earned per unit of market risk (beta)",
      "A portfolio's correlation with the benchmark",
      "The probability of a portfolio losing money"
    ],
    answer: 0,
    explanation: "The Sharpe ratio divides excess return over the risk-free rate by the portfolio's standard deviation, measuring risk-adjusted return per unit of total risk. The Treynor ratio, by contrast, uses beta to measure return per unit of market risk."
  },
  {
    id: "D1-066",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Quantitative Methods",
    difficulty: 1,
    question: "An investment's after-tax return is calculated by:",
    choices: [
      "Multiplying the nominal return by the tax rate",
      "Subtracting the inflation rate from the nominal return",
      "Dividing the nominal return by (1 plus the tax rate)",
      "Multiplying the nominal return by (1 minus the tax rate)"
    ],
    answer: 3,
    explanation: "After-tax return equals the nominal return multiplied by (1 minus the investor's tax rate), reflecting the portion kept after taxes. Subtracting inflation instead yields the real (inflation-adjusted) return, a different adjustment."
  },
  {
    id: "D1-067",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Quantitative Methods",
    difficulty: 2,
    question: "If a bond yields 5% nominally and inflation is running at 3%, the investor's approximate real rate of return is:",
    choices: [
      "8%",
      "2%",
      "5%",
      "15%"
    ],
    answer: 1,
    explanation: "The real return approximately equals the nominal return minus inflation: 5% - 3% = 2%, representing the gain in actual purchasing power. Adding the two figures would overstate the result and misunderstand the inflation adjustment."
  },
  {
    id: "D1-068",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Economic Factors",
    difficulty: 1,
    question: "The phase of the business cycle characterized by rising GDP, falling unemployment, and increasing consumer spending is called:",
    choices: [
      "Contraction",
      "Trough",
      "Expansion",
      "Recession"
    ],
    answer: 2,
    explanation: "Expansion is marked by growing GDP, declining unemployment, and rising business and consumer activity. Contraction and recession describe the opposite, declining phase, while the trough is the low point before recovery."
  },
  {
    id: "D1-069",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Economic Factors",
    difficulty: 2,
    question: "A recession is most commonly defined as:",
    choices: [
      "Any single quarter of negative GDP growth",
      "A period when inflation exceeds 5%",
      "Two or more consecutive quarters of declining real GDP",
      "A decline in the stock market of at least 20%"
    ],
    answer: 2,
    explanation: "The conventional definition of a recession is two or more consecutive quarters of declining real GDP, reflecting a sustained contraction in economic output. A 20% market decline describes a bear market, which is a financial rather than economic-output measure."
  },
  {
    id: "D1-070",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Economic Factors",
    difficulty: 2,
    question: "When the Federal Reserve wants to stimulate a slowing economy through monetary policy, it is most likely to:",
    choices: [
      "Raise the discount rate and sell securities in open market operations",
      "Lower the discount rate and buy securities in open market operations",
      "Increase reserve requirements for banks",
      "Raise federal income tax rates"
    ],
    answer: 1,
    explanation: "Expansionary monetary policy involves lowering rates and buying securities to inject reserves, increasing the money supply and encouraging lending. Raising rates or reserve requirements would tighten policy, and changing tax rates is fiscal policy controlled by Congress, not the Fed."
  },
  {
    id: "D1-071",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Economic Factors",
    difficulty: 3,
    question: "Which combination correctly distinguishes monetary policy from fiscal policy?",
    choices: [
      "Monetary policy is set by Congress; fiscal policy is set by the Federal Reserve",
      "Both are controlled exclusively by the Federal Reserve",
      "Fiscal policy adjusts the discount rate; monetary policy adjusts tax brackets",
      "Monetary policy controls money supply and interest rates via the Fed; fiscal policy controls government spending and taxation via Congress"
    ],
    answer: 3,
    explanation: "Monetary policy is conducted by the Federal Reserve through tools affecting the money supply and interest rates, while fiscal policy is enacted by Congress and the President through spending and taxation. The two are run by different bodies with different tools."
  },
  {
    id: "D1-072",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Economic Factors",
    difficulty: 2,
    question: "An inverted yield curve, where short-term Treasury yields exceed long-term yields, is often interpreted as a signal of:",
    choices: [
      "Strong, accelerating economic growth",
      "Rising long-term inflation expectations",
      "An immediate increase in corporate earnings",
      "A potential upcoming economic slowdown or recession"
    ],
    answer: 3,
    explanation: "An inverted yield curve has historically preceded recessions, as investors accept lower long-term yields expecting weaker growth and future rate cuts. A normal, upward-sloping curve is the one typically associated with healthy growth expectations."
  },
  {
    id: "D1-073",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Economic Factors",
    difficulty: 1,
    question: "The Consumer Price Index (CPI) is primarily used to measure:",
    choices: [
      "The total output of the economy",
      "The unemployment rate",
      "Corporate profit growth",
      "The rate of inflation faced by consumers"
    ],
    answer: 3,
    explanation: "The CPI tracks the change in prices of a basket of consumer goods and services and is the most widely cited gauge of consumer inflation. Total economic output is measured by GDP, a separate indicator."
  },
  {
    id: "D1-074",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Economic Factors",
    difficulty: 3,
    question: "Which of the following is generally classified as a leading economic indicator?",
    choices: [
      "The unemployment rate",
      "Corporate profits for the prior quarter",
      "New building permits and stock market prices",
      "The average duration of unemployment"
    ],
    answer: 2,
    explanation: "Leading indicators such as new building permits and stock prices tend to change before the broader economy and help forecast future activity. The unemployment rate and average duration of unemployment are lagging indicators that confirm trends after they occur."
  },
  {
    id: "D1-075",
    domain: 1,
    domainName: "Economic Factors and Business Information",
    topic: "Economic Factors",
    difficulty: 2,
    question: "Stagflation presents a difficult policy challenge because it combines:",
    choices: [
      "Falling prices with rapid economic growth",
      "Low inflation with full employment",
      "Rising GDP with declining interest rates",
      "High inflation with stagnant growth and high unemployment"
    ],
    answer: 3,
    explanation: "Stagflation is the simultaneous occurrence of high inflation, stagnant economic growth, and high unemployment, which is difficult because tools that fight inflation tend to worsen unemployment. Falling prices instead describe deflation, a different condition."
  }
]);
