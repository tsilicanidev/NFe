import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadXMLParaStorage(xml: string, chaveAcesso: string) {
  const { error } = await supabase.storage
    .from('nfe')
    .upload(`xml/${chaveAcesso}.xml`, xml, {
      contentType: 'application/xml',
      upsert: true,
    });

  if (error) {
    throw new Error(`Erro ao subir XML para o storage: ${error.message}`);
  }
}

export async function uploadPDFParaStorage(pdfBuffer: Buffer, chaveAcesso: string) {
  const { error } = await supabase.storage
    .from('nfe')
    .upload(`pdf/${chaveAcesso}.pdf`, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

  if (error) {
    throw new Error(`Erro ao subir PDF para o storage: ${error.message}`);
  }
}
