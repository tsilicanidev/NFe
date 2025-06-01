import { NFe } from 'nfewizard-io';
import { Buffer } from 'buffer';

const certificadoBase64 = process.env.CERT_PFX_BASE64 || '';
const senha = process.env.CERT_PFX_PASSWORD || '';

if (!certificadoBase64 || !senha) {
  console.warn('Certificado digital não configurado corretamente no .env');
}

const certificadoPFX = Buffer.from(certificadoBase64, 'base64');

export async function emitirNFeNFewizard(dadosNota: any) {
  const nfe = new NFe({
    certificado: {
      pfx: certificadoPFX,
      senha: senha
    },
    ambiente: 'homologacao',
    estado: 'SP'
  });

  const xml = await nfe.gerarXML(dadosNota);
  const assinado = await nfe.assinarXML(xml);
  const resposta = await nfe.enviarXML(assinado);

  return {
    xml,
    assinado,
    resposta
  };
}