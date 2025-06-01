
import { emitirNotaFiscalEletronica } from '../src/services/nfeService';
import { validarXMLComXSD } from '../src/utils/xsdValidator';
import path from 'path';

describe('Emissão de NF-e com nfewizard-io', () => {
  it('deve emitir uma NF-e válida e validar com XSD', async () => {
    const dadosNota = {
      emit: {
        CNPJ: '12345678000195',
        xNome: 'Empresa Emitente',
        IE: '1234567890',
        enderEmit: {
          xLgr: 'Rua Teste',
          nro: '123',
          xBairro: 'Centro',
          cMun: '3550308',
          xMun: 'São Paulo',
          UF: 'SP',
          CEP: '01001000',
          cPais: '1058',
          xPais: 'Brasil'
        }
      },
      dest: {
        CPF: '12345678909',
        xNome: 'Cliente Teste',
        enderDest: {
          xLgr: 'Rua Cliente',
          nro: '321',
          xBairro: 'Bairro',
          cMun: '3550308',
          xMun: 'São Paulo',
          UF: 'SP',
          CEP: '01002000',
          cPais: '1058',
          xPais: 'Brasil'
        }
      },
      ide: {
        cUF: '35',
        natOp: 'Venda de mercadoria',
        mod: '55',
        serie: '1',
        nNF: 1234,
        dhEmi: new Date().toISOString(),
        tpNF: 1,
        idDest: 1,
        tpImp: 1,
        tpEmis: 1,
        finNFe: 1,
        indFinal: 1,
        indPres: 1,
        procEmi: 0,
        verProc: '1.0'
      },
      det: [{
        prod: {
          cProd: '001',
          xProd: 'Produto Teste',
          CFOP: '5102',
          uCom: 'UN',
          qCom: '1.0000',
          vUnCom: '100.00',
          vProd: '100.00',
          uTrib: 'UN',
          qTrib: '1.0000',
          vUnTrib: '100.00'
        },
        imposto: {
          ICMS: { ICMS00: { orig: '0', CST: '00', modBC: '3', vBC: '100.00', pICMS: '18.00', vICMS: '18.00' } },
          PIS: { PISAliq: { CST: '01', vBC: '100.00', pPIS: '1.65', vPIS: '1.65' } },
          COFINS: { COFINSAliq: { CST: '01', vBC: '100.00', pCOFINS: '7.60', vCOFINS: '7.60' } }
        }
      }],
      total: {
        ICMSTot: {
          vBC: '100.00',
          vICMS: '18.00',
          vPIS: '1.65',
          vCOFINS: '7.60',
          vProd: '100.00',
          vNF: '100.00'
        }
      },
      transp: { modFrete: '0' }
    };

    const resultado = await emitirNotaFiscalEletronica(dadosNota);
    expect(resultado.sucesso).toBe(true);

    const xsdPath = path.join(__dirname, '..', 'schemas', 'leiauteNFe_v4.00.xsd');
    const erros = validarXMLComXSD(resultado.xml, xsdPath);
    expect(erros.length).toBe(0);
  });
});
