"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Image,
  TableIcon,
  Save,
  FileDown,
  Home,
  ChevronDown,
  Type,
  Palette,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Undo,
  Redo,
  Download,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import dynamic from "next/dynamic"

export default function WriterPage() {
  const [documentTitle, setDocumentTitle] = useState("Documento sem título")
  const editorRef = useRef(null)

  // Adicionar novos estados para controlar as visualizações
  const [viewMode, setViewMode] = useState("normal") // normal, print, outline
  const [zoomLevel, setZoomLevel] = useState(100) // porcentagem de zoom
  const SomeComponent = dynamic(() => import('some-library'), {
    ssr: false, // Desabilita a renderização no lado do servidor
  });
  // Font options
  const fonts = [
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Times New Roman", value: "Times New Roman, serif" },
    { name: "Courier New", value: "Courier New, monospace" },
    { name: "Georgia", value: "Georgia, serif" },
    { name: "Verdana", value: "Verdana, sans-serif" },
    { name: "Tahoma", value: "Tahoma, sans-serif" },
  ]

  // Font sizes
  const fontSizes = [
    { name: "8pt", value: "8pt" },
    { name: "10pt", value: "10pt" },
    { name: "12pt", value: "12pt" },
    { name: "14pt", value: "14pt" },
    { name: "16pt", value: "16pt" },
    { name: "18pt", value: "18pt" },
    { name: "20pt", value: "20pt" },
    { name: "24pt", value: "24pt" },
    { name: "36pt", value: "36pt" },
  ]

  // Text colors
  const textColors = [
    { name: "Preto", value: "#000000" },
    { name: "Vermelho", value: "#FF0000" },
    { name: "Azul", value: "#0000FF" },
    { name: "Verde", value: "#008000" },
    { name: "Roxo", value: "#800080" },
    { name: "Laranja", value: "#FFA500" },
    { name: "Cinza", value: "#808080" },
  ]

  // Background colors
  const bgColors = [
    { name: "Nenhum", value: "transparent" },
    { name: "Amarelo", value: "#FFFF00" },
    { name: "Ciano", value: "#00FFFF" },
    { name: "Lima", value: "#00FF00" },
    { name: "Rosa", value: "#FFC0CB" },
    { name: "Cinza Claro", value: "#D3D3D3" },
  ]

  // Execute document commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editorRef.current.focus()
  }

  // Check if a format is active
  const isFormatActive = (format) => {
    return document.queryCommandState(format)
  }

  // Insert table
  const insertTable = () => {
    const rows = 3
    const cols = 3
    let table = '<table style="width:100%; border-collapse: collapse;">'

    for (let i = 0; i < rows; i++) {
      table += "<tr>"
      for (let j = 0; j < cols; j++) {
        table += '<td style="border: 1px solid #ccc; padding: 8px; min-width: 50px; min-height: 20px;"></td>'
      }
      table += "</tr>"
    }

    table += "</table><p></p>"
    document.execCommand("insertHTML", false, table)
  }

  // Insert image
  const insertImage = () => {
    const url = prompt("Digite a URL da imagem:")
    if (url) {
      document.execCommand("insertImage", false, url)
    }
  }

  // Modificar a função applyHeading para garantir que funcione corretamente
  const applyHeading = (level) => {
    document.execCommand("formatBlock", false, level)
    editorRef.current.focus()
  }

  // Adicionar função para alterar o modo de visualização
  const changeViewMode = (mode) => {
    setViewMode(mode)
  }

  // Adicionar função para alterar o nível de zoom
  const changeZoom = (level) => {
    setZoomLevel(level)
  }

  // Save document
  const saveDocument = () => {
    const content = editorRef.current.innerHTML
    localStorage.setItem("calmWriterContent", content)
    localStorage.setItem("calmWriterTitle", documentTitle)
    alert("Documento salvo!")
  }

  // Download as TXT
  const downloadAsTxt = () => {
    // Obter o texto completo, incluindo quebras de linha
    const content = editorRef.current.innerText
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentTitle}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download as PDF
  const downloadAsPdf = async () => {
    const content = editorRef.current

    // Configurar opções para melhor qualidade e captura completa
    const canvas = await html2canvas(content, {
      scale: 2, // Melhor qualidade
      useCORS: true, // Permitir imagens de outros domínios
      logging: false,
      onclone: (clonedDoc) => {
        // Garantir que o clone tenha o mesmo estilo do original
        const clonedContent = clonedDoc.querySelector(".editor-content")
        if (clonedContent) {
          clonedContent.style.width = `${content.offsetWidth}px`
          clonedContent.style.height = "auto" // Altura automática para capturar todo o conteúdo
        }
      },
    })

    const imgData = canvas.toDataURL("image/jpeg", 1.0)

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Calcular a altura proporcional para manter a proporção da imagem
    const imgWidth = pdfWidth
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width

    // Se o conteúdo for maior que uma página, dividir em múltiplas páginas
    let heightLeft = imgHeight
    let position = 0
    let page = 1

    // Adicionar a primeira página
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight

    // Adicionar páginas adicionais se necessário
    while (heightLeft > 0) {
      position = -pdfHeight * page
      pdf.addPage()
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight
      page++
    }

    pdf.save(`${documentTitle}.pdf`)
  }

  // Download as HTML
  const downloadAsHtml = () => {
    // Incluir estilos inline para garantir que o documento seja renderizado corretamente
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${documentTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          img { max-width: 100%; height: auto; }
          h1, h2, h3 { margin-top: 20px; margin-bottom: 10px; }
          ul, ol { margin-bottom: 20px; padding-left: 20px; }
        </style>
      </head>
      <body>
        ${editorRef.current.innerHTML}
      </body>
      </html>
    `

    const blob = new Blob([content], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentTitle}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download as DOCX (simulated with HTML)
  const downloadAsDocx = () => {
    // Na prática, precisaríamos de uma biblioteca como docx-js
    // Aqui estamos melhorando a simulação com HTML mais completo
    const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${documentTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        img { max-width: 100%; height: auto; }
        h1, h2, h3 { margin-top: 20px; margin-bottom: 10px; }
        ul, ol { margin-bottom: 20px; padding-left: 20px; }
      </style>
    </head>
    <body>
      ${editorRef.current.innerHTML}
    </body>
    </html>
  `

    const blob = new Blob([content], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${documentTitle}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Load saved content
  useEffect(() => {
    const savedContent = localStorage.getItem("calmWriterContent")
    const savedTitle = localStorage.getItem("calmWriterTitle")

    if (savedContent && editorRef.current) {
      editorRef.current.innerHTML = savedContent
    }

    if (savedTitle) {
      setDocumentTitle(savedTitle)
    }
  }, [])

  // Adicionar estilos CSS para impressão
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .editor-content, .editor-content * {
          visibility: visible;
        }
        .editor-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 2cm;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">Início</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">Calm</span>
              <span className="rounded-md bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">Writer</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-slate-700"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={saveDocument}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={downloadAsTxt}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar como TXT
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadAsHtml}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar como HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadAsDocx}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar como DOCX
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadAsPdf}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar como PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        <Tabs defaultValue="home">
          <TabsList className="mb-4">
            <TabsTrigger value="home">Início</TabsTrigger>
            <TabsTrigger value="insert">Inserir</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
            <TabsTrigger value="view">Visualizar</TabsTrigger>
          </TabsList>

          <TabsContent
            value="home"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <div className="flex items-center gap-2 mr-4">
              <Button
                variant={isFormatActive("bold") ? "default" : "outline"}
                size="sm"
                onClick={() => execCommand("bold")}
                title="Negrito"
              >
                <Bold className="h-4 w-4" />
                <span className="sr-only">Negrito</span>
              </Button>
              <Button
                variant={isFormatActive("italic") ? "default" : "outline"}
                size="sm"
                onClick={() => execCommand("italic")}
                title="Itálico"
              >
                <Italic className="h-4 w-4" />
                <span className="sr-only">Itálico</span>
              </Button>
              <Button
                variant={isFormatActive("underline") ? "default" : "outline"}
                size="sm"
                onClick={() => execCommand("underline")}
                title="Sublinhado"
              >
                <Underline className="h-4 w-4" />
                <span className="sr-only">Sublinhado</span>
              </Button>
            </div>

            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center gap-2 mr-4">
              <Button variant="outline" size="sm" onClick={() => execCommand("justifyLeft")} title="Alinhar à esquerda">
                <AlignLeft className="h-4 w-4" />
                <span className="sr-only">Alinhar à esquerda</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("justifyCenter")} title="Centralizar">
                <AlignCenter className="h-4 w-4" />
                <span className="sr-only">Centralizar</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("justifyRight")} title="Alinhar à direita">
                <AlignRight className="h-4 w-4" />
                <span className="sr-only">Alinhar à direita</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("justifyFull")} title="Justificar">
                <AlignJustify className="h-4 w-4" />
                <span className="sr-only">Justificar</span>
              </Button>
            </div>

            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center gap-2 mr-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => execCommand("insertUnorderedList")}
                title="Lista com marcadores"
              >
                <List className="h-4 w-4" />
                <span className="sr-only">Lista com marcadores</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => execCommand("insertOrderedList")}
                title="Lista numerada"
              >
                <ListOrdered className="h-4 w-4" />
                <span className="sr-only">Lista numerada</span>
              </Button>
            </div>

            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center gap-2">
              <Select onValueChange={(value) => execCommand("fontName", value)}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Fonte" />
                </SelectTrigger>
                <SelectContent>
                  {fonts.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => execCommand("fontSize", value)}>
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue placeholder="Tamanho" />
                </SelectTrigger>
                <SelectContent>
                  {fontSizes.map((size, index) => (
                    <SelectItem key={size.value} value={String(index + 1)}>
                      {size.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Palette className="h-4 w-4 mr-1" />
                    Cor do Texto
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid grid-cols-4 gap-2">
                    {textColors.map((color) => (
                      <button
                        key={color.value}
                        className="h-8 w-8 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        style={{ backgroundColor: color.value }}
                        onClick={() => execCommand("foreColor", color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Palette className="h-4 w-4 mr-1" />
                    Realce
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid grid-cols-4 gap-2">
                    {bgColors.map((color) => (
                      <button
                        key={color.value}
                        className="h-8 w-8 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
                        style={{ backgroundColor: color.value }}
                        onClick={() => execCommand("backColor", color.value)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => execCommand("undo")} title="Desfazer">
                <Undo className="h-4 w-4" />
                <span className="sr-only">Desfazer</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("redo")} title="Refazer">
                <Redo className="h-4 w-4" />
                <span className="sr-only">Refazer</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent
            value="insert"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Button variant="outline" size="sm" onClick={insertImage}>
              <Image className="mr-2 h-4 w-4" />
              Imagem
            </Button>
            <Button variant="outline" size="sm" onClick={insertTable}>
              <TableIcon className="mr-2 h-4 w-4" />
              Tabela
            </Button>
            <Button variant="outline" size="sm" onClick={() => execCommand("insertHorizontalRule")}>
              <Minus className="mr-2 h-4 w-4" />
              Linha Horizontal
            </Button>
          </TabsContent>

          <TabsContent
            value="layout"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Type className="mr-2 h-4 w-4" />
                  Títulos
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => applyHeading("h1")}>
                  <Heading1 className="mr-2 h-4 w-4" />
                  Título 1
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyHeading("h2")}>
                  <Heading2 className="mr-2 h-4 w-4" />
                  Título 2
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => applyHeading("h3")}>
                  <Heading3 className="mr-2 h-4 w-4" />
                  Título 3
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => applyHeading("p")}>Texto Normal</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => execCommand("indent")}>
              Aumentar Recuo
            </Button>
            <Button variant="outline" size="sm" onClick={() => execCommand("outdent")}>
              Diminuir Recuo
            </Button>
            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>
            <Button variant="outline" size="sm" onClick={() => execCommand("justifyLeft")}>
              Alinhar à Esquerda
            </Button>
            <Button variant="outline" size="sm" onClick={() => execCommand("justifyCenter")}>
              Centralizar
            </Button>
            <Button variant="outline" size="sm" onClick={() => execCommand("justifyRight")}>
              Alinhar à Direita
            </Button>
            <Button variant="outline" size="sm" onClick={() => execCommand("justifyFull")}>
              Justificar
            </Button>
            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>
            <Select onValueChange={(value) => execCommand("lineHeight", value)}>
              <SelectTrigger className="w-[180px] h-8">
                <SelectValue placeholder="Espaçamento de Linha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Simples</SelectItem>
                <SelectItem value="1.5">1.5</SelectItem>
                <SelectItem value="2">Duplo</SelectItem>
                <SelectItem value="2.5">2.5</SelectItem>
              </SelectContent>
            </Select>
          </TabsContent>

          <TabsContent
            value="view"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Button
              variant={viewMode === "print" ? "default" : "outline"}
              size="sm"
              onClick={() => changeViewMode("print")}
            >
              Layout de Impressão
            </Button>
            <Button
              variant={viewMode === "outline" ? "default" : "outline"}
              size="sm"
              onClick={() => changeViewMode("outline")}
            >
              Estrutura de Tópicos
            </Button>
            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Zoom ({zoomLevel}%)
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => changeZoom(50)}>50%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeZoom(75)}>75%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeZoom(100)}>100%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeZoom(125)}>125%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeZoom(150)}>150%</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeZoom(200)}>200%</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              Imprimir
            </Button>
          </TabsContent>
        </Tabs>

        <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div
            ref={editorRef}
            className={`editor-content min-h-[70vh] outline-none ${
              viewMode === "print"
                ? "bg-white p-8 shadow-md mx-auto"
                : viewMode === "outline"
                  ? "border-l-4 border-blue-200 pl-4"
                  : ""
            }`}
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "top left",
              width: zoomLevel > 100 ? `${(100 * 100) / zoomLevel}%` : "100%",
              padding: viewMode === "outline" ? "0 0 0 20px" : "",
            }}
            contentEditable={true}
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{
              __html: `
                <h1 style="margin-bottom: 1rem; font-size: 1.5rem; font-weight: bold;">Bem-vindo ao CalmWriter</h1>
                <p style="margin-bottom: 1rem;">Comece a digitar seu documento aqui. Você pode formatar texto, adicionar imagens, criar tabelas e muito mais usando a barra de ferramentas acima.</p>
                <p style="margin-bottom: 1rem;">O CalmWriter oferece um ambiente limpo e sem distrações para suas necessidades de escrita. Seja redigindo um relatório, escrevendo um ensaio ou criando uma carta, nossa interface intuitiva facilita o processo.</p>
                <h2 style="margin-top: 1.5rem; margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: bold;">Recursos:</h2>
                <ul style="margin-bottom: 1rem; margin-left: 1.5rem; list-style-type: disc;">
                  <li style="margin-bottom: 0.5rem;">Formatação de texto avançada</li>
                  <li style="margin-bottom: 0.5rem;">Inserção de imagens</li>
                  <li style="margin-bottom: 0.5rem;">Criação de tabelas</li>
                  <li style="margin-bottom: 0.5rem;">Exportação para DOCX, PDF, HTML e TXT</li>
                  <li style="margin-bottom: 0.5rem;">Funcionalidade de salvamento automático</li>
                </ul>
                <p style="margin-bottom: 1rem;">Experimente mudar a <span style="color: blue;">cor</span> do texto, <span style="background-color: yellow;">destacar</span> palavras importantes ou criar <strong>texto em negrito</strong> e <em>itálico</em>.</p>
              `,
            }}
          />
        </div>
      </div>
    </div>
  )
}

