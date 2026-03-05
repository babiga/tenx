import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bankTransferSettingsSchema } from "@/lib/validations/settings";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.userType !== "dashboard") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const [setting] = await prisma.$queryRaw<
      Array<{
        id: string;
        key: string;
        bankName: string;
        accountNumber: string;
        accountHolderName: string;
        iban: string | null;
        swiftCode: string | null;
        branchName: string | null;
        paymentInstructions: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`SELECT * FROM "BankTransferSetting" WHERE "key" = 'default' LIMIT 1`;

    return NextResponse.json({
      success: true,
      data: setting
        ? setting
        : {
            bankName: "",
            accountNumber: "",
            accountHolderName: "",
            iban: "",
            swiftCode: "",
            branchName: "",
            paymentInstructions: "",
            isActive: true,
          },
    });
  } catch (error) {
    console.error("Get bank transfer settings error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (
      !session ||
      session.userType !== "dashboard" ||
      session.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const result = bankTransferSettingsSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid input",
          details: result.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = result.data;
    const id = randomUUID();
    const [setting] = await prisma.$queryRaw<
      Array<{
        id: string;
        key: string;
        bankName: string;
        accountNumber: string;
        accountHolderName: string;
        iban: string | null;
        swiftCode: string | null;
        branchName: string | null;
        paymentInstructions: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`
      INSERT INTO "BankTransferSetting" (
        "id",
        "key",
        "bankName",
        "accountNumber",
        "accountHolderName",
        "iban",
        "swiftCode",
        "branchName",
        "paymentInstructions",
        "isActive",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${id},
        'default',
        ${data.bankName},
        ${data.accountNumber},
        ${data.accountHolderName},
        ${data.iban || null},
        ${data.swiftCode || null},
        ${data.branchName || null},
        ${data.paymentInstructions || null},
        ${data.isActive},
        NOW(),
        NOW()
      )
      ON CONFLICT ("key")
      DO UPDATE SET
        "bankName" = EXCLUDED."bankName",
        "accountNumber" = EXCLUDED."accountNumber",
        "accountHolderName" = EXCLUDED."accountHolderName",
        "iban" = EXCLUDED."iban",
        "swiftCode" = EXCLUDED."swiftCode",
        "branchName" = EXCLUDED."branchName",
        "paymentInstructions" = EXCLUDED."paymentInstructions",
        "isActive" = EXCLUDED."isActive",
        "updatedAt" = NOW()
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Bank transfer settings updated successfully",
      data: setting,
    });
  } catch (error) {
    console.error("Update bank transfer settings error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
