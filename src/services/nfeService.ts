import { NFe } from 'nfewizard-io';

export async function generateNFeXml(notaFiscal: any): Promise<string> {
  try {
    const nfe = new NFe();
    const xml = await nfe.gerarXML(notaFiscal);
    return xml;
  } catch (error) {
    console.error('Erro ao gerar XML:', error);
    throw new Error('Erro ao gerar XML da NF-e');
  }
}

export async function emitirNFe(xml: string, certificado: { arquivo: string; senha: string }) {
  try {
    const nfe = new NFe({
      certificado: {
        pfx: Buffer.from(certificado.arquivo, 'base64'),
        senha: certificado.senha
      },
      ambiente: 'homologacao'
    });

    const xmlAssinado = await nfe.assinarXML(xml);
    const resposta = await nfe.enviarXML(xmlAssinado);

    return {
      xml: xmlAssinado,
      resposta
    };
  } catch (error) {
    console.error('Erro ao emitir NF-e:', error);
    throw error;
  }
}