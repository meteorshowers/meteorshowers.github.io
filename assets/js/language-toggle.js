(function () {
  var translations = {
    zh: {
      "site.description": "闭环 Physical AI · 数据 · 仿真 · 模型 · 部署",
      "nav.home": "首页",
      "nav.news": "动态",
      "nav.contact": "联系",
      "hero.kicker": "Agent · VLA · 世界模型",
      "hero.title": "构建能理解、预测并作用于物理世界的智能体。",
      "hero.role": "李炫毅｜现任众擎机器人具身模型负责人",
      "hero.focus": "我构建闭环 Physical AI 系统，覆盖数据采集、模型训练、评测与真实场景部署。",
      "hero.contact": "联系",
      "hero.about": "个人简介",
      "xlab.title": "构建具身 Agent、VLA 与世界模型系统。",
      "xlab.subtitle": "01 · 众擎机器人",
      "xlab.body": "在众擎机器人（EngineAI Robotics），我负责数据闭环系统（包括数据采集装置、数据运营、数据自动化标注与清洗），同时推进 Agent 推理与任务编排、VLA 策略和世界建模。这套完整体系将机器人经验持续转化为训练数据和模型能力，使机器人能够理解目标、预测物理结果，并在真实环境中完成任务。",
      "xlab.note": "EngineAI Robotics 相关展示。",
      "xlab.tabVideo": "演示视频",
      "xlab.tabSystem": "系统视图",
      "xpeng.title": "面向机器人决策与动作生成的 VLA / XPlanner。",
      "xpeng.subtitle": "02 · 机器人策略",
      "xpeng.body": "在小鹏汽车，我主导并核心参与了车端 VLA / XPlanner 系统，工作包括路线视频到轨迹建模、大模型扩展、动态交互和复杂场景动作生成。这是一类在真实产品约束下做机器人策略学习的问题。",
      "dji.title": "先理解世界，再决定动作。",
      "dji.subtitle": "03 · 世界模型",
      "dji.body": "此前在大疆车载，我主要做 BEV 感知、动态目标检测、跟踪融合、占据式场景理解和 4D 标注闭环。这些工作是机器人理解真实世界、形成稳定世界状态的基础。",
      "nankai.title": "三维视觉是机器人感知运动的底座。",
      "nankai.subtitle": "04 · 感知基础",
      "nankai.body": "我构建并维护过实用的双目和深度系统，包括 X-StereoLab。双目匹配、主动双目、RGB-D 理解和道路结构感知，是机器人感知环境和建立空间理解的底层能力。",
      "mission.kicker": "使命",
      "mission.title": "构建通用、可靠、可持续迭代的具身智能体。",
      "mission.body": "我希望构建融合推理、VLA 策略与世界模型的具身 Agent，使其能够跨物理环境泛化、规模化部署，并通过闭环数据持续进化。",
      "news.kicker": "动态 / 进展",
      "news.title": "团队正在构建什么。",
      "news.intro": "记录我在众擎机器人（EngineAI Robotics） 领导推进并可公开分享的阶段性成果。",
      "visitors.kicker": "访问",
      "visitors.title": "全球访问",
      "visitors.views": "总浏览量",
      "visitors.unique": "访客"
    }
  };

  function setLanguage(lang) {
    var useZh = lang === "zh";
    document.documentElement.lang = useZh ? "zh-CN" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (node) {
      if (!node.dataset.i18nOriginal) {
        node.dataset.i18nOriginal = node.textContent.trim();
      }

      var key = node.getAttribute("data-i18n");
      node.textContent = useZh && translations.zh[key]
        ? translations.zh[key]
        : node.dataset.i18nOriginal;
    });

    document.querySelectorAll("[data-i18n-zh]").forEach(function (node) {
      if (!node.dataset.i18nOriginal) {
        node.dataset.i18nOriginal = node.textContent.trim();
      }

      node.textContent = useZh
        ? node.getAttribute("data-i18n-zh")
        : node.dataset.i18nOriginal;
    });

    document.querySelectorAll("[data-language-toggle]").forEach(function (button) {
      button.textContent = useZh ? "EN" : "中文";
      button.setAttribute("aria-label", useZh ? "Switch to English" : "切换到中文");
      button.setAttribute("aria-pressed", String(useZh));
    });

    window.localStorage.setItem("site-language", useZh ? "zh" : "en");
  }

  document.addEventListener("DOMContentLoaded", function () {
    var savedLanguage = window.localStorage.getItem("site-language") || "en";
    setLanguage(savedLanguage === "zh" ? "zh" : "en");

    document.querySelectorAll("[data-language-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLanguage(document.documentElement.lang === "zh-CN" ? "en" : "zh");
      });
    });
  });
})();
