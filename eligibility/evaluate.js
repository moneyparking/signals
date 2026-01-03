const rules = require('./rules.json');

function evaluate(input) {
  const triggered = [];

  const context = {
    monthly_spend: input.monthly_spend,
    scaling_signal: input.scaling_signal,
    revenue_lag: input.revenue_lag,
    funnel_type: input.funnel_type,
    data: input.data || []
  };

  for (const rule of rules.hard_decline) {
    if (eval(rule.condition)) {
      triggered.push(rule.id);
      return { decision: 'DECLINED', triggered };
    }
  }

  for (const rule of rules.manual_review) {
    if (eval(rule.condition)) {
      triggered.push(rule.id);
      return { decision: 'MANUAL_REVIEW', triggered };
    }
  }

  return { decision: 'ACCEPTED', triggered };
}

module.exports = { evaluate };
