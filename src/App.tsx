import { useEffect } from "react";
import GS1QRGenerator from "./components/GS1QRGenerator";
import "./App.css";
import logo from "./logo.jpg";

function App() {
  useEffect(() => {
    // Set the favicon dynamically
    const link =
      (document.querySelector("link[rel~='icon']") as HTMLLinkElement) ||
      document.createElement("link");
    link.type = "image/jpeg";
    link.rel = "icon";
    link.href = logo;
    document.head.appendChild(link);

    // Set the document title
    document.title = "Bahgat MDCN QR Generator";
  }, []);

  return (
    <div className="App">
      <GS1QRGenerator />
    </div>
  );
}

export default App;
