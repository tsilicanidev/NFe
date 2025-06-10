
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_SERVICE_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chave } = req.query;
  if (!chave || typeof chave !== 'string') return res.status(400).send('Chave inválida');

  const { data, error } = await supabase
    .storage
    .from('nfe')
    .download(`pdf/${chave}.pdf`);

  if (error || !data) return res.status(404).send('PDF não encontrado');

  res.setHeader('Content-Type', 'application/pdf');
  data.body.pipe(res);
}
