import { z } from "zod";

export const CAR_COLORS = ["米色", "白色", "黑色", "红色", "蓝色", "绿色"] as const;
export const AGE_GROUPS = ["18-25岁", "26-35岁", "36-45岁", "46-55岁", "56岁以上"] as const;
export const PURCHASE_PURPOSES = ["家用", "通勤", "商务接待", "长途自驾", "个人代步", "其他"] as const;

export type CarColor = (typeof CAR_COLORS)[number];
export type AgeGroup = (typeof AGE_GROUPS)[number];
export type PurchasePurpose = (typeof PURCHASE_PURPOSES)[number];

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  "18-25岁": "18-25 years old",
  "26-35岁": "26-35 years old",
  "36-45岁": "36-45 years old",
  "46-55岁": "46-55 years old",
  "56岁以上": "56 years and above",
};

export const PURCHASE_PURPOSE_LABELS: Record<PurchasePurpose, string> = {
  家用: "Family use",
  通勤: "Commuting",
  商务接待: "Business reception",
  长途自驾: "Long-distance road trips",
  个人代步: "Personal mobility",
  其他: "Other",
};

export const COLOR_META: Record<CarColor, {
  slug: string;
  display: string;
  hex: string;
  glow: string;
  english: string;
}> = {
  米色: { slug: "beige", display: "雅灰", hex: "#d8cbb7", glow: "rgba(224, 204, 174, .42)", english: "Elegant Grey" },
  白色: { slug: "white", display: "白色", hex: "#f4f5f2", glow: "rgba(218, 235, 255, .38)", english: "Pearl White" },
  黑色: { slug: "black", display: "黑色", hex: "#24272b", glow: "rgba(130, 158, 190, .32)", english: "Obsidian Black" },
  红色: { slug: "red", display: "红色", hex: "#7f1932", glow: "rgba(211, 44, 82, .42)", english: "Crimson Red" },
  蓝色: { slug: "blue", display: "蓝色", hex: "#173f78", glow: "rgba(47, 117, 225, .44)", english: "Celestial Blue" },
  绿色: { slug: "green", display: "绿色", hex: "#0e503e", glow: "rgba(26, 160, 114, .38)", english: "Forest Green" },
};

export function getColorDisplayName(color: string) {
  return color in COLOR_META ? COLOR_META[color as CarColor].display : color;
}

export const QUESTION_TITLES = [
  { zh: "您的年龄段是？", en: "What is your age group?" },
  { zh: "您主要购车用途是？", en: "What are your main vehicle use cases?" },
  { zh: "以下6种颜色中，您第一眼最喜欢哪一个？", en: "Among the six colors, which one do you like most at first sight?" },
  { zh: "如果实际购车，您最可能选择哪个颜色？", en: "If you were buying the vehicle, which color would you most likely choose?" },
  { zh: "请按照实际购买意愿对6种颜色排序", en: "Please rank the six colors by purchase intention." },
  { zh: "您认为哪个颜色最能体现该车型的“高级感”？", en: "Which color best conveys a premium feel for this model?" },
  { zh: "您认为哪个颜色最适合作为宣传主视觉色？", en: "Which color is most suitable as the main campaign visual?" },
  { zh: "您认为哪个颜色未来二手车更容易保值？", en: "Which color do you think will retain resale value better?" },
  { zh: "您所负责的国家是？", en: "Which countries are you responsible for?" },
  { zh: "您负责的产品线是？", en: "Which product lines are you responsible for?" },
] as const;

const carColorSchema = z.enum(CAR_COLORS);
const optionalTextSchema = z.string().trim().max(80, "请控制在80个字符以内").optional().default("");

export const surveySubmissionSchema = z.object({
  clientSubmissionId: z.string().uuid(),
  ageGroup: z.enum(AGE_GROUPS),
  purchasePurposes: z.array(z.enum(PURCHASE_PURPOSES)).min(1, "请至少选择一项购车用途"),
  responsibleCountry: optionalTextSchema,
  productLine: optionalTextSchema,
  firstImpression: carColorSchema,
  purchaseChoice: carColorSchema,
  ranking: z.array(carColorSchema).length(CAR_COLORS.length),
  premiumColor: carColorSchema,
  campaignColor: carColorSchema,
  resaleColor: carColorSchema,
}).superRefine((value, context) => {
  if (new Set(value.ranking).size !== CAR_COLORS.length) {
    context.addIssue({ code: "custom", path: ["ranking"], message: "排序中每种颜色必须且只能出现一次" });
  }
});

export type SurveySubmission = z.infer<typeof surveySubmissionSchema>;

export type SurveyDraft = Partial<Omit<SurveySubmission, "purchasePurposes" | "ranking">> & {
  purchasePurposes: PurchasePurpose[];
  ranking: CarColor[];
  rankingTouched: boolean;
};

export const EMPTY_DRAFT: SurveyDraft = {
  purchasePurposes: [],
  ranking: [...CAR_COLORS],
  rankingTouched: false,
};
