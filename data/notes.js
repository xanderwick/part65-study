/* notes.js — High-yield study notes / cheat sheets per domain.
 * Concise, exam-focused. Available fully offline.
 */
window.STUDY_NOTES = [
  {
    domain: 1,
    name: "Economic Factors and Business Information",
    weight: "15%",
    sections: [
      {
        h: "Time Value of Money",
        points: [
          "PV = value today of a future sum; FV = value of money grown at a rate. Discounting moves FV→PV; compounding moves PV→FV.",
          "Rule of 72: years to double ≈ 72 / interest rate (%). At 8% → 9 years.",
          "NPV = PV of inflows − cost. NPV > 0 = acceptable. IRR = discount rate where NPV = 0; accept if IRR > required return.",
          "Higher discount rate → lower present value."
        ]
      },
      {
        h: "Financial Statements",
        points: [
          "Balance sheet (a snapshot): Assets = Liabilities + Shareholders' Equity.",
          "Income statement (a period): Revenue − expenses = net income (profitability).",
          "Cash flow statement: operating, investing, financing activities; reconciles actual cash.",
          "Working capital = current assets − current liabilities (short-term liquidity)."
        ]
      },
      {
        h: "Key Ratios",
        points: [
          "Current ratio = current assets / current liabilities (≥1 healthy).",
          "Quick (acid-test) ratio = (current assets − inventory) / current liabilities.",
          "Debt-to-equity = total debt / equity (leverage).",
          "ROE = net income / equity. P/E = price / EPS. Dividend yield = annual dividend / price."
        ]
      },
      {
        h: "Types of Risk",
        points: [
          "SYSTEMATIC (market) risk: undiversifiable — market, interest-rate, inflation (purchasing-power) risk. Measured by BETA.",
          "UNSYSTEMATIC risk: diversifiable — business, financial, regulatory, default risk specific to one issuer.",
          "Interest-rate risk: bond prices fall when rates rise (long maturities/low coupons most sensitive — higher duration).",
          "Reinvestment risk: cash flows reinvested at lower rates (opposite concern from interest-rate risk).",
          "Call risk: bond called when rates fall. Liquidity risk: can't sell without price concession."
        ]
      },
      {
        h: "Quantitative Measures",
        points: [
          "Standard deviation = total volatility (total risk). Beta = systematic risk vs market (market beta = 1).",
          "Alpha = return above what beta predicted (manager skill). Sharpe = (return − risk-free) / std dev (risk-adjusted).",
          "Correlation +1 (move together) to −1 (opposite). Low/negative correlation improves diversification.",
          "Duration = price sensitivity to rate changes; longer duration = more interest-rate risk."
        ]
      },
      {
        h: "Economic Indicators & Policy",
        points: [
          "Business cycle: expansion → peak → contraction/recession → trough. Recession ≈ 2 consecutive quarters of falling GDP.",
          "Leading (stock prices, building permits, new orders); coincident (GDP, employment); lagging (CPI, unemployment duration).",
          "Monetary policy = Fed: tools are open-market operations (most used), discount rate, reserve requirement. Buying securities = easing.",
          "Fiscal policy = Congress/President: taxes and spending.",
          "Yield curve: normal (upward) = healthy; inverted (downward) = often signals recession."
        ]
      }
    ]
  },
  {
    domain: 2,
    name: "Investment Vehicle Characteristics",
    weight: "25%",
    sections: [
      {
        h: "Cash & Money Market",
        points: [
          "Money market = short-term (≤1 yr), high quality, low risk: T-bills, commercial paper, CDs, bankers' acceptances, repos.",
          "T-bills: issued at discount, no coupon, ≤52 weeks. Commercial paper: corporate, ≤270 days, exempt from '33 Act registration."
        ]
      },
      {
        h: "Fixed Income",
        points: [
          "Price ↔ yield move INVERSELY. Premium bond: price>par, coupon>YTM. Discount bond: price<par, coupon<YTM.",
          "Yield ranking on a discount bond: nominal < current yield < YTM < YTC. (Reverse for premium bonds.)",
          "Treasuries: bills (discount), notes (2–10 yr), bonds (>10 yr); backed by full faith & credit; state-tax exempt.",
          "Munis: GO bonds backed by taxing power (voter approval); revenue bonds backed by project income. Interest federally tax-free.",
          "Taxable-equivalent yield = muni yield / (1 − tax bracket).",
          "Corporate ratings: investment grade BBB-/Baa3 and above; below = high-yield/junk. TIPS adjust principal for inflation."
        ]
      },
      {
        h: "Equity",
        points: [
          "Common stock: voting + residual claim, last in liquidation. Preferred: fixed dividend, priority over common, usually no vote.",
          "Preferred types: cumulative (missed dividends accrue), participating, convertible, callable, adjustable-rate.",
          "Rights: short-term, issued to existing holders at discount (anti-dilution). Warrants: long-term, issued above market, often sweeteners.",
          "ADRs: foreign shares trading in U.S.; carry currency risk; dividends in USD."
        ]
      },
      {
        h: "Pooled Investments",
        points: [
          "Open-end (mutual) funds: continuously issue/redeem at NAV (forward pricing); priced once daily.",
          "Closed-end funds: fixed shares, trade on exchange at premium/discount to NAV.",
          "ETFs: trade intraday like stock, usually index-based, low cost, tax-efficient.",
          "Share classes: A = front load; B = back-end/CDSC (declining); C = level load (12b-1). UIT: fixed, unmanaged portfolio.",
          "REITs: pass-through if ≥90% income distributed; not a direct participation program (no flow-through of losses)."
        ]
      },
      {
        h: "Derivatives",
        points: [
          "Call = right to BUY at strike (bullish). Put = right to SELL at strike (bearish).",
          "Buyer pays premium, has rights; writer/seller receives premium, has obligations.",
          "Call intrinsic value = market − strike (if positive). Put intrinsic = strike − market (if positive).",
          "Futures: standardized, exchange-traded obligation. Forwards: customized, OTC."
        ]
      },
      {
        h: "Annuities & Insurance",
        points: [
          "Fixed annuity: insurer bears risk, guaranteed rate (general account). Variable annuity: holder bears risk (separate account = security).",
          "Indexed annuity: return linked to an index with cap/floor/participation rate.",
          "Variable products require both securities AND insurance licenses. Tax-deferred growth; gains taxed as ordinary income.",
          "1035 exchange = tax-free swap between like insurance/annuity contracts."
        ]
      },
      {
        h: "Taxation",
        points: [
          "Long-term capital gains (held >1 yr) taxed at preferential rates; short-term taxed as ordinary income.",
          "Wash sale: loss disallowed if you buy the same/substantially identical security within 30 days before/after the sale.",
          "Qualified dividends taxed at LT cap-gains rates. Muni interest generally federally tax-exempt.",
          "Cost basis adjusts for reinvested dividends; FIFO is the default lot-accounting method."
        ]
      }
    ]
  },
  {
    domain: 3,
    name: "Client Investment Recommendations and Strategies",
    weight: "30%",
    sections: [
      {
        h: "Client Profile & Suitability",
        points: [
          "Gather: financial goals, time horizon, risk tolerance, liquidity needs, tax status, net worth, experience.",
          "Objectives: capital preservation, income, growth, speculation. Longer horizon → more equity/risk capacity.",
          "Nonfinancial factors (age, dependents, employment) matter alongside financial ones."
        ]
      },
      {
        h: "Capital Market Theory",
        points: [
          "EMH: weak (prices reflect past prices — TA useless), semi-strong (reflect all public info — FA useless), strong (reflect all info incl. insider).",
          "Modern Portfolio Theory: optimize risk/return via diversification; the efficient frontier = best return per unit of risk.",
          "CAPM: expected return = risk-free + beta × (market return − risk-free). Compensates for systematic risk only."
        ]
      },
      {
        h: "Asset Allocation & Styles",
        points: [
          "Strategic = long-term target mix; tactical = short-term tilts. Rebalancing restores the target mix (sell winners, buy laggards).",
          "Active (beat benchmark, higher cost) vs passive/indexing (match benchmark, low cost).",
          "Growth (high P/E, earnings momentum) vs value (low P/E, undervalued). Dollar-cost averaging = fixed $ at intervals → lower avg cost."
        ]
      },
      {
        h: "Bond Strategies",
        points: [
          "Laddering: staggered maturities → reduces interest-rate & reinvestment risk, steady liquidity.",
          "Barbell: short + long maturities. Bullet: cluster around one target date.",
          "Immunization: match duration to time horizon to lock in a return regardless of rate moves."
        ]
      },
      {
        h: "Retirement & Education Plans",
        points: [
          "Traditional IRA: pre-tax (if eligible), tax-deferred, RMDs at 73, 10% penalty before 59½. Roth IRA: after-tax, tax-free qualified withdrawals, no RMDs for owner.",
          "Roth contributions (not earnings) can be withdrawn anytime tax/penalty-free. Income limits apply to Roth.",
          "Employer plans: 401(k)/403(b)/457; SEP and SIMPLE for small employers. ERISA governs private employer plans (not government/IRAs).",
          "529 plan: tax-free growth for qualified education; high limits. Coverdell ESA: $2,000/yr limit, K-12 + college."
        ]
      },
      {
        h: "Accounts & Orders",
        points: [
          "Market order = immediate execution, no price guarantee. Limit order = price guarantee, no execution guarantee.",
          "Buy stop above market / sell stop below market; stop becomes a market order when triggered.",
          "UGMA/UTMA: custodial, irrevocable gift to a minor; one custodian, one minor; taxed to the minor (kiddie tax).",
          "TOD = transfer on death (avoids probate). JTWROS = survivorship; tenants in common = estate share passes to heirs."
        ]
      }
    ]
  },
  {
    domain: 4,
    name: "Laws, Regulations, and Guidelines",
    weight: "30%",
    sections: [
      {
        h: "Investment Advisers Act of 1940",
        points: [
          "IA definition (ABC test): provides Advice about securities, as a Business, for Compensation. All three = IA.",
          "Excluded from 'IA' (LATE): Lawyers, Accountants, Teachers, Engineers if advice is incidental & no special compensation; also banks and broker-dealers (incidental, no special fee), publishers of general circulation.",
          "Federal covered adviser: ≥$110M AUM (must register with SEC); <$100M registers with the state. $100M–$110M may choose. Registers with SEC if required to register in 15+ states.",
          "Form ADV: Part 1 (regulator info), Part 2A (brochure — plain English disclosure to clients), Part 2B (brochure supplement on personnel).",
          "Brochure rule: deliver brochure before/at entering contract; deliver/offer updated brochure annually.",
          "Custody: surprise annual exam by accountant; qualified custodian; account statements ≥ quarterly."
        ]
      },
      {
        h: "Uniform Securities Act (State / Blue-Sky)",
        points: [
          "Administrator = state securities regulator. Powers: investigate (in/out of state), subpoena, issue/deny/suspend/revoke registrations, cease-and-desist, rule-making.",
          "IAR de minimis: an IA with no state place of business need not register in a state if it has ≤5 non-institutional clients there in 12 months.",
          "BD/agent de minimis: no registration needed for an out-of-state BD dealing only with existing clients vacationing in the state, or with institutions.",
          "Registration effective: noon of the 30th day. Must file consent to service of process (appoints Administrator as attorney for legal process)."
        ]
      },
      {
        h: "Federal vs State (NSMIA)",
        points: [
          "NSMIA (1996) eliminated dual federal/state registration. Federal covered securities are exempt from STATE registration.",
          "Federal covered securities include: exchange-listed/Nasdaq, investment company (mutual fund) shares, securities sold to qualified purchasers.",
          "States retain anti-fraud authority over everyone and may require notice filing + fees from federal covered advisers/securities."
        ]
      },
      {
        h: "Definitions",
        points: [
          "Security: includes stocks, bonds, notes, investment contracts, options. Howey test = investment of money in a common enterprise with expectation of profit from others' efforts.",
          "NOT securities: fixed annuities, whole life insurance, commodities/futures, collectibles, retirement plan interests themselves.",
          "Agent = individual representing a BD/issuer in securities transactions. Clerical/admin staff are not agents."
        ]
      },
      {
        h: "Registration of Securities",
        points: [
          "Methods: Coordination (with federal registration — most common for IPOs), Qualification (state only, hardest), Notification/Filing.",
          "Exempt securities: U.S./municipal government, banks, insurance company securities, nonprofit, federal covered.",
          "Exempt transactions: private placements, isolated nonissuer transactions, transactions with institutions, unsolicited orders, fiduciary sales."
        ]
      },
      {
        h: "Fiduciary Duty & Ethics",
        points: [
          "IAs owe a FIDUCIARY duty (highest standard): act in client's best interest, full disclosure of all material conflicts, duty of care and loyalty.",
          "Disclose conflicts: compensation arrangements, affiliated products, soft-dollar use, capacity in a trade.",
          "Performance-based fees generally only for qualified clients (≥$1.1M AUM with adviser or ≥$2.2M net worth)."
        ]
      },
      {
        h: "Prohibited / Unethical Practices",
        points: [
          "Churning: excessive trading for commissions. Front running: trading ahead of a client's order.",
          "Misrepresentation, guaranteeing against loss, unauthorized (discretionary without written authority) trading.",
          "Commingling client funds with the firm's; borrowing from/lending to clients (unless a lending institution/affiliate).",
          "Selling away, market manipulation (wash trades, matched orders), and insider trading are prohibited.",
          "Agency cross transaction: allowed only with disclosure and client consent; can't have recommended both sides."
        ]
      },
      {
        h: "Other Regulations",
        points: [
          "Securities Act of 1933 = new issues/primary market (registration & prospectus — 'paper act'). Exchange Act of 1934 = secondary market, created the SEC.",
          "Section 28(e) safe harbor: soft dollars (research/brokerage benefits) permitted if they benefit clients.",
          "Reg S-P: privacy — deliver initial & annual privacy notices, allow opt-out of info sharing.",
          "USA statute of limitations: civil 3 years from sale or 2 from discovery (whichever first); criminal 5 years."
        ]
      }
    ]
  }
];
