import { useState, useRef, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { buildPixPayload } from './pixPayload'
import './App.css'

function App() {
  const [mode, setMode] = useState('url')
  const [url, setUrl] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [generatedLabel, setGeneratedLabel] = useState('')
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)

  const [pixChave, setPixChave] = useState('')
  const [pixNome, setPixNome] = useState('')
  const [pixCidade, setPixCidade] = useState('')
  const [pixValor, setPixValor] = useState('')
  const [pixDescricao, setPixDescricao] = useState('')

  const qrRef = useRef(null)
  const canvasRef = useRef(null)

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setGeneratedUrl('')
    setGeneratedLabel('')
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo(event.target.result)
        setLogoPreview(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogo(null)
    setLogoPreview(null)
  }

  const handleGenerate = () => {
    if (url.trim()) {
      setGeneratedUrl(url)
      setGeneratedLabel(`QR Code para: ${url}`)
    }
  }

  const handleGeneratePix = () => {
    if (pixChave.trim() && pixNome.trim() && pixCidade.trim()) {
      const payload = buildPixPayload({
        chave: pixChave,
        nome: pixNome,
        cidade: pixCidade,
        valor: pixValor,
        descricao: pixDescricao,
      })
      setGeneratedUrl(payload)
      const valorStr =
        pixValor && parseFloat(pixValor) > 0
          ? ` — R$ ${parseFloat(pixValor).toFixed(2).replace('.', ',')}`
          : ''
      setGeneratedLabel(`PIX: ${pixNome.trim()}${valorStr}`)
    }
  }

  const handleDownload = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = mode === 'pix' ? 'qrcode-pix.png' : 'qrcode.png'
      link.href = dataUrl
      link.click()
    }
  }

  useEffect(() => {
    if (!generatedUrl) return

    const drawQRCodeWithLogo = () => {
      const qrCanvas = qrRef.current?.querySelector('canvas')
      if (!qrCanvas || !canvasRef.current) return

      const finalCanvas = canvasRef.current
      const ctx = finalCanvas.getContext('2d')

      finalCanvas.width = qrCanvas.width
      finalCanvas.height = qrCanvas.height

      ctx.drawImage(qrCanvas, 0, 0)

      if (logo) {
        const logoImg = new Image()
        logoImg.onload = () => {
          const logoSize = qrCanvas.width * 0.2
          const x = (qrCanvas.width - logoSize) / 2
          const y = (qrCanvas.height - logoSize) / 2

          ctx.fillStyle = 'white'
          ctx.fillRect(x - 10, y - 10, logoSize + 20, logoSize + 20)

          ctx.drawImage(logoImg, x, y, logoSize, logoSize)
        }
        logoImg.src = logo
      }
    }

    setTimeout(() => drawQRCodeWithLogo(), 100)
  }, [generatedUrl, logo])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      mode === 'url' ? handleGenerate() : handleGeneratePix()
    }
  }

  const pixValid = pixChave.trim() && pixNome.trim() && pixCidade.trim()

  return (
    <div className="container">
      <h1>Gerador de QR Code</h1>
      <p className="subtitle">Crie QR Codes para seus links de forma rápida e fácil</p>

      <div className="mode-tabs">
        <button
          className={`tab${mode === 'url' ? ' active' : ''}`}
          onClick={() => handleModeChange('url')}
        >
          Link / URL
        </button>
        <button
          className={`tab${mode === 'pix' ? ' active pix-active' : ''}`}
          onClick={() => handleModeChange('pix')}
        >
          Pagamento PIX
        </button>
      </div>

      {mode === 'url' && (
        <div className="input-section">
          <input
            type="text"
            placeholder="Digite o endereço do site (ex: https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="url-input"
          />
          <button onClick={handleGenerate} className="generate-btn">
            Gerar QR Code
          </button>
        </div>
      )}

      {mode === 'pix' && (
        <div className="pix-form">
          <input
            type="text"
            placeholder="Chave PIX (CPF, CNPJ, e-mail, telefone ou chave aleatória)"
            value={pixChave}
            onChange={(e) => setPixChave(e.target.value)}
            onKeyDown={handleKeyDown}
            className="url-input"
          />
          <div className="pix-row">
            <input
              type="text"
              placeholder="Nome do Recebedor"
              value={pixNome}
              onChange={(e) => setPixNome(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={25}
              className="url-input"
            />
            <input
              type="text"
              placeholder="Cidade"
              value={pixCidade}
              onChange={(e) => setPixCidade(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={15}
              className="url-input"
            />
          </div>
          <input
            type="number"
            placeholder="Valor em R$ (opcional)"
            value={pixValor}
            onChange={(e) => setPixValor(e.target.value)}
            onKeyDown={handleKeyDown}
            min="0"
            step="0.01"
            className="url-input"
          />
          <input
            type="text"
            placeholder="Descrição (opcional)"
            value={pixDescricao}
            onChange={(e) => setPixDescricao(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={72}
            className="url-input"
          />
          <button
            onClick={handleGeneratePix}
            className="generate-btn pix-btn"
            disabled={!pixValid}
          >
            Gerar QR Code PIX
          </button>
        </div>
      )}

      <div className="logo-section">
        <label className="logo-label">
          Adicionar Logo (opcional)
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="logo-input"
          />
        </label>
        {logoPreview && (
          <div className="logo-preview">
            <img src={logoPreview} alt="Logo preview" />
            <button onClick={handleRemoveLogo} className="remove-logo-btn">
              Remover Logo
            </button>
          </div>
        )}
      </div>

      {generatedUrl && (
        <div className="qr-section">
          <div className="qr-container" ref={qrRef} style={{ display: 'none' }}>
            <QRCodeCanvas
              value={generatedUrl}
              size={1024}
              level="H"
              marginSize={4}
            />
          </div>
          <div className="qr-display">
            <canvas ref={canvasRef} />
          </div>
          <p className="generated-url">{generatedLabel}</p>
          <button onClick={handleDownload} className="download-btn">
            Baixar QR Code
          </button>
        </div>
      )}
    </div>
  )
}

export default App
