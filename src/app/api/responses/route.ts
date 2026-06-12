import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { createSurveyResponse } from "@/lib/repository";
import { surveySubmissionSchema } from "@/lib/survey";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const result = surveySubmissionSchema.safeParse(await request.json());
    if (!result.success) {
      return NextResponse.json({ error: "问卷内容不完整", issues: result.error.flatten() }, { status: 400 });
    }
    const response = await createSurveyResponse(result.data);
    return NextResponse.json({ id: response.id, createdAt: response.createdAt }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "该问卷已经提交过" }, { status: 409 });
    }
    console.error("Failed to create survey response", error);
    return NextResponse.json({ error: "提交失败，请稍后重试" }, { status: 500 });
  }
}
