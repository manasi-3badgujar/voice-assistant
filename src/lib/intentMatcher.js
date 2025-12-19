import { QA_RULES } from "./qaRules";

const normalize = text =>
  text.toLowerCase().replace(/[^a-z0-9 ]/g, "");

const similarity = (a, b) => {
  if (a.includes(b)) return 1;
  const aw = a.split(" ");
  let matches = 0;
  aw.forEach(w => b.includes(w) && matches++);
  return matches / aw.length;
};

export function matchIntent(input) {
  const text = normalize(input);
  const matched = [];
  const seenIntents = new Set();

  QA_RULES.forEach(rule => {
    let bestScore = 0;

    rule.keywords.forEach(k => {
      const score = similarity(text, normalize(k));
      if (score > bestScore) bestScore = score;
    });

    if (bestScore >= 0.4 && !seenIntents.has(rule.intent)) {
      seenIntents.add(rule.intent);
      matched.push({
        intent: rule.intent,
        response: rule.response,
        confidence: bestScore,
      });
    }
  });

  if (!matched.length) {
    return [{
      intent: "fallback",
      response:
        "I’m sorry, I didn’t understand that. Could you please rephrase?",
      confidence: 0,
    }];
  }

  return matched;
};