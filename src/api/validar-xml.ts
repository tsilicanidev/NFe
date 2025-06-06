import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';
// @ts-ignore
import libxmljs from 'libxmljs2';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const xml = req.body;

    const xsdPath = path.join(__dirname, '../../schemas/leiauteNFe_v4.00.xsd');
    if (!fs.existsSync(xsdPath)) {
      return res.status(500).json({ error: 'Arquivo XSD não encontrado' });
    }

    const xsdContent = fs.readFileSync(xsdPath, 'utf-8');
    const xmlDoc = libxmljs.parseXml(xml);
    const xsdDoc = libxmljs.parseXml(xsdContent);

    const isValid = xmlDoc.validate(xsdDoc);
    if (!isValid) {
      return res.status(400).json({
        error: 'XML inválido',
        detalhes: xmlDoc.validationErrors.map((e: any) => e.message),
      });
    }

    return res.status(200).json({ ok: true, mensagem: 'XML válido com base no XSD' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Erro ao validar XML', detalhes: err.message });
  }
}