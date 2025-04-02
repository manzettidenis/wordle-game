"use server";
import { Words } from "@/interfaces";
import { NextResponse } from "next/server";
import json from "./data.json";
const words: Words = json;

export async function GET() {
  // Get data from your database
  return NextResponse.json(words, { status: 200 });
}
