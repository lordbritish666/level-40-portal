"use client"
import { useEffect, useRef } from "react"
import QRCode from "qrcode"

export default function QRCodeCanvas({ url, size = 200 }: { url: string; size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    QRCode.toCanvas(ref.current, url, {
      width: size,
      margin: 2,
      color: {
        dark: "#0d0d2b",
        light: "#ffd700",
      },
      errorCorrectionLevel: "H",
    })
  }, [url, size])

  return <canvas ref={ref} style={{ imageRendering: "pixelated" }} />
}
