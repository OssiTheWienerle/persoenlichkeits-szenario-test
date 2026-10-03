import { TEST_VERSION } from '@/lib/test';

export function GET() {
  return Response.json({ status: 'ok', version: TEST_VERSION }, { headers: { 'Cache-Control': 'no-store' } });
}
