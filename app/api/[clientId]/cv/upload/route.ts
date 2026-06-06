import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { message: 'The legacy CV upload API is retired. Marketplace media upload will use MinIO in a later sprint.' },
    { status: 410 },
  );
}
