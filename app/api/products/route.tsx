import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "@/prisma/client";

export async function GET(req: NextRequest) {
  const products = await prisma.product.findMany();

  return await NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = schema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const product = await prisma.product.findUnique({
    where: {
      name: body.name,
    },
  });

  if (product)
    return NextResponse.json(
      { error: "product already exists." },
      { status: 400 }
    );

  const newProduct = await prisma.product.create({
    data: {
      name: body.name,
      price: body.price,
    },
  });
  console.log(newProduct);

  return NextResponse.json(newProduct, { status: 201 });
}
