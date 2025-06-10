
import fs from 'fs';
import libxmljs from 'libxmljs2';

/**
 * Valida um XML contra um XSD.
 * @param {string} xmlPath Caminho do arquivo XML.
 * @param {string} xsdPath Caminho do arquivo XSD.
 * @returns {object} { valid: boolean, errors: array }
 */
export function validateXmlWithXsd(xmlPath, xsdPath) {
  const xmlString = fs.readFileSync(xmlPath, 'utf8');
  const xsdString = fs.readFileSync(xsdPath, 'utf8');

  const xmlDoc = libxmljs.parseXml(xmlString);
  const xsdDoc = libxmljs.parseXml(xsdString);

  const valid = xmlDoc.validate(xsdDoc);
  return {
    valid,
    errors: valid ? [] : xmlDoc.validationErrors
  };
}
