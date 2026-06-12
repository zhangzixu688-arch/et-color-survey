"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, LoaderCircle, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AGE_GROUPS, AGE_GROUP_LABELS, COLOR_META, EMPTY_DRAFT, PURCHASE_PURPOSE_LABELS, PURCHASE_PURPOSES, QUESTION_TITLES, surveySubmissionSchema, type CarColor, type SurveyDraft } from "@/lib/survey";
import { ColorOptions } from "@/components/survey/color-options";
import { QuestionCard } from "@/components/survey/question-card";
import { RankingQuestion } from "@/components/survey/ranking-question";

const DRAFT_KEY = "ex7-color-survey-draft-v2";
type ErrorMap = Partial<Record<keyof SurveyDraft, string>>;
const TOTAL_QUESTIONS = QUESTION_TITLES.length;
const REQUIRED_QUESTIONS = TOTAL_QUESTIONS - 2;

function BilingualText({ zh, en }: { zh: string; en: string }) {
  return (
    <span className="grid gap-1">
      <span>{zh}</span>
      <span className="text-sm font-normal leading-6 tracking-normal text-white/42 md:text-base">{en}</span>
    </span>
  );
}

function OptionText({ zh, en }: { zh: string; en: string }) {
  return (
    <span className="grid text-sm leading-tight md:text-base">
      <span>{zh}</span>
      <span className="text-[11px] text-white/42 md:text-xs">{en}</span>
    </span>
  );
}

function completedCount(draft: SurveyDraft) {
  return [
    draft.ageGroup,
    draft.purchasePurposes.length > 0,
    draft.firstImpression,
    draft.purchaseChoice,
    draft.rankingTouched,
    draft.premiumColor,
    draft.campaignColor,
    draft.resaleColor,
  ].filter(Boolean).length;
}

