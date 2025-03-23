"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  Plus,
  Image,
  ChevronDown,
  Play,
  Save,
  FileDown,
  Layout,
  Square,
  Circle,
  ArrowLeft,
  ArrowRight,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Trash,
  Copy,
  Download,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

export default function SlidesPage() {
  const [presentationTitle, setPresentationTitle] = useState("Apresentação sem título")
  const [currentSlide, setCurrentSlide] = useState(0)
  // Garantir que o estado inicial dos slides tenha todos os campos necessários
  const [slides, setSlides] = useState([
    {
      id: 0,
      title: "Bem-vindo ao CalmSlides",
      subtitle: "Clique para adicionar subtítulo",
      content: "",
      type: "title",
      backgroundColor: "#FFFFFF",
    },
    {
      id: 1,
      title: "Slide de Conteúdo",
      content:
        "<ul><li>Clique para adicionar pontos</li><li>Crie apresentações bonitas</li><li>Exporte para PDF</li></ul>",
      type: "content",
      backgroundColor: "#FFFFFF",
    },
    {
      id: 2,
      title: "Slide de Imagem",
      content: "Descrição da imagem",
      imageUrl: "",
      type: "image",
      backgroundColor: "#FFFFFF",
    },
  ])

  const slideContentRef = useRef(null)
  const slideTitleRef = useRef(null)
  const presentationRef = useRef(null)

  // Melhorar a funcionalidade de apresentação de slides
  // Adicionar a referência para o slide atual
  const currentSlideRef = useRef(null)

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

  // Background colors for slides
  const slideBackgrounds = [
    { name: "Branco", value: "#FFFFFF" },
    { name: "Azul Claro", value: "#E6F7FF" },
    { name: "Verde Claro", value: "#E6FFEA" },
    { name: "Roxo Claro", value: "#F2E6FF" },
    { name: "Amarelo Claro", value: "#FFFDE6" },
    { name: "Cinza Claro", value: "#F0F0F0" },
  ]

  // Execute document commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    if (document.activeElement === slideTitleRef.current || document.activeElement === slideContentRef.current) {
      document.activeElement.focus()
    }
  }

  // Add a new slide
  const addSlide = (type = "content") => {
    const newSlide = {
      id: slides.length,
      title: "Novo Slide",
      content: type === "content" ? "<ul><li>Clique para adicionar conteúdo</li></ul>" : "Adicione uma descrição aqui",
      type: type,
      subtitle: type === "title" ? "Clique para adicionar subtítulo" : "",
      backgroundColor: "#FFFFFF",
      imageUrl: type === "image" ? "" : undefined,
    }

    setSlides([...slides, newSlide])
    setCurrentSlide(slides.length)
  }

  // Delete current slide
  const deleteSlide = () => {
    if (slides.length <= 1) return // Don't delete the last slide

    const newSlides = slides.filter((_, index) => index !== currentSlide)
    setSlides(newSlides)
    setCurrentSlide(Math.min(currentSlide, newSlides.length - 1))
  }

  // Duplicate current slide
  const duplicateSlide = () => {
    const currentSlideData = slides[currentSlide]
    const newSlide = { ...currentSlideData, id: slides.length }
    const newSlides = [...slides]
    newSlides.splice(currentSlide + 1, 0, newSlide)
    setSlides(newSlides)
    setCurrentSlide(currentSlide + 1)
  }

  // Change slide layout
  const changeSlideLayout = (type) => {
    const newSlides = [...slides]
    newSlides[currentSlide].type = type
    setSlides(newSlides)
  }

  // Insert image in current slide
  const insertImage = () => {
    const url = prompt("Digite a URL da imagem:")
    if (url) {
      const newSlides = [...slides]
      newSlides[currentSlide].imageUrl = url
      newSlides[currentSlide].type = "image"
      setSlides(newSlides)
    }
  }

  // Change slide background
  const changeSlideBackground = (color) => {
    const newSlides = [...slides]
    newSlides[currentSlide].backgroundColor = color
    setSlides(newSlides)
  }

  // Update slide title
  const updateSlideTitle = (e) => {
    const newSlides = [...slides]
    newSlides[currentSlide].title = e.target.innerHTML || ""
    setSlides(newSlides)
  }

  // Update slide content
  const updateSlideContent = (e) => {
    const newSlides = [...slides]
    newSlides[currentSlide].content = e.target.innerHTML || ""
    setSlides(newSlides)
  }

  // Save presentation
  const savePresentation = () => {
    localStorage.setItem("calmSlidesData", JSON.stringify(slides))
    localStorage.setItem("calmSlidesTitle", presentationTitle)
    alert("Apresentação salva!")
  }

  // Modificar a função presentSlides para abrir uma janela de apresentação mais robusta
  const presentSlides = () => {
    // Criar uma cópia dos slides para a apresentação
    const presentationSlides = JSON.parse(JSON.stringify(slides))

    // Abrir em uma nova janela em modo de apresentação
    const presentationWindow = window.open("", "_blank", "fullscreen=yes")

    if (!presentationWindow) {
      alert("Não foi possível abrir o modo de apresentação. Verifique se os pop-ups estão permitidos.")
      return
    }

    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${presentationTitle}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            background-color: #000;
            color: #fff;
          }
          .slide { 
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100vw; 
            height: 100vh; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            text-align: center; 
            padding: 2rem; 
            box-sizing: border-box; 
            opacity: 0; 
            transition: opacity 0.5s;
            z-index: 1;
          }
          .active { 
            opacity: 1; 
            z-index: 2;
          }
          h1 { font-size: 3.5rem; margin-bottom: 1.5rem; }
          h2 { font-size: 3rem; margin-bottom: 1.5rem; }
          ul { text-align: left; font-size: 2rem; }
          li { margin-bottom: 1.5rem; }
          img { max-width: 80%; max-height: 60%; object-fit: contain; }
          .controls { 
            position: fixed; 
            bottom: 1rem; 
            right: 1rem; 
            display: flex; 
            gap: 0.5rem; 
            z-index: 10;
            opacity: 0.3;
            transition: opacity 0.3s;
          }
          .controls:hover {
            opacity: 1;
          }
          .slide-counter {
            position: fixed;
            bottom: 1rem;
            left: 1rem;
            color: rgba(255,255,255,0.5);
            font-size: 14px;
            z-index: 10;
          }
          button { 
            background: rgba(0,0,0,0.5); 
            color: white; 
            border: none; 
            padding: 0.5rem 1rem; 
            border-radius: 4px; 
            cursor: pointer; 
          }
          button:hover {
            background: rgba(0,0,0,0.8);
          }
        </style>
      </head>
      <body>
    `

    presentationSlides.forEach((slide, index) => {
      content += `<div id="slide-${index}" class="slide ${index === 0 ? "active" : ""}" style="background-color: ${slide.backgroundColor || "#1a1a1a"};">`

      if (slide.type === "title") {
        content += `
      <h1>${slide.title || "Título"}</h1>
      <p style="font-size: 2rem;">${slide.subtitle || ""}</p>
    `
      } else if (slide.type === "content") {
        content += `
      <h2>${slide.title || "Slide de Conteúdo"}</h2>
      <div style="font-size: 2rem; width: 100%; max-width: 800px;">${slide.content || ""}</div>
    `
      } else if (slide.type === "image") {
        content += `
      <h2>${slide.title || "Slide de Imagem"}</h2>
      ${slide.imageUrl ? `<img src="${slide.imageUrl}" alt="Slide image">` : ""}
      <p style="font-size: 1.5rem; margin-top: 1rem;">${slide.content || ""}</p>
    `
      }

      content += `</div>`
    })

    content += `
      <div class="slide-counter" id="slide-counter">Slide 1 de ${presentationSlides.length}</div>
      <div class="controls">
        <button id="prev">Anterior</button>
        <button id="next">Próximo</button>
        <button id="exit">Sair</button>
      </div>
      
      <script>
        let currentSlide = 0;
        const totalSlides = ${presentationSlides.length};
        const slideCounter = document.getElementById('slide-counter');
        
        function showSlide(index) {
          document.querySelectorAll('.slide').forEach(slide => slide.classList.remove('active'));
          document.getElementById('slide-' + index).classList.add('active');
          currentSlide = index;
          slideCounter.textContent = 'Slide ' + (currentSlide + 1) + ' de ' + totalSlides;
        }
        
        document.getElementById('prev').addEventListener('click', () => {
          if (currentSlide > 0) {
            showSlide(currentSlide - 1);
          }
        });
        
        document.getElementById('next').addEventListener('click', () => {
          if (currentSlide < totalSlides - 1) {
            showSlide(currentSlide + 1);
          }
        });
        
        document.getElementById('exit').addEventListener('click', () => {
          window.close();
        });
        
        // Adicionar controles de teclado
        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            if (currentSlide < totalSlides - 1) {
              showSlide(currentSlide + 1);
            }
          } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            if (currentSlide > 0) {
              showSlide(currentSlide - 1);
            }
          } else if (e.key === 'Escape') {
            window.close();
          } else if (e.key === 'Home') {
            showSlide(0);
          } else if (e.key === 'End') {
            showSlide(totalSlides - 1);
          }
        });
        
        // Ocultar o cursor após 3 segundos de inatividade
        let cursorTimeout;
        function hideCursor() {
          document.body.style.cursor = 'none';
          document.querySelector('.controls').style.opacity = '0';
        }
        
        function showCursor() {
          document.body.style.cursor = 'default';
          document.querySelector('.controls').style.opacity = '0.3';
          clearTimeout(cursorTimeout);
          cursorTimeout = setTimeout(hideCursor, 3000);
        }
        
        document.addEventListener('mousemove', showCursor);
        cursorTimeout = setTimeout(hideCursor, 3000);
      </script>
      </body>
      </html>
    `

    presentationWindow.document.write(content)
    presentationWindow.document.close()
  }

  // Download as PDF
  // Melhorar a função de download de PDF para capturar todos os slides corretamente
  const downloadAsPdf = async () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    // Salvar o slide atual para restaurar depois
    const originalSlide = currentSlide

    try {
      // Para cada slide
      for (let i = 0; i < slides.length; i++) {
        // Mudar para o slide atual
        setCurrentSlide(i)

        // Esperar a renderização completa
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Capturar o slide
        const slideElement = document.getElementById("current-slide")
        if (slideElement) {
          const canvas = await html2canvas(slideElement, {
            scale: 2, // Melhor qualidade
            useCORS: true, // Permitir imagens de outros domínios
            logging: false,
            backgroundColor: slides[i].backgroundColor || "#FFFFFF",
            onclone: (clonedDoc) => {
              // Garantir que o clone tenha o mesmo estilo do original
              const clonedSlide = clonedDoc.getElementById("current-slide")
              if (clonedSlide) {
                clonedSlide.style.width = `${slideElement.offsetWidth}px`
                clonedSlide.style.height = `${slideElement.offsetHeight}px`
                clonedSlide.style.overflow = "visible"
              }
            },
          })

          const imgData = canvas.toDataURL("image/jpeg", 1.0)

          // Adicionar ao PDF (adicionar nova página após a primeira)
          if (i > 0) {
            pdf.addPage()
          }

          // Calcular dimensões para ajustar a imagem na página
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()

          // Ajustar a imagem para caber na página mantendo a proporção
          const imgProps = pdf.getImageProperties(imgData)
          const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height)
          const w = imgProps.width * ratio
          const h = imgProps.height * ratio
          const x = (pdfWidth - w) / 2
          const y = (pdfHeight - h) / 2

          pdf.addImage(imgData, "JPEG", x, y, w, h)

          // Adicionar número do slide
          pdf.setFontSize(10)
          pdf.setTextColor(100)
          pdf.text(`Slide ${i + 1} de ${slides.length}`, pdfWidth - 40, pdfHeight - 10)
        }
      }

      // Salvar o PDF
      pdf.save(`${presentationTitle}.pdf`)
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.")
    } finally {
      // Restaurar o slide original
      setCurrentSlide(originalSlide)
    }
  }

  // Download as HTML
  const downloadAsHtml = () => {
    let content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${presentationTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          .slide { 
            page-break-after: always; 
            height: 100vh; 
            display: flex; 
            flex-direction: column; 
            justify-content: center; 
            align-items: center; 
            text-align: center; 
            padding: 2rem; 
            box-sizing: border-box;
          }
          h1 { font-size: 2.5rem; margin-bottom: 1rem; }
          h2 { font-size: 2rem; margin-bottom: 1rem; }
          ul { text-align: left; padding-left: 2rem; }
          li { margin-bottom: 0.5rem; }
          img { max-width: 80%; max-height: 60%; object-fit: contain; }
          .slide-number { 
            position: absolute; 
            bottom: 1rem; 
            right: 1rem; 
            font-size: 0.8rem; 
            color: #666; 
          }
          @media print {
            .slide { height: 100vh; page-break-after: always; }
            body { margin: 0; }
          }
        </style>
      </head>
      <body>
    `

    slides.forEach((slide, index) => {
      // Garantir que todos os valores sejam definidos para evitar erros
      const slideTitle = slide.title || ""
      const slideContent = slide.content || ""
      const slideSubtitle = slide.subtitle || ""
      const slideImageUrl = slide.imageUrl || ""
      const slideBackgroundColor = slide.backgroundColor || "#FFFFFF"

      content += `<div class="slide" style="background-color: ${slideBackgroundColor}; position: relative;">`

      if (slide.type === "title") {
        content += `
          <h1>${slideTitle}</h1>
          <p>${slideSubtitle}</p>
        `
      } else if (slide.type === "content") {
        content += `
          <h2>${slideTitle}</h2>
          <div>${slideContent}</div>
        `
      } else if (slide.type === "image") {
        content += `
          <h2>${slideTitle}</h2>
          ${slideImageUrl ? `<img src="${slideImageUrl}" alt="Slide image">` : ""}
          <p>${slideContent}</p>
        `
      }

      content += `<div class="slide-number">Slide ${index + 1} de ${slides.length}</div></div>`
    })

    content += `
      </body>
      </html>
    `

    const blob = new Blob([content], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${presentationTitle}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Present slides
  // Adicionar ID ao slide atual para captura de PDF
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev))
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
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
              <span className="rounded-md bg-purple-600 px-2 py-0.5 text-xs font-medium text-white">Slides</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={presentationTitle}
              onChange={(e) => setPresentationTitle(e.target.value)}
              className="rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm focus:border-purple-500 focus:outline-none dark:border-slate-700"
            />

            <Button variant="outline" size="sm" onClick={presentSlides}>
              <Play className="mr-2 h-4 w-4" />
              Apresentar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={savePresentation}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={downloadAsHtml}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar como HTML
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
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="transitions">Transições</TabsTrigger>
          </TabsList>

          <TabsContent
            value="home"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Button variant="outline" size="sm" onClick={() => addSlide("content")}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Slide
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Layout className="mr-2 h-4 w-4" />
                  Layout
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => changeSlideLayout("title")}>Slide de Título</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeSlideLayout("content")}>Slide de Conteúdo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeSlideLayout("image")}>Slide de Imagem</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => execCommand("bold")} title="Negrito">
                <Bold className="h-4 w-4" />
                <span className="sr-only">Negrito</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("italic")} title="Itálico">
                <Italic className="h-4 w-4" />
                <span className="sr-only">Itálico</span>
              </Button>
              <Button variant="outline" size="sm" onClick={() => execCommand("underline")} title="Sublinhado">
                <Underline className="h-4 w-4" />
                <span className="sr-only">Sublinhado</span>
              </Button>
            </div>

            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>

            <div className="flex items-center gap-2">
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
            </div>

            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>

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
          </TabsContent>

          <TabsContent
            value="insert"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Button variant="outline" size="sm" onClick={insertImage}>
              <Image className="mr-2 h-4 w-4" />
              Imagem
            </Button>
            <Button variant="outline" size="sm">
              <Square className="mr-2 h-4 w-4" />
              Forma
            </Button>
            <Button variant="outline" size="sm">
              <Circle className="mr-2 h-4 w-4" />
              Gráfico
            </Button>
          </TabsContent>

          <TabsContent
            value="design"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Plano de Fundo
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="grid grid-cols-3 gap-2">
                  {slideBackgrounds.map((color) => (
                    <button
                      key={color.value}
                      className="h-12 w-full rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      style={{ backgroundColor: color.value }}
                      onClick={() => changeSlideBackground(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm">
              Tema
            </Button>
          </TabsContent>

          <TabsContent
            value="transitions"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Button variant="outline" size="sm">
              Desvanecer
            </Button>
            <Button variant="outline" size="sm">
              Empurrar
            </Button>
            <Button variant="outline" size="sm">
              Deslizar
            </Button>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[250px_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="mb-3 text-sm font-medium">Slides</h3>
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`cursor-pointer rounded-md p-2 ${currentSlide === index ? "bg-purple-100 dark:bg-purple-900/30" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                  onClick={() => setCurrentSlide(index)}
                >
                  <div
                    className="aspect-video w-full rounded-md bg-white shadow-sm dark:bg-slate-800"
                    style={{ backgroundColor: slide.backgroundColor || "#FFFFFF" }}
                  >
                    <div className="flex h-full flex-col items-center justify-center p-2 text-center">
                      <p className="text-xs font-medium">{slide.title}</p>
                      <p className="text-[8px] text-slate-500 dark:text-slate-400">
                        {slide.type === "image"
                          ? "Slide de Imagem"
                          : slide.content
                            ? slide.content.replace(/<[^>]*>/g, "").substring(0, 20) + "..."
                            : "Slide vazio"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-1 text-center text-xs">{index + 1}</p>
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => addSlide("content")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Slide
                </Button>
                <Button variant="outline" size="sm" onClick={duplicateSlide} title="Duplicar slide">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={deleteSlide} title="Excluir slide">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Button variant="outline" size="icon" onClick={prevSlide}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Slide {currentSlide + 1} de {slides.length}
              </span>
              <Button variant="outline" size="icon" onClick={nextSlide}>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div
              id="current-slide"
              ref={presentationRef}
              className="mx-auto aspect-[16/9] w-full max-w-3xl rounded-lg border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900"
              style={{ backgroundColor: slides[currentSlide]?.backgroundColor || "#FFFFFF" }}
            >
              <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                {slides[currentSlide]?.type === "title" && (
                  <>
                    <h1
                      ref={slideTitleRef}
                      className="mb-4 text-4xl font-bold outline-none"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={updateSlideTitle}
                      dangerouslySetInnerHTML={{ __html: slides[currentSlide]?.title || "Título" }}
                    />
                    <p
                      ref={slideContentRef}
                      className="text-xl text-slate-600 outline-none dark:text-slate-300"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={updateSlideContent}
                      dangerouslySetInnerHTML={{ __html: slides[currentSlide]?.subtitle || "Subtítulo" }}
                    />
                  </>
                )}

                {slides[currentSlide]?.type === "content" && (
                  <>
                    <h2
                      ref={slideTitleRef}
                      className="mb-6 text-3xl font-bold outline-none"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={updateSlideTitle}
                      dangerouslySetInnerHTML={{ __html: slides[currentSlide]?.title || "Slide de Conteúdo" }}
                    />
                    <div
                      ref={slideContentRef}
                      className="text-left text-xl outline-none w-full"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={updateSlideContent}
                      dangerouslySetInnerHTML={{
                        __html: slides[currentSlide]?.content || "<ul><li>Adicione conteúdo aqui</li></ul>",
                      }}
                    />
                  </>
                )}

                {slides[currentSlide]?.type === "image" && (
                  <>
                    <h2
                      ref={slideTitleRef}
                      className="mb-6 text-3xl font-bold outline-none"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={updateSlideTitle}
                      dangerouslySetInnerHTML={{ __html: slides[currentSlide]?.title || "Slide de Imagem" }}
                    />
                    <div className="mb-4 h-40 w-64 rounded-md bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      {slides[currentSlide]?.imageUrl ? (
                        <img
                          src={slides[currentSlide].imageUrl || "/placeholder.svg"}
                          alt="Imagem do slide"
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Image className="h-10 w-10 text-slate-400" />
                        </div>
                      )}
                    </div>
                    <p
                      ref={slideContentRef}
                      className="text-xl text-slate-600 outline-none dark:text-slate-300"
                      contentEditable={true}
                      suppressContentEditableWarning={true}
                      onBlur={updateSlideContent}
                      dangerouslySetInnerHTML={{ __html: slides[currentSlide]?.content || "Descrição da imagem" }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

