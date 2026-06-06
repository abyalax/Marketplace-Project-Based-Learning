import { NextResponse } from 'next/server';

const retiredMessage = 'The legacy CV API is retired. Use the marketplace Sprint 1 schema as the active product foundation.';

export async function GET() {
  return NextResponse.json({ message: retiredMessage }, { status: 410 });
}

export async function PUT() {
  return NextResponse.json({ message: retiredMessage }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ message: retiredMessage }, { status: 410 });
}
