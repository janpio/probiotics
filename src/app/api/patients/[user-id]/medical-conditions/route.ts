import { NextResponse, type NextRequest } from "next/server";

import { UserType } from "@/types/user";
import { saltHashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createPatientSchema } from "@/lib/schema";
import { validator } from "@/app/api/validator";

export async function GET(
  req,ctx
) {
  const action = async () => {
    const patients = await prisma.patient.findUnique({
      where: {
        userId: params["user-id"],
      },
      include: {
        medicalConditions: true,
      },
    });

    return NextResponse.json(
      patients.map((patient) => {
        const { user, userId, ...patientInfo } = patient;
        const { password, salt, ...userInfo } = user;
        return {
          type: UserType.Patient,
          ...userInfo,
          ...patientInfo,
        };
      })
    );
  };

  return validator(action);
}

export async function POST(req: NextRequest) {
  const action = async () => {
    // Validate the request body against the schema
    const body: unknown = await req.json();
    const { ssn, gender, birthDate, ethnicity, ..._userInfo } =
      createPatientSchema.parse(body);

    const patient = await prisma.patient.create({
      data: {
        user: {
          create: {
            ..._userInfo,
            ...saltHashPassword(_userInfo.password),
          },
        },
        ssn,
        gender,
        birthDate,
        ethnicity,
      },
      include: {
        user: true,
      },
    });

    const { user, userId, ...patientInfo } = patient;
    const { password, salt, ...userInfo } = user;
    return NextResponse.json({
      type: UserType.Patient,
      ...userInfo,
      ...patientInfo,
    });
  };

  return validator(action);
}
