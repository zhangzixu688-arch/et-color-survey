import { z } from "zod";

export const CAR_COLORS = ["米色", "白色", "黑色", "红色", "蓝色", "绿色"] as const;
export const AGE_GROUPS = ["18-25岁", "26-35岁", "36-45岁", "46-55岁", "56岁以上"] as const;
export const PURCHASE_PURPOSES = ["家用", "通勤", "商务接待", "长途自驾", "个人代步", "其他"] as const;

export type CarColor = (typeof CAR_COLORS)[number];
export type AgeGroup = (typeof AGE_GROUPS)[number];
export type PurchasePurpose = (typeof PURCHASE_PURPOSES)[number];

export const COLOR_META: Record<CarColor, {
  slug: string;
  hex: string;
  glow: string;
  english: string;
}> = {
  米色: { slug: "beige", hex: "#d8cbb7", glow: "rgba(224, 204, 174, .42)", english: "Silk Beige" },
  白色: { slug: "white", hex: "#f4f5f2", glow: "rgba(218, 235, 255, .38)", english: "Pearl White" },
  黑色: { slug: "black", hex: "#24272b", glow: "rgba(130, 158, 190, .32)", english: "Obsidian Black" },
  红色: { slug: "red", hex: "#7f1932", glow: "rgba(211, 44, 82, .42)", english: "Crimson Red" },
  蓝色: { slug: "blue", hex: "#173f78", glow: "rgba(47, 117, 225, .44)", english: "Celestial Blue" },
  绿色: { slug: "green", hex: "#0e503e", glow: "rgba(26, 160, 114, .38)", english: "Forest Green" },
};

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

export const QUESTION_TITLES = [
  "您的年龄段是？",
  "您主要购车用途是？",
  "您所负责的国家是？",
  "您负责的产品线是？",
  "以下6种颜色中，您第一眼最喜欢哪一个？",
  "如果实际购车，您最可能选择哪个颜色？",
  "请按照实际购买意愿对6种颜色排序",
  "您认为哪个颜色最能体现该车型的“高级感”？",
  "您认为哪个颜色最适合作为宣传主视觉色？",
  "您认为哪个颜色未来二手车更容易保值？",
] as const;

export const EMPTY_DRAFT: SurveyDraft = {
  purchasePurposes: [],
  ranking: [...CAR_COLORS],
  rankingTouched: false,
};
