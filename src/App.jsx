import { useState, useRef, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const qrRef = useRef(null)
  const canvasRef = useRef(null)

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
    }
  }

  const handleDownload = () => {
    if (canvasRef.current) {
      const url = canvasRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = url
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
      handleGenerate()
    }
  }

  return (
    <div className="container">
      <h1>Gerador de QR Code</h1>
      <p className="subtitle">Crie QR Codes para seus links de forma rápida e fácil</p>

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
          <p className="generated-url">QR Code para: {generatedUrl}</p>
          <button onClick={handleDownload} className="download-btn">
            Baixar QR Code
          </button>
        </div>
      )}
    </div>
  )
}

export default App
