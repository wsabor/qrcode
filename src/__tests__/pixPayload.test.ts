import { describe, it, expect } from 'vitest'
import { buildPixPayload } from '../pixPayload'

// Dados mínimos válidos reutilizados em vários testes
const base = {
  chave: 'wagner@email.com',
  nome: 'Wagner Sabor',
  cidade: 'Sao Paulo',
}

// ---------------------------------------------------------------------------
// Estrutura obrigatória do payload EMVCo / PIX
// ---------------------------------------------------------------------------
describe('buildPixPayload — estrutura obrigatória', () => {
  it('começa com o indicador de formato PIX (campo 00 = 01)', () => {
    // Todo QR Code PIX deve começar com "000201"
    expect(buildPixPayload(base)).toMatch(/^000201/)
  })

  it('contém o identificador do domínio PIX do BCB (campo 26)', () => {
    expect(buildPixPayload(base)).toContain('BR.GOV.BCB.PIX')
  })

  it('contém a chave PIX no payload', () => {
    expect(buildPixPayload(base)).toContain('wagner@email.com')
  })

  it('moeda é sempre BRL — código 986 (campo 53)', () => {
    expect(buildPixPayload(base)).toContain('5303986')
  })

  it('país é sempre BR (campo 58)', () => {
    expect(buildPixPayload(base)).toContain('5802BR')
  })

  it('contém o nome do recebedor (campo 59)', () => {
    expect(buildPixPayload(base)).toContain('Wagner Sabor')
  })

  it('contém a cidade do recebedor (campo 60)', () => {
    expect(buildPixPayload(base)).toContain('Sao Paulo')
  })

  it('contém o campo de dados adicionais com *** (campo 62)', () => {
    // O campo 62/05 é obrigatório no padrão PIX e leva "***" quando sem txid
    expect(buildPixPayload(base)).toContain('0503***')
  })
})

// ---------------------------------------------------------------------------
// Campo 54 — valor da transação (opcional)
// ---------------------------------------------------------------------------
describe('buildPixPayload — campo de valor (54)', () => {
  it('inclui o campo 54 quando valor é maior que zero', () => {
    const result = buildPixPayload({ ...base, valor: '25.90' })
    expect(result).toContain('25.90')
  })

  it('formata valor inteiro com duas casas decimais', () => {
    // "5" deve virar "5.00" — exigência do padrão EMVCo
    const result = buildPixPayload({ ...base, valor: '5' })
    expect(result).toContain('5.00')
  })

  it('formata valor com três casas decimais arredondando para duas', () => {
    const result = buildPixPayload({ ...base, valor: '10.505' })
    expect(result).toContain('10.51')
  })

  it('omite campo 54 quando nenhum valor é fornecido', () => {
    // Sem valor → QR Code aberto (o pagador digita o valor)
    const result = buildPixPayload(base)
    expect(result).not.toMatch(/5403|5404|5405|5406/)
  })

  it('omite campo 54 quando valor é zero', () => {
    const result = buildPixPayload({ ...base, valor: '0' })
    expect(result).not.toMatch(/5403|5404|5405/)
  })
})

// ---------------------------------------------------------------------------
// Campo 02 — descrição (opcional, dentro do campo 26)
// ---------------------------------------------------------------------------
describe('buildPixPayload — campo de descrição (02)', () => {
  it('inclui a descrição quando fornecida', () => {
    const result = buildPixPayload({ ...base, descricao: 'Aluguel julho' })
    expect(result).toContain('Aluguel julho')
  })

  it('omite descrição quando não fornecida', () => {
    // Campo 02 dentro do MAI não deve aparecer
    const result = buildPixPayload(base)
    expect(result).not.toMatch(/0213|0214|0207/)
  })

  it('omite descrição quando string vazia', () => {
    const result = buildPixPayload({ ...base, descricao: '' })
    expect(result).not.toContain('0200')
  })

  it('trunca descrição em 72 caracteres', () => {
    const descLonga = 'X'.repeat(80)
    const result = buildPixPayload({ ...base, descricao: descLonga })
    expect(result).toContain('X'.repeat(72))
    expect(result).not.toContain('X'.repeat(73))
  })
})

// ---------------------------------------------------------------------------
// Limites de tamanho definidos pelo padrão PIX
// ---------------------------------------------------------------------------
describe('buildPixPayload — limites de tamanho', () => {
  it('trunca nome em 25 caracteres', () => {
    const nomeGrande = 'A'.repeat(30)
    const result = buildPixPayload({ ...base, nome: nomeGrande })
    expect(result).toContain('A'.repeat(25))
    expect(result).not.toContain('A'.repeat(26))
  })

  it('trunca cidade em 15 caracteres', () => {
    const cidadeGrande = 'B'.repeat(20)
    const result = buildPixPayload({ ...base, cidade: cidadeGrande })
    expect(result).toContain('B'.repeat(15))
    expect(result).not.toContain('B'.repeat(16))
  })

  it('ignora espaços extras no início e fim da chave', () => {
    const result1 = buildPixPayload({ ...base, chave: '  wagner@email.com  ' })
    const result2 = buildPixPayload(base)
    expect(result1).toBe(result2)
  })
})

// ---------------------------------------------------------------------------
// CRC16 — integridade do payload
// ---------------------------------------------------------------------------
describe('buildPixPayload — CRC16', () => {
  it('termina com 4 dígitos hexadecimais maiúsculos', () => {
    const result = buildPixPayload(base)
    const crc = result.slice(-4)
    expect(crc).toMatch(/^[0-9A-F]{4}$/)
  })

  it('o CRC é precedido pelo marcador de campo 6304', () => {
    const result = buildPixPayload(base)
    // Os últimos 8 chars devem ser: 6304 + 4 chars de CRC
    expect(result.slice(-8, -4)).toBe('6304')
  })

  it('payloads com entradas diferentes geram CRCs diferentes', () => {
    const r1 = buildPixPayload({ ...base, chave: 'chave1@pix.com' })
    const r2 = buildPixPayload({ ...base, chave: 'chave2@pix.com' })
    expect(r1.slice(-4)).not.toBe(r2.slice(-4))
  })

  it('mesmo payload sempre gera o mesmo CRC (determinístico)', () => {
    const r1 = buildPixPayload(base)
    const r2 = buildPixPayload(base)
    expect(r1).toBe(r2)
  })
})
