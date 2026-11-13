"use client";

import { useState } from "react";

export function CopyCnpj({ cnpj }: { cnpj: string }) {
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(cnpj);
      setMessage("CNPJ copiado.");
    } catch {
      setMessage("Não foi possível copiar. Selecione o número para copiá-lo.");
    }
  }
  return (
    <>
      <button className="copy-cnpj" type="button" onClick={copy} aria-label={`Copiar CNPJ ${cnpj}`} title="Clique para copiar">CNPJ {cnpj}</button>
      <span className="copy-cnpj-status" role="status">{message}</span>
    </>
  );
}
