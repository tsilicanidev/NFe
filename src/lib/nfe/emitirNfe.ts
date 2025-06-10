
import { gerarXmlNFe, transmitirNFe, assinarXml, gerarDanfe } from '@nfewizard-io/node';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// Função principal
export const processarEmissaoNFe = async (orderId: string): Promise<{ sucesso: boolean; chave?: string; motivo?: string }> => {
  try {
    const { data: order, error } = await supabase
      .from('sales_orders')
      .select('*, customer:customers(*), items:sales_order_items(*, product:products(*))')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return { sucesso: false, motivo: 'Pedido não encontrado' };
    }

    // Geração do XML com base nos dados do pedido
    const xml = gerarXmlNFe(order, { useForSchemaValidation: 'validateSchemaJsBased' });

    // Assinatura do XML com certificado A1 (PFX Base64 da env)
    const certificadoBase64 = process.env.CERT_PFX!;
    const senha = process.env.CERT_PASSWORD!;
    const xmlAssinado = await assinarXml(xml, certificadoBase64, senha);

    // Transmissão para SEFAZ
    const resposta = await transmitirNFe(xmlAssinado);

    if (!resposta.sucesso) {
      return { sucesso: false, motivo: resposta.motivo };
    }

    // Gerar PDF da DANFE
    const pdf = await gerarDanfe(xmlAssinado);

    // Salvar XML e PDF no Supabase
    const xmlUpload = await supabase.storage.from('nfe').upload(`xml/${resposta.chave}.xml`, Buffer.from(xmlAssinado), {
      contentType: 'application/xml',
      upsert: true,
    });

    const pdfUpload = await supabase.storage.from('nfe').upload(`pdf/${resposta.chave}.pdf`, pdf, {
      contentType: 'application/pdf',
      upsert: true,
    });

    // Atualizar pedido com status e chave
    await supabase
      .from('sales_orders')
      .update({ status: 'approved', nfe_chave: resposta.chave })
      .eq('id', orderId);

    return { sucesso: true, chave: resposta.chave };
  } catch (e: any) {
    return { sucesso: false, motivo: e.message || 'Erro desconhecido' };
  }
};
