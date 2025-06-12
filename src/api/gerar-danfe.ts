import { gerarDanfePDF } from '@nfewizard-io';

export async function POST(req: Request) {
  const { xml } = await req.json();

  const pdf = await gerarDanfePDF(xml);
  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="danfe.pdf"',
    },
  });
}