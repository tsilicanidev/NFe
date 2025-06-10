import { gerarXmlNFe, transmitirNFe, assinarXml, gerarDanfe } from '@nfewizard-io/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export const processarEmissaoNFe = async (
  orderId: string
): Promise<{ sucesso: boolean; chave?: string; motivo?: string }> => {
  try {
    const { data: order, error } = await supabase
      .from('sales_orders')
      .select('*, customer:customers(*), items:sales_order_items(*, product:products(*))')
      .eq('id', orderId)
      .single();

    if (error || !order) return { sucesso: false, motivo: 'Pedido não encontrado' };

    // Gerar XML com validação JS-based (compatível com Vercel)
    const xml = gerarXmlNFe(order, {
      useForSchemaValidation: 'validateSchemaJsBased',
    });

    const xmlAssinado = await assinarXml(
      xml,
      process.env.CERT_PFX!,
      process.env.CERT_PASSWORD!
    );

    const resposta = await transmitirNFe(xmlAssinado);
    if (!resposta.sucesso) return { sucesso: false, motivo: resposta.motivo };

    const pdf = await gerarDanfe(xmlAssinado);

    await supabase.storage.from('nfe').upload(`xml/${resposta.chave}.xml`, Buffer.from(xmlAssinado), {
      contentType: 'application/xml',
      upsert: true,
    });

    await supabase.storage.from('nfe').upload(`pdf/${resposta.chave}.pdf`, pdf, {
      contentType: 'application/pdf',
      upsert: true,
    });

    await supabase
      .from('sales_orders')
      .update({ status: 'approved', nfe_chave: resposta.chave })
      .eq('id', orderId);

    return { sucesso: true, chave: resposta.chave };
  } catch (e: any) {
    console.error('Erro ao emitir NF-e:', e);
    return { sucesso: false, motivo: e.message || 'Erro desconhecido' };
  }
};
