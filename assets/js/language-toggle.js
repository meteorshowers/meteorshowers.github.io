(function () {
  var translations = {
    zh: {
      "site.description": "VLA · 世界模型 · 机器人系统",
      "nav.home": "首页",
      "nav.contact": "联系",
      "hero.kicker": "VLA · 世界模型 · 机器人系统",
      "hero.title": "做能落到真实机器人上的智能系统。",
      "hero.body": "我关注 VLA、世界模型和机器人系统工程，目标是把感知、规划、预测和动作真正接到物理世界里。",
      "hero.contact": "联系",
      "xlab.title": "面向具身机器人的 VLA 与世界模型系统。",
      "xlab.subtitle": "01 · XLab · 具身智能",
      "xlab.body": "在 XLab，我主要做具身智能相关工作，包括 VLA 策略、世界状态建模、多模态感知和闭环动作生成，希望让机器人能理解环境、预测变化，并在真实场景中执行任务。",
      "xlab.note": "XLab 具身智能相关展示。",
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
      "mission.title": "构建通用、可靠、可持续迭代的机器人智能。",
      "mission.body": "我希望做出能在真实世界规模化部署的机器人系统，并通过闭环数据、世界模型和持续迭代，让机器人能力不断提升。",
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
