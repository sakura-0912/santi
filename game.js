(function () {
  "use strict";

  const R = window.SantiRules;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const SAVE_KEY = "santi-countdown-save-v1";
  const ENDING_KEY = "santi-countdown-endings-v1";
  const SOUND_KEY = "santi-countdown-sound-v1";

  const CHAPTERS = {
    0: "序章",
    1: "第一章 · 倒计时",
    2: "第二章 · 三体游戏",
    3: "第三章 · 古筝",
  };

  const CLUES = {
    countdown: {
      tag: "异常记录",
      title: "1200 小时倒计时",
      body: "三卷黑白底片上都出现了白色数字。第一张是 1200:00:00，随后每一张都在减少。相机是纯机械的莱卡 M2，不可能叠印日期。",
    },
    nano: {
      tag: "项目档案",
      title: "纳米材料与飞刃",
      body: "汪淼负责的纳米项目可以生产极细的丝状材料。头发丝百分之一粗的飞刃，理论上能把行驶中的汽车像奶酪一样切开。",
    },
    suicides: {
      tag: "军方名单",
      title: "科学家接连自杀",
      body: "近两个月，十几名基础科学前沿的学者自杀。名单上最后一个名字是杨冬，汪淼认识她。",
    },
    scienceFrontier: {
      tag: "组织档案",
      title: "科学边界",
      body: "一个在国际学术界很有影响的组织，成员多是著名学者。军方怀疑它与科学家自杀有关，但没有公开证据。",
    },
    gameRecruit: {
      tag: "游戏记录",
      title: "《三体》是招募工具",
      body: "游戏管理员会收集高分级玩家的真实姓名、学历、工作单位。玩家聚会不是同好会，而是筛选。",
    },
    panHan: {
      tag: "人物档案",
      title: "潘寒",
      body: "生物学家、媒体名人、地球三体组织成员。他在玩家聚会上说出了“三体世界是真实存在的”。",
    },
    redCoast: {
      tag: "历史档案",
      title: "红岸基地",
      body: "雷达峰上的绝密监听/发射基地。叶文洁在那里工作过，并收到过一段来自四光年外的重复警告。",
    },
    yeReply: {
      tag: "核心事实",
      title: "叶文洁的回信",
      body: "她没有听从“不要回答”的警告。她把发射频率对准太阳，按下了红色发射键：“到这里来吧，我将帮助你们获得这个世界。”",
    },
    fleet: {
      tag: "文明情报",
      title: "三体舰队已起航",
      body: "三体世界决定远征太阳系。舰队将在约 450 年后到达。人类还有四个半世纪，但战争已经开始。",
    },
    threeBody: {
      tag: "科学事实",
      title: "三体问题不可解",
      body: "三颗太阳的运动没有一般解析解。局部可以预测，整体无法长期计算。三体文明数百次轮回都困在这件事上。",
    },
    judgmentDay: {
      tag: "目标档案",
      title: "审判日号",
      body: "六万吨级油轮改装的第二红岸基地。船体内部结构复杂，伊文斯等降临派核心常驻其上，存储着被截留的三体信息。",
    },
    data: {
      tag: "目标档案",
      title: "28G 三体信息",
      body: "三体世界发给地球的全部信息被降临派截留，约 28G。强攻会让敌人有十秒钟时间打烂硬盘。",
    },
    sophon: {
      tag: "敌方能力",
      title: "智子",
      body: "三体人把质子二维展开、蚀刻成超级计算机，再用量子感应实时监视地球。它能干扰加速器，也能把倒计时投进你的视网膜。",
    },
    factionSplit: {
      tag: "组织档案",
      title: "ETO 三派",
      body: "降临派要借三体文明毁灭人类；拯救派把三体当神，想拯救主；幸存派想为子孙在战败后留一条命。三派已经兵戎相见。",
    },
  };

  const ENDINGS = {
    canon: {
      kicker: "结局一 · 原著线",
      title: "虫子",
      seal: "存",
      art: "ending-canon",
      quote: "“虫子从来就没有被真正战胜过。”",
      text: [
        "古筝行动成功。审判日号被切成四十多片，伊文斯死在指挥中心，约 28G 的三体信息被找回。",
        "叶文洁在审讯中承认了红岸的回信，也承认自己点燃了火。她没有为自己辩解。",
        "几天后，史强把汪淼和丁仪带到华北大平原。麦田被蝗虫覆盖，三个人站在田埂上，像三只很小的虫子。",
        "汪淼第一次觉得，“弱小”并不是“灭绝”的同义词。人类还有很多事要做。",
      ],
    },
    information_first: {
      kicker: "结局二 · 信息优先",
      title: "干净的刀",
      seal: "取",
      art: "ending-info",
      quote: "“你保住了信息，却没保住自己相信的东西。”",
      text: [
        "你选择了完整夺取信息。行动参数被压到极限，审判日号上的守卫、引水员和部分船员没有时间反应。",
        "28G 信息被找回。人类第一次读到了三体世界的真实面貌，也第一次看见自己在“文明存续”四个字下面能做出什么。",
        "史强说这是必要的代价。你没有反驳。你只是把手放在桌面上，发现它一直在抖。",
        "信息被送进作战中心。窗外天亮了，运河的水还是红的。",
      ],
    },
    clean_hands: {
      kicker: "结局三 · 干净的手",
      title: "没有琴声的运河",
      seal: "救",
      art: "ending-clean",
      quote: "“你救下了一些人，也放走了一些东西。”",
      text: [
        "你要求先警告船上的平民，再执行行动。警告发出去的那一刻，审判日号开始转向，船上的服务器进入删除程序。",
        "古筝行动只夺回了一部分信息。伊文斯死了，但降临派的核心网络没有完全摧毁。",
        "你救下了一些本不该死的人。你也知道，未来会有更多人因为这份不完整的情报而死。",
        "叶文洁听完审讯记录，只说了一句：“你比我更相信人。”",
      ],
    },
    sophon: {
      kicker: "结局四 · 被看见的人",
      title: "被看见的人",
      seal: "盲",
      art: "ending-sophon",
      quote: "“智子一直在看着。”",
      text: [
        "行动没有按计划完成。审判日号没有在预期位置进入琴弦，船上的信息被删除或转移，只找回少量残片。",
        "古筝行动失败。人类失去了一次完整获取三体情报的机会，也失去了在战争开始前看清敌人的窗口。",
        "你回到暗房，重新冲洗那卷底片。红灯下，白色数字又出现了：1200:00:00。",
        "这一次，它不是在倒计时。它是在提醒你：你被看见了，而机会只有一次。",
      ],
    },
  };

  const ART = {
    "city-night": `
      <div class="art-layer art-city-night">
        <div class="city-buildings"></div>
        <div class="city-window-lights"></div>
      </div>`,
    darkroom: `
      <div class="art-layer art-darkroom">
        <div class="darkroom-redlight"></div>
        <div class="darkroom-photos">
          <div class="darkroom-photo" data-num="01" style="--r:-2deg"></div>
          <div class="darkroom-photo" data-num="02" style="--r:1.5deg"></div>
          <div class="darkroom-photo" data-num="03" style="--r:-1deg"></div>
        </div>
        <div class="darkroom-tray"></div>
      </div>`,
    villa: `
      <div class="art-layer art-villa">
        <div class="villa-window"></div>
        <div class="villa-shelf"></div>
        <div class="villa-lamp"></div>
      </div>`,
    warroom: `
      <div class="art-layer art-warroom">
        <div class="warroom-screens">
          <div class="warroom-screen"></div><div class="warroom-screen"></div><div class="warroom-screen"></div>
          <div class="warroom-screen"></div><div class="warroom-screen"></div><div class="warroom-screen"></div>
        </div>
        <div class="warroom-table"></div>
      </div>`,
    lab: `
      <div class="art-layer art-lab">
        <div class="lab-grid"></div>
        <div class="lab-screen"></div>
        <div class="lab-fiber"></div>
      </div>`,
    cafe: `
      <div class="art-layer art-cafe">
        <div class="cafe-window"></div>
        <div class="cafe-tables"></div>
      </div>`,
    redcoast: `
      <div class="art-layer art-redcoast">
        <div class="redcoast-snow"></div>
        <div class="redcoast-dish"></div>
        <div class="redcoast-console"></div>
      </div>`,
    eto: `
      <div class="art-layer art-eto">
        <div class="eto-hall"></div>
        <div class="eto-emblem"></div>
      </div>`,
    "ending-canon": `<div class="art-layer art-ending-canon"></div>`,
    "ending-info": `<div class="art-layer art-ending-info"></div>`,
    "ending-clean": `<div class="art-layer art-ending-clean"></div>`,
    "ending-sophon": `<div class="art-layer art-ending-sophon"></div>`,
  };

  const el = {
    titleScreen: $("#titleScreen"),
    gameScreen: $("#gameScreen"),
    endingScreen: $("#endingScreen"),
    newGameBtn: $("#newGameBtn"),
    continueBtn: $("#continueBtn"),
    galleryBtn: $("#galleryBtn"),
    titleHelpBtn: $("#titleHelpBtn"),
    titleSoundBtn: $("#titleSoundBtn"),
    chapterKicker: $("#chapterKicker"),
    chapterTitle: $("#chapterTitle"),
    insightValue: $("#insightValue"),
    shiValue: $("#shiValue"),
    etoValue: $("#etoValue"),
    exposureValue: $("#exposureValue"),
    caseBtn: $("#caseBtn"),
    clueCount: $("#clueCount"),
    soundBtn: $("#soundBtn"),
    menuBtn: $("#menuBtn"),
    stage: $("#stage"),
    stageArt: $("#stageArt"),
    stageContent: $("#stageContent"),
    stagePlace: $("#stagePlace"),
    stageTime: $("#stageTime"),
    stageCaption: $("#stageCaption"),
    casePanel: $("#casePanel"),
    caseCloseBtn: $("#caseCloseBtn"),
    caseStats: $("#caseStats"),
    caseList: $("#caseList"),
    caseFoot: $("#caseFoot"),
    dialoguePanel: $("#dialoguePanel"),
    speakerSeal: $("#speakerSeal"),
    speakerName: $("#speakerName"),
    speakerRole: $("#speakerRole"),
    dialogueText: $("#dialogueText"),
    dialogueActions: $("#dialogueActions"),
    advanceBtn: $("#advanceBtn"),
    modalRoot: $("#modalRoot"),
    toast: $("#toast"),
    endingArt: $("#endingArt"),
    endingKicker: $("#endingKicker"),
    endingTitle: $("#endingTitle"),
    endingSeal: $("#endingSeal"),
    endingQuote: $("#endingQuote"),
    endingText: $("#endingText"),
    endingStats: $("#endingStats"),
    endingReplayBtn: $("#endingReplayBtn"),
    endingFinaleBtn: $("#endingFinaleBtn"),
    endingGalleryBtn: $("#endingGalleryBtn"),
  };

  let state = createInitialState();
  let modalOpen = false;
  let toastTimer = null;
  let cinematicTimer = null;
  let audio = null;

  function createInitialState() {
    return {
      version: 1,
      scene: "prologue",
      chapter: 0,
      beat: 0,
      stats: {
        insight: 0,
        trustShi: 0,
        trustEto: 0,
        exposure: 0,
        integrity: 0,
      },
      clues: {},
      deductions: {},
      entered: {},
      hotspots: {},
      flags: {},
      sim: null,
      simPending: null,
      simResults: [],
      finale: null,
      finaleResult: null,
      finalePhase: null,
      ending: null,
      dialogueOverride: null,
      startedAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  function save() {
    try {
      state.updatedAt = Date.now();
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (error) {
      // localStorage may be unavailable in a private window.
    }
  }

  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== 1 || !parsed.scene) return null;
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function unlockedEndings() {
    try {
      return JSON.parse(localStorage.getItem(ENDING_KEY) || "[]");
    } catch (error) {
      return [];
    }
  }

  function unlockEnding(id) {
    const list = unlockedEndings();
    if (!list.includes(id)) {
      list.push(id);
      try {
        localStorage.setItem(ENDING_KEY, JSON.stringify(list));
      } catch (error) {
        // ignore
      }
    }
  }

  function syncHud() {
    if (!el.insightValue) return;
    el.insightValue.textContent = insightLabel(state.stats.insight);
    el.shiValue.textContent = shiLabel(state.stats.trustShi);
    el.etoValue.textContent = etoLabel(state.stats.trustEto);
    el.exposureValue.textContent = exposureLabel(state.stats.exposure);
    el.clueCount.textContent = String(clueCount());
    const available = activeDeductions();
    el.caseBtn.classList.toggle("has-deduction", available.length > 0);
    el.caseBtn.title = available.length
      ? "证据夹：有 " + available.length + " 条判断待整理"
      : "打开证据夹";
    renderCase();
  }

  function adjust(key, amount) {
    state.stats[key] = R.clamp((state.stats[key] || 0) + amount, 0, 99);
    save();
    syncHud();
  }

  function setFlag(key, value) {
    state.flags[key] = value === undefined ? true : value;
  }

  function addClue(id) {
    if (!CLUES[id] || state.clues[id]) return;
    state.clues[id] = true;
    showToast("新线索：" + CLUES[id].title);
    Sound.seal();
    save();
    syncHud();
    if (activeDeductions().length && !state.flags.deductionPromptShown) {
      state.flags.deductionPromptShown = true;
      save();
      window.setTimeout(() => showToast("证据夹里出现了一条可提交的判断。"), 900);
    }
  }

  function clueCount() {
    return Object.keys(state.clues).filter((key) => state.clues[key]).length;
  }

  function hasClues(ids) {
    return ids.every((id) => state.clues[id]);
  }

  function insightLabel(value) {
    if (value >= 6) return "贯通";
    if (value >= 4) return "实证";
    if (value >= 2) return "推断";
    return "旁证";
  }

  function shiLabel(value) {
    if (value >= 4) return "行动成员";
    if (value >= 2) return "有限合作";
    return "被监视";
  }

  function etoLabel(value) {
    if (value >= 4) return "被招揽";
    if (value >= 2) return "被观察";
    return "未入名单";
  }

  function exposureLabel(value) {
    if (value >= 4) return "已被看见";
    if (value >= 2) return "有回声";
    return "安全";
  }

  function activeDeductions() {
    return Object.values(R.DEDUCTIONS).filter((deduction) => {
      if (state.deductions[deduction.id]) return false;
      return hasClues(deduction.required);
    });
  }

  function nextSceneId(scene) {
    if (!scene || !scene.next) return null;
    return typeof scene.next === "function" ? scene.next() : scene.next;
  }

  function goTo(id, options) {
    const scene = SCENES[id];
    if (!scene) {
      console.error("Unknown scene", id);
      return;
    }
    state.scene = id;
    state.chapter = scene.chapter === undefined ? state.chapter : scene.chapter;
    state.beat = 0;
    state.dialogueOverride = null;
    state.finalePhase = null;
    if (!state.entered[id]) {
      state.entered[id] = true;
      if (scene.onEnter) scene.onEnter();
    }
    if (id === "game1") ensureSimulation(1);
    if (id === "game2") ensureSimulation(2);
    if (id === "game3") ensureSimulation(3);
    if (id === "finale") ensureFinale();
    save();
    if (id === "ending") {
      renderEnding();
      return;
    }
    showScreen("game");
    renderGame();
    if (options && options.focus) {
      window.setTimeout(() => {
        const target = $("[data-focus='" + options.focus + "']");
        if (target) target.focus();
      }, 40);
    }
  }

  function showScreen(name) {
    el.titleScreen.classList.toggle("hidden", name !== "title");
    el.gameScreen.classList.toggle("hidden", name !== "game");
    el.endingScreen.classList.toggle("hidden", name !== "ending");
    if (name === "title") updateTitleButtons();
  }

  function updateTitleButtons() {
    const saved = loadSave();
    el.continueBtn.classList.toggle("hidden", !saved);
    const unlocked = unlockedEndings().length;
    el.galleryBtn.textContent = unlocked ? "结局档案 · " + unlocked + "/4" : "结局档案";
  }

  function showToast(text, tone) {
    if (!el.toast) return;
    el.toast.textContent = text;
    el.toast.classList.remove("hidden");
    el.toast.dataset.tone = tone || "default";
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      el.toast.classList.add("hidden");
    }, 2600);
  }

  function setSpeaker(speaker, role, seal) {
    el.speakerName.textContent = speaker || "旁白";
    el.speakerRole.textContent = role || "";
    el.speakerSeal.textContent = seal || "叙";
  }

  function setDialogue(text, speaker, role, seal) {
    setSpeaker(speaker, role, seal);
    el.dialogueText.innerHTML = text || "";
  }

  function clearChoices() {
    el.dialogueActions.innerHTML = "";
  }

  function renderChoices(choices) {
    clearChoices();
    choices.forEach((choice, index) => {
      const locked = choice.requires ? !choice.requires() : false;
      const button = document.createElement("button");
      button.className = "choice-btn" + (choice.tone ? " " + choice.tone : "");
      button.dataset.choice = String(index);
      button.disabled = locked;
      button.innerHTML =
        "<span>" + choice.label + "</span>" +
        (choice.hint ? "<span class='choice-hint'>" + choice.hint + "</span>" : "") +
        (locked && choice.lockText ? "<span class='choice-lock'>" + choice.lockText + "</span>" : "");
      if (!locked) {
        button.addEventListener("click", () => selectChoice(choice));
      }
      el.dialogueActions.appendChild(button);
    });
  }

  function selectChoice(choice) {
    if (choice.requires && !choice.requires()) {
      showToast(choice.lockText || "条件不足。");
      return;
    }
    Sound.click();
    if (choice.effect) choice.effect();
    const target = choice.next || (SCENES[state.scene] && SCENES[state.scene].next);
    const next = typeof target === "function" ? target() : target;
    if (next) {
      goTo(next);
    } else {
      renderGame();
    }
  }

  function advance() {
    const scene = SCENES[state.scene];
    if (!scene) return;
    Sound.click();
    const type = scene.type || "story";
    if (type === "story") {
      if (state.beat < scene.beats.length - 1) {
        state.beat += 1;
        save();
        renderGame();
        return;
      }
      if (scene.choices && scene.choices.length) {
        renderChoices(scene.choices);
        return;
      }
      const next = nextSceneId(scene);
      if (next) goTo(next);
      return;
    }
    if (type === "investigate") {
      if (!investigationComplete(scene)) {
        showToast("先把关键线索找全。");
        return;
      }
      if (scene.choices && scene.choices.length) {
        renderChoices(scene.choices);
        return;
      }
      const next = nextSceneId(scene);
      if (next) goTo(next);
      return;
    }
    if (type === "memory") {
      if (state.flags.memoryRefused) {
        const next = nextSceneId(scene);
        if (next) goTo(next);
      }
    }
  }

  function investigationComplete(scene) {
    return scene.required.every((id) => state.hotspots[id]);
  }

  function bindCommon() {
    el.newGameBtn.addEventListener("click", () => {
      Sound.ensure();
      Sound.startAmbient();
      state = createInitialState();
      goTo("prologue");
    });
    el.continueBtn.addEventListener("click", () => {
      const saved = loadSave();
      if (!saved) return;
      state = saved;
      Sound.ensure();
      Sound.startAmbient();
      if (state.ending) {
        renderEnding();
        return;
      }
      if (state.scene === "finale") {
        showScreen("game");
        renderGame();
        return;
      }
      if (state.scene.startsWith("game") && state.sim) {
        showScreen("game");
        renderGame();
        return;
      }
      showScreen("game");
      renderGame();
    });
    el.galleryBtn.addEventListener("click", openGallery);
    el.titleHelpBtn.addEventListener("click", openHelp);
    el.titleSoundBtn.addEventListener("click", toggleSound);
    el.soundBtn.addEventListener("click", toggleSound);
    el.menuBtn.addEventListener("click", openMenu);
    el.caseBtn.addEventListener("click", openCase);
    el.caseCloseBtn.addEventListener("click", closeCase);
    el.advanceBtn.addEventListener("click", advance);
    el.endingReplayBtn.addEventListener("click", () => {
      showScreen("title");
      updateTitleButtons();
    });
    el.endingFinaleBtn.addEventListener("click", () => {
      state.scene = "finale";
      state.finalePhase = null;
      state.finaleResult = null;
      state.ending = null;
      showScreen("game");
      goTo("finale");
    });
    el.endingGalleryBtn.addEventListener("click", openGallery);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (modalOpen) closeModal();
        else closeCase();
        return;
      }
      if (event.key === " " || event.key === "Enter") {
        if (!modalOpen && !el.gameScreen.classList.contains("hidden") && !el.advanceBtn.classList.contains("hidden")) {
          event.preventDefault();
          advance();
        }
      }
      if (!modalOpen && /^[1-9]$/.test(event.key)) {
        const buttons = $$(".choice-btn:not(:disabled)");
        const target = buttons[Number(event.key) - 1];
        if (target) {
          event.preventDefault();
          target.click();
        }
      }
    });
    el.modalRoot.addEventListener("click", (event) => {
      if (event.target === el.modalRoot) closeModal();
    });
    const sound = localStorage.getItem(SOUND_KEY);
    Sound.enabled = sound !== "off";
    updateSoundButtons();
  }

  function openCase() {
    el.casePanel.classList.add("open");
    renderCase();
    Sound.click();
  }

  function closeCase() {
    el.casePanel.classList.remove("open");
  }

  function toggleSound() {
    Sound.enabled = !Sound.enabled;
    localStorage.setItem(SOUND_KEY, Sound.enabled ? "on" : "off");
    if (Sound.enabled) {
      Sound.ensure();
      Sound.startAmbient();
    } else {
      Sound.stopAmbient();
    }
    updateSoundButtons();
  }

  function updateSoundButtons() {
    const label = Sound.enabled ? "声" : "静";
    if (el.soundBtn) el.soundBtn.textContent = label;
    if (el.titleSoundBtn) el.titleSoundBtn.textContent = "声音：" + (Sound.enabled ? "开" : "关");
  }

  function openModal(html) {
    modalOpen = true;
    el.modalRoot.classList.remove("hidden");
    el.modalRoot.innerHTML = html;
    const close = $(".modal-close", el.modalRoot);
    if (close) close.addEventListener("click", closeModal);
  }

  function closeModal() {
    modalOpen = false;
    el.modalRoot.classList.add("hidden");
    el.modalRoot.innerHTML = "";
  }

  function openHelp() {
    openModal(`
      <div class="modal">
        <div class="modal-head">
          <div><h2>操作说明</h2><p>一次调查，三次文明轮回，一场运河行动。</p></div>
          <button class="modal-close" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
          <p style="font-size:12px;line-height:1.9;color:rgba(233,226,210,.7)">
            <b>调查：</b>点击场景中的关键线索，把线索收进证据夹。关键线索找全后，选择你要告诉谁、隐瞒什么。<br>
            <b>判断：</b>在证据夹里选择“提交判断”，用正确的线索组合形成结论。判断会提高洞察，影响终局。<br>
            <b>三体游戏：</b>每回合选择一个文明行动。太阳预报可能出错；脱水与迁徙能降低灾难伤害，研究能提高知识。<br>
            <b>古筝：</b>选择伏击点、丝距、时机、首要目标，并决定是否警告平民。每一个选择都会改变数据、伤亡与结局。<br>
            <b>快捷键：</b>空格/回车推进对话，数字键 1–3 选择选项，Esc 关闭弹窗或证据夹。
          </p>
        </div>
        <div class="modal-actions"><button class="btn btn-primary modal-ok">知道了</button></div>
      </div>`);
    const ok = $(".modal-ok", el.modalRoot);
    if (ok) ok.addEventListener("click", closeModal);
  }

  function openMenu() {
    openModal(`
      <div class="modal">
        <div class="modal-head">
          <div><h2>档案菜单</h2><p>当前进度会自动保存到本机。</p></div>
          <button class="modal-close" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
          <div class="modal-actions" style="justify-content:flex-start">
            <button class="btn btn-ghost" id="menuHelp">操作说明</button>
            <button class="btn btn-ghost" id="menuGallery">结局档案</button>
            <button class="btn btn-ghost" id="menuTitle">保存并回到标题</button>
            <button class="btn btn-danger" id="menuRestart">重新开始</button>
          </div>
        </div>
      </div>`);
    $("#menuHelp", el.modalRoot).addEventListener("click", () => {
      closeModal();
      openHelp();
    });
    $("#menuGallery", el.modalRoot).addEventListener("click", () => {
      closeModal();
      openGallery();
    });
    $("#menuTitle", el.modalRoot).addEventListener("click", () => {
      save();
      closeModal();
      showScreen("title");
      updateTitleButtons();
    });
    $("#menuRestart", el.modalRoot).addEventListener("click", () => {
      closeModal();
      state = createInitialState();
      goTo("prologue");
    });
  }

  function openGallery() {
    const unlocked = unlockedEndings();
    const cards = Object.entries(ENDINGS).map(([id, ending]) => {
      const isOpen = unlocked.includes(id);
      return `
        <div class="clue-card" style="cursor:default;opacity:${isOpen ? 1 : .45}">
          <span class="clue-tag">${isOpen ? ending.kicker : "未解锁"}</span>
          <b>${isOpen ? ending.title : "？？？"}</b>
          <div class="clue-body" style="display:block">${isOpen ? ending.quote : "继续调查，或换一种终局选择。"}</div>
        </div>`;
    }).join("");
    openModal(`
      <div class="modal">
        <div class="modal-head">
          <div><h2>结局档案</h2><p>已解锁 ${unlocked.length} / 4。终局可以重开。</p></div>
          <button class="modal-close" aria-label="关闭">×</button>
        </div>
        <div class="modal-body"><div class="case-list">${cards}</div></div>
      </div>`);
  }

  // ---------- scene art and stage ----------

  function renderArt(id) {
    el.stageArt.innerHTML = ART[id] || ART["city-night"];
  }

  function renderGame() {
    const scene = SCENES[state.scene];
    if (!scene) return;
    el.chapterKicker.textContent = CHAPTERS[state.chapter] || "";
    el.chapterTitle.textContent = scene.title || "";
    syncHud();
    el.stagePlace.textContent = scene.place || "";
    el.stageTime.textContent = scene.time || "";
    el.stageCaption.textContent = scene.caption || "";
    renderArt(scene.art || "city-night");
    el.stage.classList.toggle("full", ["sim", "finale"].includes(scene.type) || scene.full === true);

    if (scene.type === "sim") {
      el.dialoguePanel.classList.add("hidden");
      renderSimulation();
      return;
    }
    if (scene.type === "finale") {
      el.dialoguePanel.classList.add("hidden");
      renderFinale();
      return;
    }
    el.dialoguePanel.classList.remove("hidden");
    if (scene.type === "investigate") {
      renderInvestigation(scene);
      return;
    }
    if (scene.type === "memory") {
      renderMemory(scene);
      return;
    }
    renderStory(scene);
  }

  function renderStory(scene) {
    renderScenePlate(scene);
    const beat = scene.beats[Math.min(state.beat, scene.beats.length - 1)];
    setDialogue(beat.text, beat.speaker, beat.role, beat.seal);
    clearChoices();
    const atEnd = state.beat >= scene.beats.length - 1;
    if (atEnd && scene.choices && scene.choices.length) {
      renderChoices(scene.choices);
      el.advanceBtn.classList.add("hidden");
    } else {
      el.advanceBtn.classList.remove("hidden");
      const next = nextSceneId(scene);
      el.advanceBtn.classList.toggle("hidden", atEnd && !next);
    }
  }

  function renderScenePlate(scene) {
    const index = String(Object.keys(SCENES).indexOf(state.scene) + 1).padStart(2, "0");
    el.stageContent.innerHTML = `
      <div class="scene-plate">
        <div class="scene-index">${index} / ${Object.keys(SCENES).length}</div>
        <h2>${scene.plateTitle || scene.title}</h2>
        <p>${scene.deck || ""}</p>
        <div class="scene-stamp">${scene.stamp || "绝密"}</div>
      </div>`;
  }

  function renderInvestigation(scene) {
    el.stageContent.innerHTML = "";
    const board = document.createElement("div");
    board.className = "investigation-board";
    const found = scene.hotspots.filter((hotspot) => state.hotspots[hotspot.id]).length;
    const requiredFound = scene.required.filter((id) => state.hotspots[id]).length;
    board.innerHTML = `
      <div class="investigation-head">
        <div>
          <h2>${scene.boardTitle || "现场检查"}</h2>
          <p>${scene.boardHint || "点击可以检查的物件。关键线索会被收进证据夹。"}</p>
        </div>
        <div class="hotspot-count">关键线索 ${requiredFound}/${scene.required.length}</div>
      </div>
      <div class="hotspot-grid">
        ${scene.hotspots.map((hotspot, index) => {
          const isFound = state.hotspots[hotspot.id];
          return `<button class="hotspot-card ${isFound ? "found" : ""}" data-hotspot="${hotspot.id}">
            <span class="hotspot-idx">0${index + 1} / ${hotspot.kicker || "检查"}</span>
            <span class="hotspot-label">${hotspot.label}</span>
            <span class="hotspot-found">${isFound ? hotspot.foundLabel || "已收录" : "点击检查"}</span>
          </button>`;
        }).join("")}
      </div>
      ${scene.required.every((id) => state.hotspots[id]) ? `
        <div class="deduction-banner">
          <p><b>线索齐了。</b> ${scene.afterText || ""}</p>
          ${activeDeductions().length ? `<button class="btn btn-ghost" id="boardDeduce">提交判断</button>` : ""}
        </div>` : ""}
    `;
    el.stageContent.appendChild(board);
    $$("[data-hotspot]", board).forEach((button) => {
      button.addEventListener("click", () => inspectHotspot(scene, button.dataset.hotspot));
    });
    const deduce = $("#boardDeduce", board);
    if (deduce) deduce.addEventListener("click", openDeductionChooser);

    const complete = investigationComplete(scene);
    if (complete) {
      const after = {
        speaker: "旁白",
        role: scene.place,
        seal: "叙",
        text: scene.afterText || "",
      };
      setDialogue(after.text, after.speaker, after.role, after.seal);
      clearChoices();
      if (scene.choices && scene.choices.length) {
        renderChoices(scene.choices);
        el.advanceBtn.classList.add("hidden");
      } else {
        el.advanceBtn.classList.remove("hidden");
      }
    } else {
      const intro = scene.intro || { speaker: "旁白", role: scene.place, seal: "叙", text: scene.introText || "" };
      setDialogue(intro.text, intro.speaker, intro.role, intro.seal);
      clearChoices();
      el.advanceBtn.classList.add("hidden");
    }
  }

  function inspectHotspot(scene, id) {
    const hotspot = scene.hotspots.find((item) => item.id === id);
    if (!hotspot) return;
    state.hotspots[id] = true;
    if (hotspot.clue) addClue(hotspot.clue);
    state.dialogueOverride = {
      speaker: hotspot.speaker || "汪淼",
      role: hotspot.role || scene.place,
      seal: hotspot.seal || "汪",
      text: hotspot.text,
    };
    Sound.click();
    save();
    renderInvestigation(scene);
  }

  function renderMemory(scene) {
    renderScenePlate(scene);
    el.stageContent.innerHTML = `
      <div class="memory-console">
        <div class="memory-wave"></div>
        <div class="memory-readout">
          <span class="memory-kicker">RED COAST / 1979</span>
          <b>识别度 AAAAA</b>
          <p>不要回答！不要回答！！不要回答！！！</p>
        </div>
      </div>`;
    if (!state.flags.memoryRefused) {
      setDialogue(
        "叶文洁的手指悬在红色发射键上方两厘米。屏幕上的警告重复了三遍。你可以替她做一个选择——但这段记忆不会改变。",
        "红岸 · 1979",
        "叶文洁的记忆",
        "忆"
      );
      clearChoices();
      renderChoices([
        {
          label: "不要回答",
          hint: "试着把手指收回来",
          tone: "danger",
          effect: () => {
            state.flags.memoryRefused = true;
            save();
            renderMemory(scene);
            showToast("记忆没有改变。她已经按过了。");
          },
        },
        {
          label: "按下发射键",
          hint: "让记忆继续",
          tone: "primary",
          effect: () => {
            state.flags.replied = true;
            addClue("yeReply");
            adjust("insight", 1);
            save();
            goTo("game3_intro");
          },
        },
      ]);
      el.advanceBtn.classList.add("hidden");
      return;
    }
    setDialogue(
      "“到这里来吧，我将帮助你们获得这个世界。我的文明已无力解决自己的问题，需要你们的力量来介入。”<br><br>她按下了发射键。八年后，她才知道自己唤来了什么。",
      "叶文洁",
      "红岸 · 1979",
      "叶"
    );
    clearChoices();
    renderChoices([
      {
        label: "按下发射键",
        hint: "让记忆继续",
        tone: "primary",
        effect: () => {
          state.flags.replied = true;
          addClue("yeReply");
          adjust("insight", 1);
          save();
        },
        next: "game3_intro",
      },
    ]);
    el.advanceBtn.classList.add("hidden");
  }

  // ---------- case file ----------

  function renderCase() {
    const entries = Object.entries(CLUES).filter(([id]) => state.clues[id]);
    el.caseStats.innerHTML = `
      <div class="case-stat"><span>洞察</span><b>${insightLabel(state.stats.insight)} · ${state.stats.insight}</b></div>
      <div class="case-stat"><span>军方信任</span><b>${shiLabel(state.stats.trustShi)}</b></div>
      <div class="case-stat"><span>ETO 关注</span><b>${etoLabel(state.stats.trustEto)}</b></div>
      <div class="case-stat"><span>暴露度</span><b>${exposureLabel(state.stats.exposure)}</b></div>
    `;
    el.caseList.innerHTML = entries.length
      ? entries.map(([id, clue]) => `
        <button class="clue-card" data-clue="${id}">
          <span class="clue-tag">${clue.tag}</span>
          <b>${clue.title}</b>
          <div class="clue-body">${clue.body}</div>
        </button>`).join("")
      : `<div class="case-empty">还没有线索。先检查你能看见的东西。</div>`;
    $$("[data-clue]", el.caseList).forEach((button) => {
      button.addEventListener("click", () => button.classList.toggle("open"));
    });
    const available = activeDeductions();
    el.caseFoot.innerHTML = available.length
      ? `<button class="btn btn-primary" id="caseDeduce">提交判断 · ${available.length} 条待整理</button>
         <p class="case-note">判断不会锁死主线，但会影响洞察与终局选项。</p>`
      : `<p class="case-note">${clueCount() ? "当前没有可提交的判断。继续调查。" : "线索会在这里累积。"}</p>`;
    const deduce = $("#caseDeduce", el.caseFoot);
    if (deduce) deduce.addEventListener("click", openDeductionChooser);
  }

  function openDeductionChooser() {
    const available = activeDeductions();
    if (!available.length) {
      showToast("还没有可以整理成判断的线索。");
      return;
    }
    openModal(`
      <div class="modal">
        <div class="modal-head">
          <div><h2>提交判断</h2><p>选择一条要整理的判断。判断需要恰好选中指定数量的证据。</p></div>
          <button class="modal-close" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
          <div class="case-list">
            ${available.map((d) => `<button class="clue-card" data-deduction="${d.id}">
              <span class="clue-tag">待整理 · ${d.required.length} 条证据</span>
              <b>${d.title}</b>
              <div class="clue-body" style="display:block">${d.prompt}</div>
            </button>`).join("")}
          </div>
        </div>
      </div>`);
    $$("[data-deduction]", el.modalRoot).forEach((button) => {
      button.addEventListener("click", () => openDeduction(button.dataset.deduction));
    });
  }

  let deductionState = null;

  function openDeduction(id) {
    const deduction = R.DEDUCTIONS[id];
    if (!deduction) return;
    if (!hasClues(deduction.required)) {
      showToast("证据还不够。");
      return;
    }
    deductionState = { id, selected: [], failures: 0 };
    renderDeductionModal();
  }

  function renderDeductionModal(message, tone) {
    if (!deductionState) return;
    const deduction = R.DEDUCTIONS[deductionState.id];
    const owned = Object.keys(CLUES).filter((id) => state.clues[id]);
    openModal(`
      <div class="modal">
        <div class="modal-head">
          <div><h2>${deduction.title}</h2><p>${deduction.prompt}</p></div>
          <button class="modal-close" aria-label="关闭">×</button>
        </div>
        <div class="modal-body">
          <div class="deduction-grid">
            ${owned.map((id) => {
              const selected = deductionState.selected.includes(id);
              return `<button class="deduction-clue ${selected ? "selected" : ""}" data-pick="${id}">
                <b>${CLUES[id].title}</b><span>${CLUES[id].tag}</span>
              </button>`;
            }).join("")}
          </div>
          <div class="deduction-status ${tone || ""}">${message || "选择 " + deduction.required.length + " 条证据。"}</div>
          <div class="modal-actions">
            <button class="btn btn-ghost" id="deductionBack">返回</button>
            <button class="btn btn-primary" id="deductionSubmit">提交判断</button>
          </div>
        </div>
      </div>`);
    $$("[data-pick]", el.modalRoot).forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.pick;
        const index = deductionState.selected.indexOf(id);
        if (index >= 0) deductionState.selected.splice(index, 1);
        else if (deductionState.selected.length < deduction.required.length) deductionState.selected.push(id);
        else {
          deductionState.selected.shift();
          deductionState.selected.push(id);
        }
        syncDeductionSelection();
      });
    });
    $("#deductionBack", el.modalRoot).addEventListener("click", openDeductionChooser);
    $("#deductionSubmit", el.modalRoot).addEventListener("click", () => {
      const result = R.checkDeduction(deductionState.id, deductionState.selected);
      if (result.ok) {
        state.deductions[deductionState.id] = true;
        adjust("insight", 2);
        save();
        Sound.seal();
        showToast("判断成立：" + deduction.title);
        deductionState = null;
        closeModal();
        renderGame();
      } else {
        adjust("insight", -1);
        deductionState.failures += 1;
        Sound.alarm();
        const hint = deductionState.failures >= 2
          ? " 史强的土办法：先找那条能把两件事直接连起来的证据，别管看起来最像的。"
          : "";
        renderDeductionModal((result.error || "证据还不足以形成判断。") + hint, "bad");
      }
    });
  }

  function syncDeductionSelection() {
    if (!deductionState) return;
    const deduction = R.DEDUCTIONS[deductionState.id];
    $$("[data-pick]", el.modalRoot).forEach((button) => {
      button.classList.toggle("selected", deductionState.selected.includes(button.dataset.pick));
    });
    const status = $(".deduction-status", el.modalRoot);
    if (status) {
      status.className = "deduction-status";
      status.textContent = "已选 " + deductionState.selected.length + " / " + deduction.required.length + " 条证据。";
    }
  }

  // ---------- simulation ----------

  function ensureSimulation(sessionId) {
    if (!state.sim || state.sim.id !== sessionId) {
      state.sim = R.createSimulation(sessionId);
      save();
    }
  }

  function renderSimulation() {
    const sim = state.sim;
    if (!sim) {
      renderStory(SCENES[state.scene]);
      return;
    }
    const scenario = R.SIM_SCENARIOS[sim.id];
    const forecast = sim.forecast;
    const eventInfo = forecast ? R.EVENT_INFO[forecast.event] : null;
    const actionCards = sim.actions.map((id) => {
      const action = R.ACTION_INFO[id];
      const disabled = id === "compute" && sim.knowledge < 25;
      return `<button class="sim-action" data-sim-action="${id}" ${disabled ? "disabled" : ""}>
        <b>${action.label}</b>
        <span>${action.desc}</span>
        ${disabled ? "<span class='sim-lock'>锁定 · 需要知识 25</span>" : ""}
      </button>`;
    }).join("");
    const log = sim.log.map((entry) => `<div class="sim-log-entry"><b>第 ${entry.turn} 回合</b> · ${entry.text}</div>`).join("");

    el.stageContent.innerHTML = `
      <div class="sim-screen">
        <div class="sim-sky ${forecast && forecast.event === "stable" ? "stable" : "chaos"}">
          <div class="sim-sun sim-sun-1"></div>
          <div class="sim-sun sim-sun-2"></div>
          <div class="sim-sun sim-sun-3"></div>
          <div class="sim-horizon"></div>
          <div class="sim-city">
            ${Array.from({ length: 18 }).map((_, index) => `<span class="sim-building" style="height:${12 + (index * 7) % 38}px"></span>`).join("")}
          </div>
        </div>
        <div class="sim-top">
          <div><h2 class="sim-title">${sim.title}</h2><p class="sim-sub">${sim.subtitle}</p></div>
          <div class="sim-turn">第 ${sim.turn} / ${sim.maxTurns} 回合</div>
        </div>
        <div class="sim-hud">
          <div class="sim-stat"><span class="sim-stat-label">人口 <span>POP</span></span><b class="sim-stat-value">${sim.population}</b><div class="sim-bar"><i style="width:${Math.min(100, sim.population)}%"></i></div></div>
          <div class="sim-stat food"><span class="sim-stat-label">粮食 <span>FOOD</span></span><b class="sim-stat-value">${sim.food}</b><div class="sim-bar"><i style="width:${Math.min(100, sim.food / 1.5)}%"></i></div></div>
          <div class="sim-stat knowledge"><span class="sim-stat-label">知识 <span>KNOW</span></span><b class="sim-stat-value">${sim.knowledge}</b><div class="sim-bar"><i style="width:${Math.min(100, sim.knowledge)}%"></i></div></div>
          <div class="sim-stat stability"><span class="sim-stat-label">稳定 <span>STAB</span></span><b class="sim-stat-value">${sim.stability}</b><div class="sim-bar"><i style="width:${sim.stability}%"></i></div></div>
        </div>
        <div class="sim-objective">本轮目标：让文明存续到第 ${sim.maxTurns} 回合。人口或稳定归零即毁灭；预报可能出错。</div>
        <div class="sim-main">
          <div class="sim-center">
            <div class="sim-forecast">
              <div class="fc-kicker">太阳预报 / FORECAST</div>
              <div class="fc-title">${eventInfo ? eventInfo.label : "信号丢失"}</div>
              <div class="fc-desc">${eventInfo ? eventInfo.text : ""} 可信度 ${Math.round((forecast ? forecast.confidence : 0) * 100)}%。${sim.computed ? "人列计算机已介入，但结果仍不能覆盖全部变量。" : ""}</div>
            </div>
            <div class="sim-actions">${actionCards}</div>
          </div>
          <div class="sim-log"><h3>文明日志 / CIVILIZATION LOG</h3>${log || "<div class='sim-log-entry'>尚无记录。</div>"}</div>
        </div>
        <div class="sim-bottom">
          <div class="sim-hint">行动后才会结算真实太阳事件。预报可能出错。</div>
          <button class="btn btn-ghost" id="simMenu">档案菜单</button>
        </div>
        ${renderSimOverlay(sim)}
      </div>`;
    $$("[data-sim-action]", el.stageContent).forEach((button) => {
      button.addEventListener("click", () => handleSimAction(button.dataset.simAction));
    });
    const menu = $("#simMenu", el.stageContent);
    if (menu) menu.addEventListener("click", openMenu);
    bindSimOverlay(sim);
  }

  function renderSimOverlay(sim) {
    if (state.simPending) {
      const pending = state.simPending;
      const event = pending.event;
      const deltas = pending.eventDeltas;
      const f = (n) => (n > 0 ? "+" + n : String(n));
      const actionText = pending.actionDeltas
        ? [
            pending.actionDeltas.population ? "人口 " + f(pending.actionDeltas.population) : "",
            pending.actionDeltas.food ? "粮食 " + f(pending.actionDeltas.food) : "",
            pending.actionDeltas.knowledge ? "知识 " + f(pending.actionDeltas.knowledge) : "",
            pending.actionDeltas.stability ? "稳定 " + f(pending.actionDeltas.stability) : "",
          ].filter(Boolean).join(" · ") || "无直接变化"
        : "无直接变化";
      return `<div class="sim-result">
        <div class="sim-result-card">
          <div class="result-kicker">TURN ${pending.turn} / EVENT</div>
          <h2>${event.label}</h2>
          <p>${event.text}</p>
          <p style="font-size:11px;color:rgba(233,226,210,.55)">你的行动：${pending.action ? pending.action.label : ""} · ${actionText}</p>
          <div class="result-grid">
            <div class="result-cell"><span>人口</span><b>${f(deltas.population)}</b></div>
            <div class="result-cell"><span>粮食</span><b>${f(deltas.food)}</b></div>
            <div class="result-cell"><span>稳定</span><b>${f(deltas.stability)}</b></div>
          </div>
          <p style="font-size:11px;color:rgba(233,226,210,.5)">${pending.forecastHonest ? "预报命中。" : "预报错误。太阳没有按计算出现。"}</p>
          <div class="result-actions"><button class="btn btn-primary" id="simContinue">继续</button></div>
        </div>
      </div>`;
    }
    if (sim.status === "won" || sim.status === "lost") {
      const summary = R.simulationSummary(sim);
      return `<div class="sim-result">
        <div class="sim-result-card">
          <div class="result-kicker">${summary.survived ? "CIVILIZATION SURVIVED" : "CIVILIZATION LOST"}</div>
          <h2>${summary.survived ? "文明存续" : "文明毁灭"}</h2>
          <p>${summary.summary}</p>
          <div class="result-grid">
            <div class="result-cell"><span>人口</span><b>${summary.population}</b></div>
            <div class="result-cell"><span>知识</span><b>${summary.knowledge}</b></div>
            <div class="result-cell"><span>评分</span><b>${summary.score}</b></div>
          </div>
          <p style="font-size:11px;color:rgba(233,226,210,.5)">管理员评价：${summary.ideologyLabel}倾向。${summary.survived ? "你被允许继续进入下一层。" : "毁灭也是数据。你仍被允许继续。"}</p>
          <div class="result-actions">
            <button class="btn btn-ghost" id="simRetry">重试本轮</button>
            <button class="btn btn-primary" id="simReturn">返回现实</button>
          </div>
        </div>
      </div>`;
    }
    return "";
  }

  function bindSimOverlay(sim) {
    const cont = $("#simContinue", el.stageContent);
    if (cont) {
      cont.addEventListener("click", () => {
        state.simPending = null;
        save();
        renderSimulation();
      });
    }
    const retry = $("#simRetry", el.stageContent);
    if (retry) {
      retry.addEventListener("click", () => {
        state.sim = R.createSimulation(sim.id);
        state.simPending = null;
        save();
        renderSimulation();
      });
    }
    const back = $("#simReturn", el.stageContent);
    if (back) {
      back.addEventListener("click", finishSimulation);
    }
  }

  function handleSimAction(actionId) {
    if (!state.sim || state.sim.status !== "playing") return;
    const result = R.resolveTurn(state.sim, actionId);
    if (!result.ok) {
      showToast(result.error);
      return;
    }
    state.sim = result.sim;
    state.simPending = {
      turn: result.sim.turn - (result.sim.status === "playing" ? 1 : 0),
      event: result.event,
      eventDeltas: result.eventDeltas,
      action: result.action,
      actionDeltas: result.actionDeltas,
      forecastHonest: result.sim.lastEvent.forecastHonest,
    };
    Sound.alarm();
    save();
    renderSimulation();
  }

  function finishSimulation() {
    if (!state.sim) return;
    const summary = R.simulationSummary(state.sim);
    state.simResults.push({
      id: state.sim.id,
      ...summary,
    });
    adjust("trustEto", summary.trustGain);
    if (state.sim.id === 1) {
      addClue("gameRecruit");
      state.sim = null;
      state.simPending = null;
      save();
      goTo("admin_call");
      return;
    }
    if (state.sim.id === 2) {
      addClue("threeBody");
      state.sim = null;
      state.simPending = null;
      save();
      goTo("ye_home");
      return;
    }
    addClue("fleet");
    addClue("threeBody");
    addClue("sophon");
    state.sim = null;
    state.simPending = null;
    save();
    goTo("eto_meeting");
  }

  // ---------- finale ----------

  function ensureFinale() {
    if (!state.finale) {
      state.finale = {
        site: null,
        spacing: null,
        timing: null,
        priority: null,
        warning: false,
      };
      save();
    }
  }

  const SITE_OPTIONS = [
    { id: "locks", label: "船闸", x: 22, y: 46, hint: "船速慢，警戒最高" },
    { id: "gaillard", label: "盖拉德水道", x: 50, y: 52, hint: "最窄处，150 米" },
    { id: "bridge", label: "美洲大桥", x: 78, y: 40, hint: "桥墩当柱子，但太宽" },
  ];

  function finalePlan() {
    return state.finale || { site: null, spacing: null, timing: null, priority: null, warning: false };
  }

  function renderFinale() {
    const plan = finalePlan();
    const ready = plan.site && plan.spacing && plan.timing && plan.priority;
    const preview = ready
      ? R.evaluateFinale(plan, state.stats, state.clues)
      : null;
    el.stageContent.innerHTML = `
      <div class="finale-screen">
        <div class="finale-top">
          <div><h2>古筝行动</h2><p>巴拿马运河 · 盖拉德水道 / 行动规划板</p></div>
          <div class="sim-turn">${ready ? "参数就绪" : "等待参数"}</div>
        </div>
        <div class="finale-body">
          <div class="canal-map">
            <div class="canal-water"></div>
            <div class="canal-ship"></div>
            <div class="canal-fiber" style="opacity:${plan.site === "gaillard" ? .9 : .3}"></div>
            ${SITE_OPTIONS.map((site) => `<button class="canal-site ${plan.site === site.id ? "selected" : ""}" style="left:${site.x}%;top:${site.y}%" data-site="${site.id}">${site.label.slice(0, 2)}<small>${site.label}</small></button>`).join("")}
          </div>
          <div class="finale-panel">
            <div class="finale-step finale-brief">
              <h3>行动评估 / MISSION CRITERIA</h3>
              <p>行动组当前采用的判定基准：数据回收 ≥ 70、ETO 瘫痪 ≥ 55、平民死亡 ≤ 55；伏击点、丝距与时机必须与已掌握的情报相符。预估值是规划组估算，不是保证。</p>
            </div>
            <div class="finale-step">
              <h3>01 / 伏击点</h3>
              <p>船必须通过运河。你要在哪里拉起“琴”？</p>
              <div class="option-row">
                ${SITE_OPTIONS.map((site) => `<button class="option-btn ${plan.site === site.id ? "selected" : ""}" data-site-option="${site.id}">${site.label}</button>`).join("")}
              </div>
            </div>
            <div class="finale-step">
              <h3>02 / 丝距</h3>
              <p>飞刃材料有限。间距越小，切得越密，但材料可能不够。</p>
              <div class="option-row">
                <button class="option-btn ${plan.spacing === "1" ? "selected" : ""}" data-spacing="1">1 米</button>
                <button class="option-btn ${plan.spacing === "0.5" ? "selected" : ""}" data-spacing="0.5">0.5 米</button>
                <button class="option-btn ${plan.spacing === "0.25" ? "selected" : ""}" data-spacing="0.25">0.25 米</button>
              </div>
            </div>
            <div class="finale-step">
              <h3>03 / 时机</h3>
              <p>白天人员站立或蹲伏；夜间人员躺卧。</p>
              <div class="option-row">
                <button class="option-btn ${plan.timing === "day" ? "selected" : ""}" data-timing="day">白天过船</button>
                <button class="option-btn ${plan.timing === "night" ? "selected" : ""}" data-timing="night">夜间过船</button>
              </div>
            </div>
            <div class="finale-step">
              <h3>04 / 首要目标</h3>
              <p>你要完整的信息，还是更少的人命？</p>
              <div class="option-row">
                <button class="option-btn ${plan.priority === "data" ? "selected" : ""}" data-priority="data">完整夺取信息</button>
                <button class="option-btn ${plan.priority === "lives" ? "selected" : ""}" data-priority="lives">先救平民</button>
                <button class="option-btn ${plan.priority === "sink" ? "selected" : ""}" data-priority="sink">确保击沉</button>
              </div>
            </div>
            <div class="finale-step">
              <h3>05 / 是否警告平民</h3>
              <p>警告能减少伤亡，也会让 ETO 知道行动已经开始。</p>
              <div class="option-row">
                <button class="option-btn ${!plan.warning ? "selected" : ""}" data-warning="false">不警告</button>
                <button class="option-btn ${plan.warning ? "selected" : ""}" data-warning="true">警告</button>
              </div>
            </div>
            <div class="finale-risk">
              <div class="risk-cell"><span>预计数据</span><b>${preview ? preview.dataRecovered : "—"}</b></div>
              <div class="risk-cell"><span>预计伤亡</span><b>${preview ? preview.civilianDeaths : "—"}</b></div>
              <div class="risk-cell"><span>预计 ETO 瘫痪</span><b>${preview ? preview.etoNeutralized : "—"}</b></div>
            </div>
          </div>
        </div>
        <div class="finale-bottom">
          <div class="finale-status">${ready ? "参数就绪，可继续调整；执行后不可撤回。" : "先完成五项参数，再执行。"}${state.deductions.d3 ? " 判断 d3 已成立。" : ""}</div>
          <button class="btn btn-primary" id="executeFinale" ${ready ? "" : "disabled"}>执行古筝行动</button>
        </div>
        ${renderFinaleOverlay()}
      </div>`;
    $$("[data-site], [data-site-option]", el.stageContent).forEach((button) => {
      button.addEventListener("click", () => {
        state.finale.site = button.dataset.site || button.dataset.siteOption;
        Sound.click();
        save();
        renderFinale();
      });
    });
    $$("[data-spacing]", el.stageContent).forEach((button) => {
      button.addEventListener("click", () => {
        state.finale.spacing = button.dataset.spacing;
        Sound.click();
        save();
        renderFinale();
      });
    });
    $$("[data-timing]", el.stageContent).forEach((button) => {
      button.addEventListener("click", () => {
        state.finale.timing = button.dataset.timing;
        Sound.click();
        save();
        renderFinale();
      });
    });
    $$("[data-priority]", el.stageContent).forEach((button) => {
      button.addEventListener("click", () => {
        state.finale.priority = button.dataset.priority;
        Sound.click();
        save();
        renderFinale();
      });
    });
    $$("[data-warning]", el.stageContent).forEach((button) => {
      button.addEventListener("click", () => {
        state.finale.warning = button.dataset.warning === "true";
        Sound.click();
        save();
        renderFinale();
      });
    });
    const execute = $("#executeFinale", el.stageContent);
    if (execute) {
      execute.addEventListener("click", executeFinale);
    }
    bindFinaleOverlay();
  }

  function renderFinaleOverlay() {
    if (state.finalePhase === "running") {
      return `<div class="sim-result">
        <div class="sim-result-card">
          <div class="result-kicker">OPERATION GUZHENG / RUNNING</div>
          <h2>琴弦已就位</h2>
          <p>钢柱从两岸竖起。审判日号正在进入盖拉德水道。纳米丝几乎看不见，只有风掠过时，才会发出一声极细的鸣响。</p>
          <div class="sim-bar" style="height:4px;margin-top:18px"><i style="width:62%;background:var(--amber)"></i></div>
          <div class="result-actions"><button class="btn btn-ghost" id="skipCinematic">跳过</button></div>
        </div>
      </div>`;
    }
    if (state.finalePhase === "result" && state.finaleResult) {
      const r = state.finaleResult;
      return `<div class="sim-result">
        <div class="sim-result-card">
          <div class="result-kicker">OPERATION COMPLETE / ${r.ending.toUpperCase()}</div>
          <h2>${r.ending === "canon" ? "信息回收" : r.ending === "clean_hands" ? "信息不完整" : r.ending === "information_first" ? "代价已支付" : "行动失败"}</h2>
          <p>${r.failureReason || r.reasons.slice(0, 3).join(" ")}</p>
          <div class="result-grid">
            <div class="result-cell"><span>数据回收</span><b>${r.dataRecovered}</b></div>
            <div class="result-cell"><span>ETO 瘫痪</span><b>${r.etoNeutralized}</b></div>
            <div class="result-cell"><span>平民死亡</span><b>${r.civilianDeaths}</b></div>
          </div>
          <div class="result-actions"><button class="btn btn-primary" id="viewEnding">查看结局</button></div>
        </div>
      </div>`;
    }
    return "";
  }

  function bindFinaleOverlay() {
    const skip = $("#skipCinematic", el.stageContent);
    if (skip) {
      skip.addEventListener("click", () => {
        if (cinematicTimer) window.clearTimeout(cinematicTimer);
        state.finalePhase = "result";
        save();
        renderFinale();
      });
    }
    const view = $("#viewEnding", el.stageContent);
    if (view) {
      view.addEventListener("click", () => {
        state.ending = state.finaleResult.ending;
        state.scene = "ending";
        state.chapter = 3;
        unlockEnding(state.ending);
        save();
        renderEnding();
      });
    }
  }

  function executeFinale() {
    const plan = finalePlan();
    if (!plan.site || !plan.spacing || !plan.timing || !plan.priority) return;
    state.finaleResult = R.evaluateFinale(plan, state.stats, state.clues);
    state.finalePhase = "running";
    save();
    renderFinale();
    Sound.cut();
    if (cinematicTimer) window.clearTimeout(cinematicTimer);
    cinematicTimer = window.setTimeout(() => {
      state.finalePhase = "result";
      save();
      renderFinale();
    }, 1800);
  }

  // ---------- ending ----------

  function renderEnding() {
    const id = state.ending || (state.finaleResult && state.finaleResult.ending) || "canon";
    const ending = ENDINGS[id] || ENDINGS.canon;
    showScreen("ending");
    el.endingArt.innerHTML = ART[ending.art] || "";
    el.endingKicker.textContent = ending.kicker;
    el.endingTitle.textContent = ending.title;
    el.endingSeal.textContent = ending.seal;
    el.endingQuote.textContent = ending.quote;
    el.endingText.innerHTML = ending.text.map((paragraph) => `<p>${paragraph}</p>`).join("");
    const r = state.finaleResult || { dataRecovered: 0, etoNeutralized: 0, civilianDeaths: 0, worldKnows: 0 };
    if (r.failureReason) {
      el.endingText.innerHTML += `<p class="ending-failure"><b>行动判定：</b>${r.failureReason}</p>`;
    }
    el.endingStats.innerHTML = `
      <div class="ending-stat">数据回收 <b>${r.dataRecovered}</b></div>
      <div class="ending-stat">ETO 瘫痪 <b>${r.etoNeutralized}</b></div>
      <div class="ending-stat">平民死亡 <b>${r.civilianDeaths}</b></div>
      <div class="ending-stat">世界知情 <b>${r.worldKnows}</b></div>
    `;
    el.endingFinaleBtn.classList.remove("hidden");
    Sound.end();
  }

  // ---------- audio ----------

  const Sound = {
    enabled: true,
    ctx: null,
    ambient: null,
    ensure() {
      if (!this.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (Ctx) this.ctx = new Ctx();
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    },
    tone(freq, duration, type, volume) {
      if (!this.enabled) return;
      this.ensure();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.value = freq;
      gain.gain.value = volume === undefined ? 0.04 : volume;
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    },
    click() { this.tone(420, 0.06, "square", 0.02); },
    seal() { this.tone(110, 0.22, "sine", 0.06); this.tone(220, 0.16, "triangle", 0.03); },
    alarm() { this.tone(82, 0.35, "sawtooth", 0.045); },
    cut() { this.tone(1600, 0.08, "triangle", 0.05); this.tone(90, 0.6, "sine", 0.07); },
    end() { this.tone(146.8, 1.4, "sine", 0.035); this.tone(220, 1.8, "sine", 0.02); },
    startAmbient() {
      if (!this.enabled || this.ambient || !this.ctx) return;
      const ctx = this.ctx;
      const a = ctx.createOscillator();
      const b = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      a.type = "sine";
      b.type = "sine";
      a.frequency.value = 55;
      b.frequency.value = 82.5;
      gain.gain.value = 0.018;
      filter.type = "lowpass";
      filter.frequency.value = 420;
      a.connect(filter);
      b.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      a.start();
      b.start();
      this.ambient = { a, b, gain };
    },
    stopAmbient() {
      if (!this.ambient) return;
      try {
        this.ambient.a.stop();
        this.ambient.b.stop();
      } catch (error) {
        // ignore
      }
      this.ambient = null;
    },
  };

  // ---------- scenes ----------

  function routeAfterIntro() {
    if (!state.flags.visitedWarroom) return "warroom";
    if (!state.flags.visitedShen) return "shen_villa";
    return "game1_intro";
  }

  const SCENES = {
    prologue: {
      chapter: 0,
      title: "科学边界",
      plateTitle: "四名军人和两名警察",
      deck: "2007 年，春天。近两个月，十几名前沿科学家接连自杀。",
      stamp: "绝密",
      place: "北京 · 汪淼家",
      time: "傍晚",
      art: "city-night",
      beats: [
        { speaker: "旁白", role: "2007 · 北京", seal: "叙", text: "2007 年，春天。四名军人和两名警察站在汪淼家门口。" },
        { speaker: "史强", role: "刑警", seal: "史", text: "“汪教授，最近你与‘科学边界’的成员有过接触，是吧？”" },
        { speaker: "旁白", role: "作战中心", seal: "叙", text: "近两个月，十几名基础科学前沿的学者自杀。军方成立了一个没有牌子的作战中心。" },
        { speaker: "常伟思", role: "陆军少将", seal: "常", text: "“这是战争时期。可我们连敌人在哪儿都不知道。”" },
      ],
      next: "darkroom",
    },

    darkroom: {
      chapter: 1,
      title: "1200:00:00",
      plateTitle: "暗房",
      deck: "红灯、显影液、三卷没有拍完的底片。",
      stamp: "异常",
      place: "北京 · 汪淼家",
      time: "凌晨",
      art: "darkroom",
      type: "investigate",
      introText: "红灯下，三卷黑白底片挂在绳上。你明明记得自己只拍了两卷。",
      intro: { speaker: "汪淼", role: "纳米材料项目负责人", seal: "汪", text: "红灯下，三卷黑白底片挂在绳上。你明明记得自己只拍了两卷。" },
      boardTitle: "检查暗房",
      boardHint: "先看两张底片上的数字。",
      hotspots: [
        { id: "photo1", kicker: "底片 01", label: "第一张底片", clue: "countdown", foundLabel: "1200:00:00", text: "底片正中有一行白色数字：<span class='mono'>1200:00:00</span>。你用的是一台 1988 年的莱卡 M2，全机械，不可能往胶片上叠印日期。" },
        { id: "photo2", kicker: "底片 02", label: "第二张底片", clue: "countdown", foundLabel: "1199:49:33", text: "第二张是 <span class='mono'>1199:49:33</span>。两张底片的拍摄时间相差十分钟，数字也正好少了十分钟。" },
        { id: "camera", kicker: "器材", label: "莱卡 M2", foundLabel: "纯机械", text: "机身没有电池，没有日期背板。你把它拆开看过，里面只有齿轮、快门和一块干净的玻璃。" },
        { id: "redlight", kicker: "环境", label: "红色安全灯", foundLabel: "没有投影", text: "红灯只照亮显影盘。墙上没有投影仪，也没有任何能往底片上写字的东西。" },
      ],
      required: ["photo1", "photo2"],
      afterText: "数字不是叠印，也不是显影故障。它像有人用针尖刻在每一张底片上，而且还在继续。",
      choices: [
        { label: "给史强打电话", hint: "让军方知道这件事", tone: "primary", effect: () => { adjust("trustShi", 1); setFlag("toldShi"); }, next: "warroom" },
        { label: "去找申玉菲", hint: "她也许知道这些数字", effect: () => { adjust("trustEto", 1); setFlag("metShenFirst"); }, next: "shen_villa" },
        { label: "谁也不说，先去实验室", hint: "先确认纳米项目有没有问题", effect: () => { adjust("insight", 1); }, next: "lab" },
      ],
    },

    lab: {
      chapter: 1,
      title: "飞刃",
      plateTitle: "纳米中心",
      deck: "超导线圈、真空腔、一根比头发丝还细的丝。",
      stamp: "项目",
      place: "北京 · 纳米中心",
      time: "清晨",
      art: "lab",
      type: "investigate",
      introText: "实验室的灯亮了一夜。超导线圈的测试数据全部作废，屏幕上却留下了一条不属于任何仪器的曲线。",
      intro: { speaker: "汪淼", role: "纳米中心", seal: "汪", text: "实验室的灯亮了一夜。超导线圈的测试数据全部作废，屏幕上却留下了一条不属于任何仪器的曲线。" },
      boardTitle: "检查实验室",
      boardHint: "确认飞刃是否与倒计时有关。",
      hotspots: [
        { id: "sample", kicker: "样品", label: "飞刃样品", clue: "nano", foundLabel: "纳米丝", text: "飞刃在灯下几乎看不见。你用镊子夹起它，轻轻一拉，钢制夹具上出现了一道镜面般的切痕。" },
        { id: "screen", kicker: "数据", label: "失效的实验数据", foundLabel: "倒计时", text: "屏幕上的曲线在 1194 小时处突然断裂，断口旁边出现了一行小字：<span class='mono'>1194:16:37</span>。和底片上的数字一样。" },
        { id: "phone", kicker: "通讯", label: "未读短信", foundLabel: "申玉菲", text: "申玉菲发来一条短信：<br>“你看到数字了吗？别停。停下来，它就会消失。”" },
      ],
      required: ["sample", "screen"],
      afterText: "倒计时不是幻觉。它跟着你，也认识你的项目。",
      choices: [
        { label: "去作战中心", hint: "把底片交给军方", tone: "primary", effect: () => { adjust("trustShi", 1); }, next: "warroom" },
        { label: "去找申玉菲", hint: "她知道得太多", effect: () => { adjust("trustEto", 1); }, next: "shen_villa" },
      ],
    },

    warroom: {
      chapter: 1,
      title: "信息对等",
      plateTitle: "没有牌子的作战中心",
      deck: "烟、CRT、名单。所有人都在等一个他们说不出口的答案。",
      stamp: "军方",
      place: "北京近郊 · 作战中心",
      time: "下午",
      art: "warroom",
      onEnter() {
        setFlag("visitedWarroom");
        addClue("suicides");
        addClue("scienceFrontier");
        addClue("nano");
      },
      beats: [
        { speaker: "旁白", role: "作战中心", seal: "叙", text: "大厅里堆满临时接起来的电脑和投影仪。烟像晨雾一样浮在半空。" },
        { speaker: "常伟思", role: "陆军少将", seal: "常", text: "“最近，敌人的攻击明显加强了，目标仍是科学界高层。”" },
        { speaker: "史强", role: "刑警", seal: "史", text: "“首长，我提个要求——信息对等！我们连这个机构是干什么的都不知道。”" },
        { speaker: "旁白", role: "名单", seal: "叙", text: "名单上有十几个人。最后一个名字是杨冬。汪淼见过她，在超导线圈的施工现场，她站在夕阳里，像一朵开在金属废墟上的花。" },
        { speaker: "常伟思", role: "陆军少将", seal: "常", text: "“汪教授，我们需要你的纳米材料。也需要你告诉我们，‘科学边界’到底在做什么。”" },
      ],
      choices: [
        { label: "交出全部底片", hint: "换取军方信任", tone: "primary", effect: () => { adjust("trustShi", 2); adjust("exposure", 1); }, next: routeAfterIntro },
        { label: "只交复印件", hint: "保留一份自己的记录", effect: () => { adjust("trustShi", 1); adjust("insight", 1); }, next: routeAfterIntro },
        { label: "拒绝交底", hint: "不想把自己变成情报的一部分", effect: () => { adjust("exposure", 1); adjust("integrity", 1); }, next: routeAfterIntro },
      ],
    },

    shen_villa: {
      chapter: 1,
      title: "女海明威",
      plateTitle: "申玉菲的别墅",
      deck: "书、黄铜灯、V 装具。她问起你的纳米项目，像在确认一件早就知道的事。",
      stamp: "观察",
      place: "北京 · 申玉菲家",
      time: "夜",
      art: "villa",
      onEnter() {
        setFlag("visitedShen");
        addClue("nano");
        addClue("scienceFrontier");
      },
      beats: [
        { speaker: "旁白", role: "申玉菲家", seal: "叙", text: "别墅里没有豪华摆设，只有书、黄铜灯和一套 V 装具。二楼传来粉笔划过黑板的声音。" },
        { speaker: "申玉菲", role: "物理学家", seal: "申", text: "“你领导的纳米项目怎么样了？”" },
        { speaker: "汪淼", role: "纳米中心", seal: "汪", text: "“我的底片上出现了倒计时。你不觉得应该先问这个？”" },
        { speaker: "申玉菲", role: "物理学家", seal: "申", text: "“倒计时不是问题。问题是你会不会停下来。”" },
        { speaker: "旁白", role: "V 装具", seal: "叙", text: "她把一个网址写在纸上。屏幕上是一行绿色的字：<span class='mono'>欢迎登录《三体》</span>。" },
      ],
      choices: [
        { label: "如实说纳米项目", hint: "用坦白换她的判断", tone: "primary", effect: () => { adjust("trustEto", 1); adjust("insight", 1); }, next: routeAfterIntro },
        { label: "撒谎，说项目已经停了", hint: "看看她会怎么反应", effect: () => { adjust("trustEto", 2); }, next: routeAfterIntro },
        { label: "反问她为什么知道", hint: "把问题推回去", effect: () => { adjust("insight", 1); adjust("exposure", 1); }, next: routeAfterIntro },
      ],
    },

    game1_intro: {
      chapter: 1,
      title: "欢迎登录",
      plateTitle: "V 装具",
      deck: "全视角头盔、感应服、一行绿色的登录提示。",
      stamp: "登录",
      place: "汪淼家 · 书房",
      time: "深夜",
      art: "city-night",
      beats: [
        { speaker: "旁白", role: "登录界面", seal: "叙", text: "你戴上 V 装具。感应服先是一阵冰凉，然后传来风、土和某种金属摩擦的触感。" },
        { speaker: "系统", role: "《三体》", seal: "游", text: "<span class='mono'>欢迎登录《三体》。第 137 号文明正在载入。</span>" },
        { speaker: "旁白", role: "第 137 号文明", seal: "叙", text: "你站在一座夯土城邑外。天上没有月亮，只有一条发红的裂缝。周文王说，太阳已经三天没有落下。" },
      ],
      next: "game1",
    },

    game1: {
      chapter: 1,
      title: "周文王 · 长夜",
      plateTitle: "第 137 号文明",
      deck: "第一次文明存续模拟。",
      stamp: "游戏",
      place: "《三体》游戏",
      time: "第 137 号文明",
      art: "city-night",
      type: "sim",
    },

    admin_call: {
      chapter: 1,
      title: "管理员",
      plateTitle: "真实身份",
      deck: "游戏结束后的电话。对方想知道你是谁。",
      stamp: "筛选",
      place: "汪淼家 · 书房",
      time: "凌晨",
      art: "city-night",
      onEnter() { addClue("gameRecruit"); },
      beats: [
        { speaker: "管理员", role: "《三体》系统", seal: "游", text: "“汪教授，恭喜。你玩到了这个层次。现在请提供你的真实姓名、学历、工作部门和职位。”" },
        { speaker: "管理员", role: "《三体》系统", seal: "游", text: "“如果拒绝，《三体》将对你永久关闭。”" },
        { speaker: "旁白", role: "电话", seal: "叙", text: "你听见电话那头有键盘声，还有另一个人的呼吸。这不是一个游戏客服。" },
      ],
      choices: [
        { label: "给出真实身份", hint: "进入更深的层级", tone: "primary", effect: () => { adjust("trustEto", 2); adjust("insight", 1); }, next: "cafe" },
        { label: "只给部分信息", hint: "留一条退路", effect: () => { adjust("trustEto", 1); adjust("insight", 1); }, next: "cafe" },
        { label: "报一个假名", hint: "保护自己，但可能被识破", effect: () => { adjust("exposure", 1); adjust("trustEto", -1); }, next: "cafe" },
      ],
    },

    cafe: {
      chapter: 2,
      title: "玩家聚会",
      plateTitle: "七个人",
      deck: "咖啡厅、旧油画、七个不像玩家的人。",
      stamp: "招募",
      place: "北京 · 云河咖啡馆",
      time: "夜",
      art: "cafe",
      onEnter() { addClue("panHan"); },
      beats: [
        { speaker: "旁白", role: "云河咖啡馆", seal: "叙", text: "七个人，没有一个人像游戏玩家。有老哲学家、女作家、IT 公司副总裁、国电高层、记者和博士生。" },
        { speaker: "潘寒", role: "生物学家", seal: "潘", text: "“《三体》就是为你们这样的阶层准备的。它的内涵和意境，常人难以理解。”" },
        { speaker: "汪淼", role: "纳米中心", seal: "汪", text: "“《三体》仅仅是个游戏吗？”" },
        { speaker: "潘寒", role: "生物学家", seal: "潘", text: "“三体世界是真实存在的。脱水、人列计算机，都是真实的。”" },
        { speaker: "旁白", role: "观察名单", seal: "叙", text: "他说这句话时，眼睛一直看着你。你知道，自己已经被写进了某个名单。" },
      ],
      choices: [
        { label: "顺着他说，表现得比他还极端", hint: "更快进入 ETO", tone: "danger", effect: () => { adjust("trustEto", 2); adjust("integrity", -1); }, next: "game2_intro" },
        { label: "半真半假地套话", hint: "保持距离，换取信息", tone: "primary", effect: () => { adjust("insight", 1); adjust("trustEto", 1); }, next: "game2_intro" },
        { label: "当场质问他", hint: "让警方看见你的态度", effect: () => { adjust("exposure", 2); adjust("trustShi", 1); }, next: "game2_intro" },
      ],
    },

    game2_intro: {
      chapter: 2,
      title: "墨子 · 烈焰",
      plateTitle: "第二次登录",
      deck: "V 装具的刺痛更明显了。天空像被烧红的铜。",
      stamp: "登录",
      place: "汪淼家 · 书房",
      time: "深夜",
      art: "city-night",
      beats: [
        { speaker: "旁白", role: "第二次登录", seal: "叙", text: "你再次戴上 V 装具。这一次，感应服在肩胛骨上留下了一阵真实的灼痛。" },
        { speaker: "系统", role: "《三体》", seal: "游", text: "<span class='mono'>第 139 号文明正在载入。太阳预报：恒纪元。</span>" },
        { speaker: "旁白", role: "第 139 号文明", seal: "叙", text: "墨子把一座铜球抬上观星台。他说宇宙是一只两层球壳，太阳只是壳上的洞。" },
      ],
      next: "game2",
    },

    game2: {
      chapter: 2,
      title: "墨子 · 烈焰",
      plateTitle: "第 139 号文明",
      deck: "第二次文明存续模拟。",
      stamp: "游戏",
      place: "《三体》游戏",
      time: "第 139 号文明",
      art: "city-night",
      type: "sim",
    },

    ye_home: {
      chapter: 2,
      title: "叶文洁",
      plateTitle: "杨冬的母亲",
      deck: "老式居民楼，旧书，一张没有再添新照片的相框。",
      stamp: "红岸",
      place: "北京 · 叶文洁家",
      time: "下午",
      art: "villa",
      onEnter() { addClue("redCoast"); },
      beats: [
        { speaker: "旁白", role: "叶文洁家", seal: "叙", text: "叶文洁开门时，你看见她的手很瘦，指节却稳。屋里只有旧书和一张杨冬的照片。" },
        { speaker: "汪淼", role: "纳米中心", seal: "汪", text: "“你是杨冬的母亲。你在红岸基地工作过，对吗？”" },
        { speaker: "叶文洁", role: "天体物理学家", seal: "叶", text: "“红岸。雷达峰。那都是很久以前的事了。”" },
        { speaker: "旁白", role: "旧档案", seal: "叙", text: "她说话时没有看你，也没有看杨冬的照片。她在看窗外，像在看一段只有她自己能看见的电波。" },
      ],
      choices: [
        { label: "逼问她红岸收到过什么", hint: "把线索钉死", tone: "primary", effect: () => { adjust("insight", 1); }, next: "redcoast_memory" },
        { label: "先听她讲完", hint: "让她自己说", effect: () => { adjust("integrity", 1); adjust("insight", 1); }, next: "redcoast_memory" },
        { label: "告诉她 ETO 已经暴露", hint: "看她会不会露出破绽", effect: () => { adjust("trustEto", 1); adjust("exposure", 1); }, next: "redcoast_memory" },
      ],
    },

    redcoast_memory: {
      chapter: 2,
      title: "不要回答",
      plateTitle: "1979 · 红岸",
      deck: "一段不能被改写的记忆。",
      stamp: "记忆",
      place: "雷达峰 · 红岸基地",
      time: "1979",
      art: "redcoast",
      type: "memory",
    },

    game3_intro: {
      chapter: 2,
      title: "三日凌空",
      plateTitle: "第三次登录",
      deck: "天空有三颗太阳。方阵有三千万人。",
      stamp: "登录",
      place: "汪淼家 · 书房",
      time: "深夜",
      art: "city-night",
      beats: [
        { speaker: "旁白", role: "第三次登录", seal: "叙", text: "你第三次戴上 V 装具。登录界面没有问候，只有一行字：<span class='mono'>第 184 号文明。</span>" },
        { speaker: "系统", role: "《三体》", seal: "游", text: "<span class='mono'>太阳预报：恒纪元。可信度 62%。</span>" },
        { speaker: "旁白", role: "第 184 号文明", seal: "叙", text: "秦始皇的三千万军队在平原上列成方阵。冯·诺伊曼说，这会是一台计算机。" },
      ],
      next: "game3",
    },

    game3: {
      chapter: 2,
      title: "牛顿 · 人列计算机",
      plateTitle: "第 184 号文明",
      deck: "第三次文明存续模拟。",
      stamp: "游戏",
      place: "《三体》游戏",
      time: "第 184 号文明",
      art: "city-night",
      type: "sim",
    },

    eto_meeting: {
      chapter: 2,
      title: "地球三体运动",
      plateTitle: "地下大厅",
      deck: "红色圆环、长桌、三种对人类的判决。",
      stamp: "ETO",
      place: "北京 · 地下大厅",
      time: "夜",
      art: "eto",
      onEnter() {
        addClue("judgmentDay");
        addClue("data");
        addClue("factionSplit");
      },
      beats: [
        { speaker: "旁白", role: "ETO 会议", seal: "叙", text: "地下大厅的墙上有一个巨大的红色圆环。潘寒的尸体刚被拖出去，地上还留着一道暗色的痕。" },
        { speaker: "叶文洁", role: "ETO 精神领袖", seal: "叶", text: "“小汪也来了，你好。”" },
        { speaker: "旁白", role: "三派", seal: "叙", text: "降临派要借三体文明毁灭人类；拯救派把三体当神，想拯救主；幸存派想为子孙在战败后留一条命。" },
        { speaker: "叶文洁", role: "ETO 精神领袖", seal: "叶", text: "“伊文斯在‘审判日’号上。三体世界发给地球的信息，被他截留了。大约 28G。”" },
        { speaker: "旁白", role: "选择", seal: "叙", text: "你终于知道船在哪里，也知道信息在哪里。现在的问题是：你准备以什么身份走出这间大厅？" },
      ],
      choices: [
        { label: "假装加入，申请上船", hint: "潜入降临派核心", tone: "primary", effect: () => { adjust("trustEto", 1); adjust("insight", 1); }, next: "warroom_final" },
        { label: "当场揭穿叶文洁", hint: "把位置交给军方", effect: () => { adjust("exposure", 3); adjust("trustShi", 2); adjust("integrity", 1); }, next: "warroom_final" },
        { label: "沉默离开，把坐标交给军方", hint: "不让 ETO 看见你的态度", effect: () => { adjust("trustShi", 2); adjust("insight", 1); }, next: "warroom_final" },
      ],
    },

    warroom_final: {
      chapter: 3,
      title: "古筝",
      plateTitle: "雪茄、烟灰缸与运河",
      deck: "史强把一根点着的雪茄按在桌面上。那是巴拿马运河的一岸。",
      stamp: "行动",
      place: "作战中心 · 会议室",
      time: "夜",
      art: "warroom",
      onEnter() { addClue("nano"); },
      beats: [
        { speaker: "旁白", role: "作战中心", seal: "叙", text: "史强把雪茄按在桌面上，又把另一支立在对面。两个烟头之间，是一条看不见的线。" },
        { speaker: "史强", role: "刑警", seal: "史", text: "“在运河两岸立两根柱子，柱子之间平行扯上许多细丝。丝是汪教授他们造的飞刃。”" },
        { speaker: "旁白", role: "参数", seal: "叙", text: "运河最窄处一百五十米。审判日号高三十一米，吃水八米。飞刃的间距最小只能做到半米。" },
        { speaker: "汪淼", role: "纳米中心", seal: "汪", text: "“如果存储信息的设备也被切割呢？”" },
        { speaker: "旁白", role: "代价", seal: "叙", text: "“切口很齐，硬盘里的信息大部分可以恢复。”有人回答，“但引水员和部分船员，会死。”" },
      ],
      choices: [
        { label: "支持史强的方案", hint: "先把信息拿回来", tone: "primary", effect: () => { adjust("trustShi", 2); }, next: "finale" },
        { label: "先问平民伤亡能不能再降", hint: "把人的代价摆上桌", effect: () => { adjust("integrity", 2); }, next: "finale" },
        { label: "要求把真相公开", hint: "让世界知道自己在赌什么", effect: () => { adjust("integrity", 1); adjust("exposure", 1); }, next: "finale" },
      ],
    },

    finale: {
      chapter: 3,
      title: "古筝行动",
      plateTitle: "巴拿马运河",
      deck: "位置、丝距、时机、目标、警告。五项参数，一次不可撤回的行动。",
      stamp: "执行",
      place: "巴拿马 · 盖拉德水道",
      time: "清晨",
      art: "warroom",
      type: "finale",
    },
  };

  // Add the terminal scene after the data object; renderEnding is the terminal UI.
  SCENES.ending = {
    chapter: 3,
    title: "结局",
    plateTitle: "档案封存",
    deck: "",
    stamp: "终",
    place: "档案室",
    time: "之后",
    art: "ending-canon",
    type: "ending",
  };

  function init() {
    bindCommon();
    updateTitleButtons();
    showScreen("title");
    const saved = loadSave();
    if (saved) {
      el.continueBtn.classList.remove("hidden");
    }
    window.__SANTI__ = {
      getState: () => R.clone(state),
      getScene: () => state.scene,
      goTo,
      advance,
      openDeductionChooser,
      openDeduction,
      submitSimAction: handleSimAction,
      finishSimulation,
      executeFinale,
      skipCinematic() {
        if (cinematicTimer) window.clearTimeout(cinematicTimer);
        state.finalePhase = "result";
        save();
        renderFinale();
      },
      finishEnding() {
        if (!state.finaleResult) return;
        state.ending = state.finaleResult.ending;
        unlockEnding(state.ending);
        save();
        renderEnding();
      },
      reset: () => {
        state = createInitialState();
        showScreen("title");
        updateTitleButtons();
      },
      grantAllClues: () => {
        Object.keys(CLUES).forEach((id) => addClue(id));
        renderGame();
      },
      rules: R,
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
