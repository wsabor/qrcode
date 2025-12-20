import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const qrRef = useRef(null)

  const handleGenerate = () => {
    if (url.trim()) {
      setGeneratedUrl(url)
    }
  }

  const handleDownload = () => {
    const canvas = qrRef.current.querySelector('canvas')
    if (canvas) {
      const url = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'qrcode.png'
      link.href = url
      link.click()
    }
  }

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

      {generatedUrl && (
        <div className="qr-section">
          <div className="qr-container" ref={qrRef}>
            <QRCodeCanvas
              value={generatedUrl}
              size={1024}
              level="H"
              marginSize={4}
            />
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
