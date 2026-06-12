import { PrismaClient } from "@prisma/client";
import { beforeAll, describe, expect, it } from "vitest";
import { POST as submitResponse } from "@/app/api/responses/route";
import { POST as login } from "@/app/api/admin/login/route";
import { GET as dashboard } from "@/app/api/admin/dashboard/route";
import { submission } from "../helpers";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.surveyResponse.deleteMany();
});

describe("survey API", () => {
  it("stores a valid response and rejects a duplicate client id", async () => {
    const body = submission();
    const first = await submitResponse(new Request("http://localhost/api/responses", { method: "POST", body: JSON.stringify(body) }));
    const duplicate = await submitResponse(new Request("http://localhost/api/responses", { method: "POST", body: JSON.stringify(body) }));
    expect(first.status).toBe(201);
    expect(duplicate.status).toBe(409);
  });

  it("rejects an incomplete response", async () => {
    const response = await submitResponse(new Request("http://localhost/api/responses", { method: "POST", body: JSON.stringify({}) }));
    expect(response.status).toBe(400);
  });
});

describe("admin API", () => {
  it("rejects unauthenticated dashboard access", async () => {
    const response = await dashboard(new Request("http://localhost/api/admin/dashboard"));
    expect(response.status).toBe(401);
  });

  it("sets a secure session after a valid login", async () => {
    const response = await login(new Request("http://localhost/api/admin/login", { method: "POST", body: JSON.stringify({ password: "test-password" }) }));
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("ex7_dashboard_session=");
  });
});
