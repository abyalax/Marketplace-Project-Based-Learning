import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      message: 'The legacy CV extraction API is retired. Mastra and marketplace content workflows remain separate for Sprint 1.',
    },
    { status: 410 },
  );
}
