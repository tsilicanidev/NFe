import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY;
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

export async function saveFileToSupabase(
  bucket: 'nfe',
  path: string,
  content: Buffer | string,
  contentType: string
): Promise<void> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, content, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Erro ao salvar arquivo no Supabase Storage: ${error.message}`);
  }
}
