import { Rule, RuleContext } from "../rules/basicRules";

export function evaluateRules(
  rules: Rule[],
  password: string,
  ctx: RuleContext
) {
  return rules.map((rule) => ({
    id: rule.id,
    order: rule.order,

    ok: rule.check(password, ctx),
    message: rule.message(ctx),

    rule, // 👈 🔥 KRİTİK SATIR
  }));
}