export function SurveyForm() {
  const surveyRef = useRef<HTMLElement>(null);
  const [draft, setDraft] = useState<SurveyDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [surveyVisible, setSurveyVisible] = useState(false);
  const complete = useMemo(() => completedCount(draft), [draft]);

  useEffect(() => {
    let cancelled = false;
    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      queueMicrotask(() => {
        if (cancelled) return;
        if (stored) setDraft({ ...EMPTY_DRAFT, ...JSON.parse(stored) });
        setHydrated(true);
      });
    } catch { localStorage.removeItem(DRAFT_KEY); }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const node = surveyRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setSurveyVisible(entry.isIntersecting), { threshold: .02 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!submitted) localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [draft, submitted]);

  const update = <K extends keyof SurveyDraft>(key: K, value: SurveyDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: ErrorMap = {};
    if (!draft.ageGroup) next.ageGroup = "请选择您的年龄段 / Please select your age group.";
    if (!draft.purchasePurposes.length) next.purchasePurposes = "请至少选择一项购车用途 / Please select at least one use case.";
    if (!draft.firstImpression) next.firstImpression = "请选择第一眼最喜欢的颜色 / Please select the color you like most at first sight.";
    if (!draft.purchaseChoice) next.purchaseChoice = "请选择实际购车最可能选择的颜色 / Please select the color you would most likely buy.";
    if (!draft.rankingTouched) next.ranking = "请调整一次排序，以确认您的购买意愿顺序 / Please adjust the ranking once to confirm your purchase-intention order.";
    if (!draft.premiumColor) next.premiumColor = "请选择最能体现高级感的颜色 / Please select the color that best conveys a premium feel.";
    if (!draft.campaignColor) next.campaignColor = "请选择最适合作为宣传主视觉的颜色 / Please select the color most suitable for the main campaign visual.";
    if (!draft.resaleColor) next.resaleColor = "请选择更容易保值的颜色 / Please select the color you think will retain resale value better.";
    setErrors(next);
    const first = Object.keys(next)[0];
    const questionByKey: Partial<Record<keyof SurveyDraft, number>> = {
      ageGroup: 1,
      purchasePurposes: 2,
      firstImpression: 3,
      purchaseChoice: 4,
      ranking: 5,
      premiumColor: 6,
      campaignColor: 7,
      resaleColor: 8,
      responsibleCountry: 9,
      productLine: 10,
    };
    if (first) document.getElementById(`question-${questionByKey[first as keyof SurveyDraft]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    return Object.keys(next).length === 0;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;
    const payload = surveySubmissionSchema.parse({ ...draft, clientSubmissionId: draft.clientSubmissionId ?? crypto.randomUUID() });
    setDraft((current) => ({ ...current, clientSubmissionId: payload.clientSubmissionId }));
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/responses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "提交失败，请稍后重试 / Submission failed. Please try again later.");
      localStorage.removeItem(DRAFT_KEY);
      setSubmitted(true);
      setTimeout(() => document.getElementById("survey-success")?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
    } catch (error) { setSubmitError(error instanceof Error ? error.message : "提交失败，请稍后重试 / Submission failed. Please try again later."); }
    finally { setSubmitting(false); }
  };

  const togglePurpose = (purpose: (typeof PURCHASE_PURPOSES)[number]) => {
    update("purchasePurposes", draft.purchasePurposes.includes(purpose) ? draft.purchasePurposes.filter((item) => item !== purpose) : [...draft.purchasePurposes, purpose]);
  };

  if (submitted) {
    return (
      <section id="survey-success" className="relative z-10 mx-auto flex min-h-[78vh] max-w-4xl items-center px-5 py-32">
        <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="glass-strong w-full rounded-[2rem] px-6 py-20 text-center md:px-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: .15 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-400/15 ring-1 ring-blue-300/40"><Check className="h-7 w-7 text-blue-200" /></motion.div>
          <p className="eyebrow mt-8">Response Recorded</p>
          <h2 className="mt-4 text-4xl font-medium tracking-[-.045em] md:text-6xl">感谢参与调研</h2>
          <p className="mt-3 text-xl text-white/58">Thank you for participating in this survey.</p>
          <p className="mx-auto mt-5 max-w-md leading-7 text-white/48">你的每一次选择，都在帮助我们更准确地理解色彩与购车决策之间的关系。</p>
          <p className="mx-auto mt-2 max-w-md leading-7 text-white/34">Every choice helps us better understand how color influences vehicle purchase decisions.</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section ref={surveyRef} id="survey" data-hydrated={hydrated} className="relative z-10 mx-auto max-w-4xl px-5 pb-32 pt-24 md:px-8 md:pb-44 md:pt-36">
      <div className="mb-16 md:mb-24">
        <p className="eyebrow mb-4">Your Perspective</p>
        <h2 className="display-title text-5xl md:text-7xl">现在，轮到<br /><span className="text-white/40">你的判断。</span></h2>
        <p className="mt-4 text-lg text-white/62">Now it is your turn to decide.</p>
        <p className="mt-6 max-w-xl leading-7 text-white/52">问卷共 {TOTAL_QUESTIONS} 题，预计用时 2 分钟。第 9、10 题为选填，不收集姓名、电话等个人身份信息。</p>
        <p className="mt-2 max-w-xl leading-7 text-white/38">This survey has {TOTAL_QUESTIONS} questions and takes about 2 minutes. Questions 9 and 10 are optional. We do not collect names, phone numbers, or personal identity information.</p>
      </div>

      <AnimatePresence>{surveyVisible && <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="fixed inset-x-0 top-0 z-50 border-b border-white/8 bg-[#05070a]/72 px-4 py-3 backdrop-blur-xl"><div className="mx-auto flex max-w-4xl items-center gap-4"><span className="eyebrow whitespace-nowrap">必填进度 / Required {complete}/{REQUIRED_QUESTIONS}</span><div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8"><motion.div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-200" animate={{ width: `${(complete / REQUIRED_QUESTIONS) * 100}%` }} /></div></div></motion.div>}</AnimatePresence>

      <form onSubmit={submit} noValidate className="space-y-5 md:space-y-7">
        <QuestionCard number={1} title={<BilingualText {...QUESTION_TITLES[0]} />} error={errors.ageGroup}>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">{AGE_GROUPS.map((age) => <label key={age}><input className="option-input" type="radio" name="ageGroup" checked={draft.ageGroup === age} onChange={() => update("ageGroup", age)} /><span className="option-card"><OptionText zh={age} en={AGE_GROUP_LABELS[age]} />{draft.ageGroup === age && <Check className="ml-auto h-4 w-4" />}</span></label>)}</div>
        </QuestionCard>
        <QuestionCard number={2} title={<BilingualText {...QUESTION_TITLES[1]} />} hint="可多选 / Multiple selection" error={errors.purchasePurposes}>
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">{PURCHASE_PURPOSES.map((purpose) => { const selected = draft.purchasePurposes.includes(purpose); return <label key={purpose}><input className="option-input" type="checkbox" checked={selected} onChange={() => togglePurpose(purpose)} /><span className="option-card"><OptionText zh={purpose} en={PURCHASE_PURPOSE_LABELS[purpose]} />{selected && <Check className="ml-auto h-4 w-4" />}</span></label>; })}</div>
        </QuestionCard>
        <QuestionCard number={3} title={<BilingualText {...QUESTION_TITLES[2]} />} error={errors.firstImpression}><ColorOptions name="firstImpression" value={draft.firstImpression as CarColor | undefined} onChange={(value) => update("firstImpression", value)} /></QuestionCard>
        <QuestionCard number={4} title={<BilingualText {...QUESTION_TITLES[3]} />} error={errors.purchaseChoice}><ColorOptions name="purchaseChoice" value={draft.purchaseChoice as CarColor | undefined} onChange={(value) => update("purchaseChoice", value)} /></QuestionCard>
        <QuestionCard number={5} title={<BilingualText {...QUESTION_TITLES[4]} />} hint="拖动卡片，或使用右侧按钮调整顺序 / Drag the cards or use the buttons on the right to adjust the order." error={errors.ranking}>
          {hydrated ? <RankingQuestion value={draft.ranking} onChange={(ranking) => setDraft((current) => ({ ...current, ranking, rankingTouched: true }))} /> : <div className="grid gap-2.5">{draft.ranking.map((color, index) => <div key={color} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.045] p-4"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 font-mono text-xs">{index + 1}</span><span className="h-3.5 w-3.5 rounded-full" style={{ background: COLOR_META[color].hex }} /><OptionText zh={COLOR_META[color].display} en={COLOR_META[color].english} /></div>)}</div>}
        </QuestionCard>
        <QuestionCard number={6} title={<BilingualText {...QUESTION_TITLES[5]} />} error={errors.premiumColor}><ColorOptions name="premiumColor" value={draft.premiumColor as CarColor | undefined} onChange={(value) => update("premiumColor", value)} /></QuestionCard>
        <QuestionCard number={7} title={<BilingualText {...QUESTION_TITLES[6]} />} error={errors.campaignColor}><ColorOptions name="campaignColor" value={draft.campaignColor as CarColor | undefined} onChange={(value) => update("campaignColor", value)} /></QuestionCard>
        <QuestionCard number={8} title={<BilingualText {...QUESTION_TITLES[7]} />} error={errors.resaleColor}><ColorOptions name="resaleColor" value={draft.resaleColor as CarColor | undefined} onChange={(value) => update("resaleColor", value)} /></QuestionCard>
        <QuestionCard number={9} title={<BilingualText {...QUESTION_TITLES[8]} />} hint="选填 / Optional" error={errors.responsibleCountry}>
          <input className="text-field" value={draft.responsibleCountry ?? ""} onChange={(event) => update("responsibleCountry", event.target.value)} placeholder="例如：波兰、摩洛哥、埃及 / e.g. Poland, Morocco, Egypt" />
        </QuestionCard>
        <QuestionCard number={10} title={<BilingualText {...QUESTION_TITLES[9]} />} hint="选填 / Optional" error={errors.productLine}>
          <input className="text-field" value={draft.productLine ?? ""} onChange={(event) => update("productLine", event.target.value)} placeholder="例如：E0Y、T22等 / e.g. E0Y, T22, etc." />
        </QuestionCard>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="pt-8 text-center">
          <button disabled={submitting} type="submit" className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-8 font-medium text-black transition-transform duration-300 hover:scale-[1.025] disabled:cursor-wait disabled:opacity-60 md:min-h-16 md:px-11">
            {submitting ? <><LoaderCircle className="h-5 w-5 animate-spin" />正在提交 / Submitting</> : <>提交问卷 / Submit<Send className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
          </button>
          <AnimatePresence>{submitError && <motion.p role="alert" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm text-red-300">{submitError}</motion.p>}</AnimatePresence>
        </motion.div>
      </form>
    </section>
  );
}
