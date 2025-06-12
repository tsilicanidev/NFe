import { emitirNFe } from '@nfewizard-io/node';

export async function POST(req: Request) {
  const { pedido } = await req.json();

  const resultado = await emitirNFe({
    pedido,
    certificadoPfxBase64: process.env.CERT_PFX || '',
    senha: process.env.CERT_PASSWORD || '',
    ambiente: 'homologacao',
  });

  return new Response(JSON.stringify(resultado), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}