import React, { useState, useEffect } from "react";
import { QRCodeSVG as QRCode } from "qrcode.react";

const GS1QRGenerator: React.FC = () => {
  const [gtin, setGtin] = useState("");
  const [showInput, setShowInput] = useState(true);
  const [batchNumber, setBatchNumber] = useState("");
  const [expirationDate] = useState("231231");
  const [serialNumber, setSerialNumber] = useState("");

  // Generate random batch number
  const generateBatchNumber = () => {
    return `BATCH${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  };

  // Generate random serial number
  const generateSerialNumber = () => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${randomStr}${timestamp}`;
  };

  // Validate GTIN input (6 digits)
  const validateGtin = (input: string) => {
    const regex = /^\d{0,6}$/;
    if (regex.test(input)) {
      setGtin(input);
      if (input.length === 6) {
        setShowInput(false);
      }
    }
  };

  // Generate GS1 data string
  const generateGS1Data = () => {
    return `01${gtin.padStart(
      6,
      "0"
    )}10${batchNumber}17${expirationDate}21${serialNumber}`;
  };

  // Auto-update serial number every 0.2 seconds when QR is showing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!showInput && gtin.length === 6) {
      interval = setInterval(() => {
        setSerialNumber(generateSerialNumber());
        setBatchNumber(generateBatchNumber());
      }, 200);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [showInput, gtin]);

  // Initialize serial number and batch number
  useEffect(() => {
    setBatchNumber(generateBatchNumber());
    setSerialNumber(generateSerialNumber());
  }, []);

  return (
    <div className="gs1-container">
      {showInput ? (
        <div className="input-container">
          <h1
            style={{
              color: "#e7ff4b",
              marginBottom: "20px",
              fontSize: "1.5rem",
            }}
          >
            Bahgat MDCN QR Generator
          </h1>
          <div className="input-group">
            <label className="input-label">Enter your code</label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              value={gtin}
              onChange={(e) => validateGtin(e.target.value)}
              maxLength={6}
            />
          </div>
          <div className="wave-background" />
        </div>
      ) : (
        <div className="qr-container">
          <QRCode
            value={generateGS1Data()}
            size={256}
            level="H"
            style={{ width: "70%", height: "auto" }}
            imageSettings={{
              src: "",
              height: 24,
              width: 24,
              excavate: true,
            }}
          />
          <p
            style={{ color: "#e7ff4b", marginTop: "10px", fontSize: "0.8rem" }}
          >
            Bahgat MDCN QR Code
          </p>
          <button
            onClick={() => {
              setShowInput(true);
              setGtin("");
            }}
          >
            <span>Enter New Code</span>
          </button>
          <div className="wave-background" />
        </div>
      )}
    </div>
  );
};

export default GS1QRGenerator;
