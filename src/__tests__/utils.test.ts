import { describe, it, expect } from 'vitest'
import { escapeWifi, buildVCard } from '../lib/utils'

// ---------------------------------------------------------------------------
// escapeWifi
// O padrão WPA2 exige que \ ; , " sejam escapados com barra invertida.
// Se não escapar, o leitor de QR Code interpreta errado e não conecta.
// ---------------------------------------------------------------------------
describe('escapeWifi', () => {
  it('não altera senhas sem caracteres especiais', () => {
    expect(escapeWifi('minhasenha123')).toBe('minhasenha123')
  })

  it('escapa barra invertida', () => {
    expect(escapeWifi('a\\b')).toBe('a\\\\b')
  })

  it('escapa ponto e vírgula', () => {
    expect(escapeWifi('senha;aqui')).toBe('senha\\;aqui')
  })

  it('escapa vírgula', () => {
    expect(escapeWifi('senha,aqui')).toBe('senha\\,aqui')
  })

  it('escapa aspas duplas', () => {
    expect(escapeWifi('senha"aqui')).toBe('senha\\"aqui')
  })

  it('escapa múltiplos caracteres especiais na mesma string', () => {
    expect(escapeWifi('a;b,c"d\\e')).toBe('a\\;b\\,c\\"d\\\\e')
  })

  it('string vazia continua vazia', () => {
    expect(escapeWifi('')).toBe('')
  })
})

// ---------------------------------------------------------------------------
// buildVCard
// vCard 3.0 — formato de contato lido por smartphones.
// Campos opcionais só aparecem quando preenchidos.
// ---------------------------------------------------------------------------
describe('buildVCard', () => {
  it('sempre contém os campos obrigatórios do padrão vCard 3.0', () => {
    const result = buildVCard('Ana Silva', '', '', '', '')
    expect(result).toContain('BEGIN:VCARD')
    expect(result).toContain('VERSION:3.0')
    expect(result).toContain('FN:Ana Silva')
    expect(result).toContain('END:VCARD')
  })

  it('inclui telefone quando fornecido', () => {
    const result = buildVCard('Ana', '11999990000', '', '', '')
    expect(result).toContain('TEL;TYPE=CELL:11999990000')
  })

  it('omite linha de telefone quando vazio', () => {
    const result = buildVCard('Ana', '', '', '', '')
    expect(result).not.toContain('TEL')
  })

  it('inclui e-mail quando fornecido', () => {
    const result = buildVCard('Ana', '', 'ana@email.com', '', '')
    expect(result).toContain('EMAIL:ana@email.com')
  })

  it('omite linha de e-mail quando vazio', () => {
    const result = buildVCard('Ana', '', '', '', '')
    expect(result).not.toContain('EMAIL')
  })

  it('inclui empresa quando fornecida', () => {
    const result = buildVCard('Ana', '', '', 'ACME Ltda', '')
    expect(result).toContain('ORG:ACME Ltda')
  })

  it('omite linha de empresa quando vazia', () => {
    const result = buildVCard('Ana', '', '', '', '')
    expect(result).not.toContain('ORG')
  })

  it('inclui endereço quando fornecido', () => {
    const result = buildVCard('Ana', '', '', '', 'Rua das Flores, 42')
    expect(result).toContain('ADR:;;Rua das Flores, 42')
  })

  it('omite linha de endereço quando vazio', () => {
    const result = buildVCard('Ana', '', '', '', '')
    expect(result).not.toContain('ADR')
  })

  it('separa cada campo com quebra de linha', () => {
    const result = buildVCard('Ana', '', '', '', '')
    const lines = result.split('\n')
    expect(lines[0]).toBe('BEGIN:VCARD')
    expect(lines[lines.length - 1]).toBe('END:VCARD')
  })

  it('inclui todos os campos opcionais quando todos fornecidos', () => {
    const result = buildVCard('Ana', '11999990000', 'ana@email.com', 'ACME', 'Rua A')
    expect(result).toContain('TEL')
    expect(result).toContain('EMAIL')
    expect(result).toContain('ORG')
    expect(result).toContain('ADR')
  })
})
