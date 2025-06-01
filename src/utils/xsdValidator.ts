
import fs from 'fs';
import libxmljs from 'libxmljs2';

export function validarXMLComXSD(xmlString: string, xsdPath: string): string[] {
  const xsdContent = fs.readFileSync(xsdPath, 'utf8');
  const xsdDoc = libxmljs.parseXml(xsdContent);
  const xmlDoc = libxmljs.parseXml(xmlString);

  const isValid = xmlDoc.validate(xsdDoc);
  return isValid ? [] : xmlDoc.validationErrors.map(err => err.message);
}
