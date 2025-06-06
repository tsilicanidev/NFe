import { gerarXmlNFe } from '../utils/nfeUtils';

export async function generateNFeXml(notaFiscal: any): Promise<string> {
  try {
    const xml = gerarXmlNFe(notaFiscal);
    return xml;
  } catch (error) {
    console.error('Erro ao gerar XML:', error);
    throw new Error('Erro ao gerar XML da NF-e');
  }
}

// Note: emitirNFe function removed as it's handled by Supabase Edge Function