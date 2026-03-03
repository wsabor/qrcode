function buildField(id, value) {
  const size = String(value.length).padStart(2, '0')
  return `${id}${size}${value}`
}

function crc16(str) {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021
      } else {
        crc <<= 1
      }
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
}

export function buildPixPayload({ chave, nome, cidade, valor, descricao }) {
  let mai = buildField('00', 'BR.GOV.BCB.PIX')
  mai += buildField('01', chave.trim())
  if (descricao?.trim()) {
    mai += buildField('02', descricao.trim().substring(0, 72))
  }

  const additionalData = buildField('05', '***')

  let payload = ''
  payload += buildField('00', '01')
  payload += buildField('26', mai)
  payload += buildField('52', '0000')
  payload += buildField('53', '986')

  if (valor && parseFloat(valor) > 0) {
    payload += buildField('54', parseFloat(valor).toFixed(2))
  }

  payload += buildField('58', 'BR')
  payload += buildField('59', nome.trim().substring(0, 25))
  payload += buildField('60', cidade.trim().substring(0, 15))
  payload += buildField('62', additionalData)
  payload += '6304'
  payload += crc16(payload)

  return payload
}
