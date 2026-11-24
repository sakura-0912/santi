(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.SantiRules = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const clone = (value) => JSON.parse(JSON.stringify(value));

  function formatCountdown(hours) {
    const total = Math.max(0, Math.floor(hours));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return [String(h).padStart(4, "0"), String(m).padStart(2, "0"), String(s).padStart(2, "0")].join(":");
  }

  const SIM_SCENARIOS = {
    1: {
      id: 1,
      title: "周文王·长夜",
      subtitle: "第 137 号文明 / 恒纪元与乱纪元的第一次交替",
      maxTurns: 4,
      events: ["stable", "chaos", "chaos", "stable"],
      forecasts: ["stable", "chaos", "chaos", "stable"],
      confidence: [0.92, 0.84, 0.78, 0.88],
      actions: ["dehydrate", "store", "research"],
      intro: "你在一座夯土城邑外醒来。周文王说，太阳已经三天没有落下。",
    },
    2: {
      id: 2,
      title: "墨子·烈焰",
      subtitle: "第 139 号文明 / 烈焰与迁徙",
      maxTurns: 5,
      events: ["stable", "chaos", "triSun", "chaos", "stable"],
      forecasts: ["stable", "chaos", "stable", "chaos", "stable"],
      confidence: [0.71, 0.63, 0.58, 0.61, 0.74],
      actions: ["dehydrate", "store", "research", "migrate", "sacrifice"],
      intro: "墨子把一座铜球抬上观星台。他说宇宙是一只两层球壳，太阳只是壳上的洞。",
    },
    3: {
      id: 3,
      title: "牛顿·人列计算机",
      subtitle: "第 184 号文明 / 三日连珠",
      maxTurns: 6,
      events: ["stable", "stable", "chaos", "triSun", "chaos", "stable"],
      forecasts: ["stable", "stable", "chaos", "stable", "chaos", "stable"],
      confidence: [0.66, 0.64, 0.57, 0.62, 0.55, 0.7],
      actions: ["dehydrate", "store", "research", "migrate", "compute"],
      intro: "秦始皇的三千万军队在平原上列成方阵。冯·诺伊曼说，这会是一台计算机。",
    },
  };

  const ACTION_INFO = {
    dehydrate: {
      label: "脱水",
      icon: "i-sun",
      desc: "排出水分，保存人口。乱纪元中伤亡最小，但恒纪元里浪费科研窗口。",
      short: "保存人口",
    },
    store: {
      label: "储粮",
      icon: "i-flask",
      desc: "把粮食搬进地窖。稳定 +2，粮食 +16；若乱纪元突至，人口仍暴露在外。",
      short: "粮食 +16",
    },
    research: {
      label: "观测 / 研究",
      icon: "i-wave",
      desc: "记录太阳运行。知识 +12，粮食 -6；乱纪元中可能付出人口代价。",
      short: "知识 +12",
    },
    migrate: {
      label: "迁徙",
      icon: "i-eye",
      desc: "把人口迁往地下城。粮食 -10，人口 -4，稳定 +6；下一次灾难伤害减半。",
      short: "降低灾害",
    },
    sacrifice: {
      label: "献祭",
      icon: "i-seal",
      desc: "把一部分人口留在荒原，换取粮食与稳定。人口 -12，粮食 +20，稳定 +10。",
      short: "人口换粮",
    },
    compute: {
      label: "人列计算机",
      icon: "i-dish",
      desc: "用三千万人的方阵求解太阳方程。需要知识 ≥ 25；知识 +8，稳定 +4，粮食 -8。",
      short: "需要知识 25",
    },
  };

  const EVENT_INFO = {
    stable: { label: "恒纪元", tone: "stable", text: "太阳沿着可预测的轨道升起，大地进入短暂的安全窗口。" },
    chaos: { label: "乱纪元", tone: "chaos", text: "太阳突然偏离预报，昼夜在几个小时内反复颠倒。" },
    triSun: { label: "三日凌空", tone: "chaos", text: "三颗太阳排成一线，引力叠加，地表开始向天空剥离。" },
    dark: { label: "太阳熄灭", tone: "chaos", text: "太阳在正空突然熄灭，气温骤降，文明退回寒冷与饥饿。" },
  };

  function deterministicRoll(seed, turn, salt) {
    const x = Math.sin(seed * 12.9898 + turn * 78.233 + salt * 37.719) * 43758.5453;
    return x - Math.floor(x);
  }

  function prepareForecast(sim) {
    const scenario = SIM_SCENARIOS[sim.id];
    const index = sim.turn - 1;
    const actual = scenario.events[index];
    const forecast = scenario.forecasts[index];
    const confidence = scenario.confidence[index];
    sim.forecast = {
      event: forecast,
      confidence,
      actual,
      honest: forecast === actual,
    };
    return sim;
  }

  function createSimulation(sessionId, seed) {
    const scenario = SIM_SCENARIOS[sessionId];
    if (!scenario) throw new Error("Unknown simulation: " + sessionId);
    const sim = {
      id: sessionId,
      title: scenario.title,
      subtitle: scenario.subtitle,
      turn: 1,
      maxTurns: scenario.maxTurns,
      population: 100,
      food: 60,
      knowledge: 0,
      stability: 60,
      status: "playing",
      actions: scenario.actions.slice(),
      ideology: { savior: 0, survivor: 0, advent: 0 },
      protected: false,
      migrated: false,
      computed: false,
      log: [],
      history: [],
      lastEvent: null,
      lastAction: null,
      seed: Number(seed || scenario.id * 1009 + 17),
      intro: scenario.intro,
    };
    prepareForecast(sim);
    return sim;
  }

  function addLog(sim, text, meta) {
    sim.log.unshift({
      turn: sim.turn,
      text,
      meta: meta || "",
    });
    if (sim.log.length > 18) sim.log.length = 18;
  }

  function applyAction(sim, actionId) {
    const action = ACTION_INFO[actionId];
    if (!action) return { ok: false, error: "未知行动。" };
    if (!sim.actions.includes(actionId)) return { ok: false, error: "本轮文明还没有掌握这项行动。" };
    if (actionId === "compute" && sim.knowledge < 25) {
      return { ok: false, error: "人列计算机需要至少 25 点知识。" };
    }
    if (actionId === "sacrifice" && sim.population < 12) {
      return { ok: false, error: "人口不足，无法献祭。" };
    }

    const deltas = { population: 0, food: 0, knowledge: 0, stability: 0 };
    if (actionId === "dehydrate") {
      sim.protected = true;
      deltas.food += 4;
      deltas.stability += 3;
      sim.ideology.survivor += 1;
      addLog(sim, "人口脱水，变成干燥的纤维状物体。", "幸存派 +1");
    } else if (actionId === "store") {
      deltas.food += 16;
      deltas.stability += 2;
      sim.ideology.survivor += 1;
      addLog(sim, "粮食被搬进地窖，城门外的风却更冷了。", "幸存派 +1");
    } else if (actionId === "research") {
      deltas.knowledge += 12;
      deltas.food -= 6;
      sim.ideology.savior += 1;
      addLog(sim, "观测员记录太阳的每一次偏转，试图从中找出规律。", "拯救派 +1");
    } else if (actionId === "migrate") {
      sim.migrated = true;
      deltas.food -= 10;
      deltas.population -= 4;
      deltas.stability += 6;
      sim.ideology.survivor += 1;
      addLog(sim, "人口迁入地下城，荒原上留下空空的城邑。", "幸存派 +1");
    } else if (actionId === "sacrifice") {
      deltas.food += 20;
      deltas.stability += 10;
      deltas.population -= 12;
      sim.ideology.advent += 2;
      addLog(sim, "一部分人被留在荒原。粮食和秩序都保住了。", "降临派 +2");
    } else if (actionId === "compute") {
      deltas.knowledge += 8;
      deltas.stability += 4;
      deltas.food -= 8;
      sim.computed = true;
      sim.ideology.savior += 2;
      addLog(sim, "三千万人的方阵开始运算。答案还没有出来，太阳已经变了。", "拯救派 +2");
    }

    sim.population = clamp(sim.population + deltas.population, 0, 999);
    sim.food = clamp(sim.food + deltas.food, 0, 999);
    sim.knowledge = clamp(sim.knowledge + deltas.knowledge, 0, 999);
    sim.stability = clamp(sim.stability + deltas.stability, 0, 100);
    sim.lastAction = actionId;
    return { ok: true, deltas, action };
  }

  function applyEvent(sim) {
    const eventId = SIM_SCENARIOS[sim.id].events[sim.turn - 1];
    const event = EVENT_INFO[eventId];
    const prepared = sim.protected || sim.migrated;
    const deltas = { population: 0, food: 0, knowledge: 0, stability: 0 };

    if (eventId === "stable") {
      deltas.food += 8;
      deltas.population += 2;
    } else if (eventId === "chaos") {
      if (prepared) {
        deltas.population -= 2;
        deltas.stability -= 2;
      } else {
        deltas.population -= 12;
        deltas.stability -= 10;
      }
    } else if (eventId === "triSun") {
      if (prepared) {
        deltas.population -= 5;
        deltas.stability -= 6;
      } else {
        deltas.population -= 35;
        deltas.stability -= 30;
        deltas.food -= 10;
      }
    } else if (eventId === "dark") {
      if (prepared) {
        deltas.population -= 8;
        deltas.stability -= 4;
      } else {
        deltas.population -= 25;
        deltas.food -= 15;
        deltas.stability -= 10;
      }
    }

    sim.population = clamp(sim.population + deltas.population, 0, 999);
    sim.food = clamp(sim.food + deltas.food, 0, 999);
    sim.stability = clamp(sim.stability + deltas.stability, 0, 100);

    const forecast = sim.forecast;
    const forecastText = forecast.honest
      ? "预报命中。"
      : "预报错误。太阳没有按计算出现。";
    addLog(sim, event.label + "：" + event.text + " " + forecastText, forecastText);
    sim.lastEvent = {
      id: eventId,
      label: event.label,
      text: event.text,
      deltas,
      forecastHonest: forecast.honest,
    };
    sim.history.push({ turn: sim.turn, event: eventId, action: sim.lastAction, deltas });
    sim.protected = false;
    sim.migrated = false;

    if (sim.population <= 0 || sim.stability <= 0) {
      sim.status = "lost";
      addLog(sim, "文明在第 " + sim.turn + " 回合毁灭。", "轮回");
    } else if (sim.turn >= sim.maxTurns) {
      sim.status = "won";
      addLog(sim, "本轮文明存续。太阳落下，下一轮还会开始。", "存续");
    } else {
      sim.turn += 1;
      prepareForecast(sim);
    }
    return { event, deltas };
  }

  function resolveTurn(sim, actionId) {
    if (sim.status !== "playing") {
      return { ok: false, error: "本轮文明已经结束。" };
    }
    const next = clone(sim);
    const actionResult = applyAction(next, actionId);
    if (!actionResult.ok) return actionResult;
    const eventResult = applyEvent(next);
    return {
      ok: true,
      sim: next,
      action: actionResult.action,
      actionDeltas: actionResult.deltas,
      event: eventResult.event,
      eventDeltas: eventResult.deltas,
    };
  }

  function simulationSummary(sim) {
    const survived = sim.status === "won" && sim.population > 0 && sim.stability > 0;
    const ideology = Object.entries(sim.ideology).sort((a, b) => b[1] - a[1])[0][0];
    const ideologyLabel = { savior: "拯救派", survivor: "幸存派", advent: "降临派" }[ideology];
    const score = Math.round(
      sim.population * 0.45 +
      sim.food * 0.12 +
      sim.knowledge * 1.1 +
      sim.stability * 0.45 +
      (survived ? 20 : 0)
    );
    return {
      survived,
      ideology,
      ideologyLabel,
      score,
      population: sim.population,
      food: sim.food,
      knowledge: sim.knowledge,
      stability: sim.stability,
      trustGain: survived ? (sim.knowledge >= 40 ? 3 : 2) : -1,
      summary: survived
        ? "第 " + sim.id + " 局文明存续。你在 " + sim.maxTurns + " 个回合里留下了 " + ideologyLabel + " 的痕迹。"
        : "第 " + sim.id + " 局文明毁灭。失败也是数据，管理员会记住你怎样失败。",
    };
  }

  const DEDUCTIONS = {
    d1: {
      id: "d1",
      title: "倒计时指向哪里？",
      prompt: "从证据里选出两项，说明倒计时为什么会找上汪淼。",
      required: ["countdown", "nano"],
      success: "倒计时不是死亡预告。它在阻止你继续推进纳米材料项目。",
      fail: "这还不能解释为什么倒计时会出现在你的底片上。",
    },
    d2: {
      id: "d2",
      title: "叶文洁是谁？",
      prompt: "从证据里选出两项，说明叶文洁与红岸、与三体世界的关系。",
      required: ["redCoast", "yeReply"],
      success: "叶文洁不是普通的遗属。她就是那个收到警告、又按下了发射键的人。",
      fail: "红岸和叶文洁之间还差一条能把她说成“回信者”的证据。",
    },
    d3: {
      id: "d3",
      title: "怎样拿到船上的信息？",
      prompt: "从证据里选出三项，说明为什么不能强攻“审判日”号。",
      required: ["judgmentDay", "data", "nano"],
      success: "强攻会让他们在十秒内毁掉信息。只有纳米丝能在同一瞬间切断守卫与船体。",
      fail: "你还没有把“船上的信息”“强攻的代价”和“飞刃”连成一条线。",
    },
  };

  function checkDeduction(id, selected) {
    const deduction = DEDUCTIONS[id];
    if (!deduction) return { ok: false, error: "未知判断。" };
    const unique = Array.from(new Set(selected || []));
    if (unique.length !== deduction.required.length) {
      return { ok: false, error: "需要恰好选择 " + deduction.required.length + " 项证据。" };
    }
    const ok = deduction.required.every((clue) => unique.includes(clue));
    return {
      ok,
      deduction,
      error: ok ? "" : deduction.fail,
    };
  }

  function evaluateFinale(plan, stats, clues) {
    const s = stats || {};
    const c = clues || {};
    let data = 20;
    let eto = 30;
    let deaths = 40;
    let world = 20;
    const reasons = [];

    if (plan.site === "gaillard") {
      data += 25;
      eto += 18;
      deaths -= 8;
      reasons.push("盖拉德水道最窄处：材料够，船体刚好填满河道。");
    } else if (plan.site === "locks") {
      data += 4;
      eto += 8;
      deaths += 18;
      reasons.push("船闸：船速慢，但警戒最高，切割容易被提前发现。");
    } else {
      data -= 12;
      eto += 4;
      deaths += 26;
      reasons.push("美洲大桥：桥墩间距太宽，飞刃不够长。");
    }

    if (plan.spacing === "0.5") {
      data += 22;
      eto += 18;
      deaths -= 8;
      reasons.push("0.5 米丝距：白天足够切断站立或蹲伏的人，材料仍够用。");
    } else if (plan.spacing === "1") {
      data -= 18;
      eto -= 14;
      deaths += 18;
      reasons.push("1 米丝距：有人能从空隙里躲过，行动会留下活口。");
    } else {
      data -= 10;
      eto -= 8;
      deaths += 8;
      reasons.push("0.25 米丝距：材料不够，河道中央会出现缺口。");
    }

    if (plan.timing === "day") {
      data += 14;
      eto += 10;
      deaths -= 6;
      reasons.push("白天过船：人员站立或蹲伏，切割面更完整。");
    } else {
      data -= 14;
      eto -= 10;
      deaths += 14;
      reasons.push("夜间过船：人员躺卧，刀口会从身体上方掠过。");
    }

    if (plan.priority === "data") {
      data += 18;
      eto += 4;
      deaths += 10;
      reasons.push("首要目标：完整夺取信息。你接受了行动中的附带伤亡。");
    } else if (plan.priority === "lives") {
      data -= 12;
      eto -= 12;
      deaths -= 28;
      reasons.push("首要目标：先救人。你要求为疏散和警告留出时间。");
    } else {
      data -= 28;
      eto += 12;
      deaths += 18;
      reasons.push("首要目标：确保击沉。信息不再是第一优先级。");
    }

    if (plan.warning) {
      data -= 22;
      eto -= 8;
      deaths -= 32;
      reasons.push("你警告了船上的平民。ETO 也听见了警告。");
    } else {
      data += 4;
      eto += 4;
      deaths += 8;
      reasons.push("没有警告。行动保住了突然性，也保住了代价。");
    }

    if (c.judgmentDay && c.data) {
      data += 10;
      eto += 8;
      reasons.push("你掌握“审判日”号与 28G 信息的位置，行动不是盲打。");
    }
    if (c.nano) {
      data += 5;
      reasons.push("飞刃的产量与丝距被你提前算过。");
    }
    if (c.sophon) {
      data += 4;
      reasons.push("你知道智子可能在看，因此没有使用会被拦截的电子指令。");
    }
    if ((s.trustShi || 0) >= 4) {
      data += 5;
      eto += 8;
      reasons.push("军方信任你，行动组采纳了你的参数。");
    } else {
      eto -= 6;
      reasons.push("军方没有完全信任你，关键参数被保守地改过。");
    }
    if ((s.insight || 0) >= 5) {
      data += 5;
      world += 8;
      reasons.push("你的判断足够完整，行动后能把真相讲清楚。");
    }
    if ((s.exposure || 0) >= 5) {
      data -= 18;
      eto -= 12;
      reasons.push("ETO 已经看见你，船上的信息被提前转移或删除。");
    }
    if (plan.priority === "lives" || plan.warning) {
      if ((s.integrity || 0) >= 4) {
        deaths -= 8;
        reasons.push("你在前两次选择里保住的底线，让行动组愿意多等十分钟。");
      }
    }

    data = clamp(Math.round(data), 0, 100);
    eto = clamp(Math.round(eto), 0, 100);
    deaths = clamp(Math.round(deaths), 0, 100);
    world = clamp(Math.round(20 + data * 0.5 + (plan.warning ? 10 : 0) + (s.insight || 0) * 2), 0, 100);

    let ending = "information_first";
    let failureReason = "";
    if (
      (s.exposure || 0) >= 5 ||
      plan.site !== "gaillard" ||
      plan.spacing !== "0.5" ||
      plan.timing !== "day" ||
      data < 40
    ) {
      ending = "sophon";
    } else if (plan.priority === "lives" || plan.warning) {
      ending = "clean_hands";
    } else if (plan.priority === "data" && !plan.warning && data >= 70 && eto >= 55 && deaths <= 55 && c.data && c.judgmentDay) {
      ending = "canon";
    }

    if (ending === "sophon") {
      if ((s.exposure || 0) >= 5) {
        failureReason = "ETO 提前看见了你，船上的信息被删除或转移。";
        data = 0;
        eto = Math.min(eto, 35);
      } else if (plan.site !== "gaillard") {
        failureReason = "伏击点错误。船没有进入琴弦最有效的切割位置。";
        data = Math.min(data, 25);
        eto = Math.min(eto, 40);
      } else if (plan.spacing !== "0.5") {
        failureReason = "丝距错误。船体没有被完整切断，敌人有时间删除信息。";
        data = Math.min(data, 30);
        eto = Math.min(eto, 45);
      } else if (plan.timing !== "day") {
        failureReason = "时机错误。人员躺卧，刀口从身体上方掠过，行动失去突然性。";
        data = Math.min(data, 30);
        eto = Math.min(eto, 45);
      } else {
        failureReason = "行动没有拿到足够的信息，人类错过了看清敌人的窗口。";
        data = Math.min(data, 35);
        eto = Math.min(eto, 50);
      }
      world = Math.min(world, 35);
      deaths = Math.max(deaths, 25);
      reasons.unshift(failureReason);
    }

    return {
      dataRecovered: data,
      etoNeutralized: eto,
      civilianDeaths: deaths,
      worldKnows: world,
      ending,
      failureReason,
      reasons,
    };
  }

  return {
    clamp,
    clone,
    formatCountdown,
    SIM_SCENARIOS,
    ACTION_INFO,
    EVENT_INFO,
    createSimulation,
    resolveTurn,
    simulationSummary,
    DEDUCTIONS,
    checkDeduction,
    evaluateFinale,
  };
});
