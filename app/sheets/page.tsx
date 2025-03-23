"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Home,
  Save,
  FileDown,
  ChevronDown,
  Plus,
  BarChart3,
  Filter,
  SortAsc,
  SortDesc,
  Calculator,
  Trash,
  Undo,
  Redo,
  Download,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { jsPDF } from "jspdf"
import "jspdf-autotable"

export default function SheetsPage() {
  const [spreadsheetTitle, setSpreadsheetTitle] = useState("Planilha sem título")
  const [activeCell, setActiveCell] = useState(null)
  const [formulaInput, setFormulaInput] = useState("")
  const [showChartDialog, setShowChartDialog] = useState(false)
  const [chartType, setChartType] = useState("bar")
  const [chartRange, setChartRange] = useState("")
  const tableRef = useRef(null)
  const [clipboard, setClipboard] = useState(null)

  // Sample data for the spreadsheet
  const [headers, setHeaders] = useState(["A", "B", "C", "D", "E", "F", "G", "H"])
  const [rows, setRows] = useState(
    Array.from({ length: 20 }, (_, rowIndex) => ({
      id: rowIndex + 1,
      cells: Array.from({ length: headers.length }, (_, colIndex) => {
        // Add some sample data
        if (rowIndex === 0 && colIndex === 0) return "Produto"
        if (rowIndex === 0 && colIndex === 1) return "Categoria"
        if (rowIndex === 0 && colIndex === 2) return "Preço"
        if (rowIndex === 0 && colIndex === 3) return "Quantidade"
        if (rowIndex === 0 && colIndex === 4) return "Total"

        if (rowIndex === 1 && colIndex === 0) return "Laptop"
        if (rowIndex === 1 && colIndex === 1) return "Eletrônicos"
        if (rowIndex === 1 && colIndex === 2) return "1200"
        if (rowIndex === 1 && colIndex === 3) return "5"
        if (rowIndex === 1 && colIndex === 4) return "=C2*D2"

        if (rowIndex === 2 && colIndex === 0) return "Celular"
        if (rowIndex === 2 && colIndex === 1) return "Eletrônicos"
        if (rowIndex === 2 && colIndex === 2) return "800"
        if (rowIndex === 2 && colIndex === 3) return "10"
        if (rowIndex === 2 && colIndex === 4) return "=C3*D3"

        if (rowIndex === 3 && colIndex === 0) return "Mesa"
        if (rowIndex === 3 && colIndex === 1) return "Móveis"
        if (rowIndex === 3 && colIndex === 2) return "350"
        if (rowIndex === 3 && colIndex === 3) return "3"
        if (rowIndex === 3 && colIndex === 4) return "=C4*D4"

        return ""
      }),
    })),
  )

  // Handle cell selection
  const handleCellClick = (rowIndex, colIndex) => {
    setActiveCell({ row: rowIndex, col: colIndex })
    const cellValue = rows[rowIndex].cells[colIndex]
    setFormulaInput(cellValue)
  }

  // Update cell value
  const updateCellValue = (rowIndex, colIndex, value) => {
    const newRows = [...rows]
    newRows[rowIndex].cells[colIndex] = value
    setRows(newRows)

    // Update formula input if this is the active cell
    if (activeCell && activeCell.row === rowIndex && activeCell.col === colIndex) {
      setFormulaInput(value)
    }

    // Recalculate formulas
    calculateFormulas()
  }

  // Handle formula input change
  const handleFormulaInputChange = (e) => {
    setFormulaInput(e.target.value)
  }

  // Apply formula to active cell
  const applyFormula = () => {
    if (activeCell) {
      updateCellValue(activeCell.row, activeCell.col, formulaInput)
    }
  }

  // Calculate cell value (handle formulas)
  const calculateCellValue = (rowIndex, colIndex) => {
    const cellValue = rows[rowIndex]?.cells[colIndex]

    // Se a célula for undefined ou não for uma string, retornar o valor diretamente
    if (cellValue === undefined || typeof cellValue !== "string" || !cellValue.startsWith("=")) {
      return cellValue || ""
    }

    try {
      // Extrair a fórmula sem o '='
      const formula = cellValue.substring(1)

      // Verificar se há referências circulares (implementação básica)
      const cellsVisited = new Set()
      const cellKey = `${rowIndex},${colIndex}`

      if (cellsVisited.has(cellKey)) {
        return "CIRCULAR_REF" // Alterado de #CIRCULAR para CIRCULAR_REF para evitar o erro
      }

      cellsVisited.add(cellKey)

      // Substituir referências de células (ex: A1, B2) com valores reais
      const formulaWithValues = formula.replace(/([A-Z]+)(\d+)/g, (match, col, row) => {
        // Converter coluna: A->0, B->1, AA->26, etc.
        let colIndex = 0
        for (let i = 0; i < col.length; i++) {
          colIndex = colIndex * 26 + (col.charCodeAt(i) - 64)
        }
        colIndex-- // Ajustar para índice base 0

        const rowIndex = Number.parseInt(row) - 1

        if (rowIndex >= 0 && rowIndex < rows.length && colIndex >= 0 && colIndex < headers.length) {
          const value = rows[rowIndex].cells[colIndex]

          // Se a célula referenciada também for uma fórmula, calcular primeiro
          if (typeof value === "string" && value.startsWith("=")) {
            const refCellKey = `${rowIndex},${colIndex}`
            if (cellsVisited.has(refCellKey)) {
              return "CIRCULAR_REF" // Alterado de #CIRCULAR para CIRCULAR_REF para evitar o erro
            }
            cellsVisited.add(refCellKey)
            return calculateCellValue(rowIndex, colIndex)
          }

          // Se for um número, retornar diretamente; caso contrário, colocar entre aspas
          return isNaN(value) ? `"${value}"` : value
        }

        return 0
      })

      // Processar funções comuns
      const processedFormula = formulaWithValues
        .replace(/SUM$$(.*?)$$/gi, (match, range) => {
          const [start, end] = range.split(":")
          if (start && end) {
            return calculateRangeFunction(start, end, (values) => {
              return values.reduce((sum, val) => sum + val, 0)
            })
          }
          return 0
        })
        .replace(/AVERAGE$$(.*?)$$/gi, (match, range) => {
          const [start, end] = range.split(":")
          if (start && end) {
            return calculateRangeFunction(start, end, (values) => {
              return values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
            })
          }
          return 0
        })
        .replace(/COUNT$$(.*?)$$/gi, (match, range) => {
          const [start, end] = range.split(":")
          if (start && end) {
            return calculateRangeFunction(start, end, (values) => {
              return values.length
            })
          }
          return 0
        })
        .replace(/MAX$$(.*?)$$/gi, (match, range) => {
          const [start, end] = range.split(":")
          if (start && end) {
            return calculateRangeFunction(start, end, (values) => {
              return values.length ? Math.max(...values) : 0
            })
          }
          return 0
        })
        .replace(/MIN$$(.*?)$$/gi, (match, range) => {
          const [start, end] = range.split(":")
          if (start && end) {
            return calculateRangeFunction(start, end, (values) => {
              return values.length ? Math.min(...values) : 0
            })
          }
          return 0
        })
        .replace(/CONCATENATE$$(.*?)$$/gi, (match, args) => {
          // Dividir argumentos, respeitando strings entre aspas
          const parts = []
          let currentPart = ""
          let inQuotes = false

          for (let i = 0; i < args.length; i++) {
            const char = args[i]

            if (char === '"' && (i === 0 || args[i - 1] !== "\\")) {
              inQuotes = !inQuotes
              currentPart += char
            } else if (char === "," && !inQuotes) {
              parts.push(currentPart.trim())
              currentPart = ""
            } else {
              currentPart += char
            }
          }

          if (currentPart) {
            parts.push(currentPart.trim())
          }

          // Processar cada parte e concatenar
          return parts
            .map((part) => {
              // Se for uma string entre aspas, remover as aspas
              if (part.startsWith('"') && part.endsWith('"')) {
                return part.slice(1, -1)
              }
              // Caso contrário, avaliar como expressão
              try {
                return eval(part)
              } catch (e) {
                return part
              }
            })
            .join("")
        })
        .replace(/IF$$(.*?),(.*?),(.*?)$$/gi, (match, condition, trueValue, falseValue) => {
          try {
            // Avaliar a condição
            const evalCondition = eval(condition)

            // Processar o valor verdadeiro ou falso
            const result = evalCondition ? trueValue : falseValue

            // Se for uma string entre aspas, remover as aspas
            if (result.trim().startsWith('"') && result.trim().endsWith('"')) {
              return result.trim().slice(1, -1)
            }

            // Caso contrário, avaliar como expressão
            return eval(result)
          } catch (e) {
            return "ERROR"
          }
        })

      // Função auxiliar para calcular funções em intervalos
      function calculateRangeFunction(start, end, func) {
        try {
          // Extrair índices de coluna e linha
          const startCol = start.match(/[A-Z]+/)[0]
          const startRow = Number.parseInt(start.match(/\d+/)[0])
          const endCol = end.match(/[A-Z]+/)[0]
          const endRow = Number.parseInt(end.match(/\d+/)[0])

          // Converter letras de coluna para índices
          let startColIndex = 0
          for (let i = 0; i < startCol.length; i++) {
            startColIndex = startColIndex * 26 + (startCol.charCodeAt(i) - 64)
          }
          startColIndex-- // Ajustar para índice base 0

          let endColIndex = 0
          for (let i = 0; i < endCol.length; i++) {
            endColIndex = endColIndex * 26 + (endCol.charCodeAt(i) - 64)
          }
          endColIndex-- // Ajustar para índice base 0

          // Ajustar índices de linha para base 0
          const startRowIndex = startRow - 1
          const endRowIndex = endRow - 1

          // Coletar valores numéricos no intervalo
          const values = []

          for (let r = startRowIndex; r <= endRowIndex; r++) {
            for (let c = startColIndex; c <= endColIndex; c++) {
              if (r >= 0 && r < rows.length && c >= 0 && c < headers.length) {
                const cellValue = rows[r].cells[c]

                // Se for uma fórmula, calcular primeiro
                let value
                if (typeof cellValue === "string" && cellValue.startsWith("=")) {
                  value = calculateCellValue(r, c)
                } else {
                  value = cellValue
                }

                // Converter para número se possível
                const numValue = Number.parseFloat(value)
                if (!isNaN(numValue)) {
                  values.push(numValue)
                }
              }
            }
          }

          // Aplicar a função aos valores coletados
          return func(values)
        } catch (e) {
          console.error("Erro ao calcular função de intervalo:", e)
          return "ERROR"
        }
      }

      // Avaliar a fórmula processada
      try {
        // Verificar se a fórmula contém referências circulares
        if (processedFormula.includes("CIRCULAR_REF")) {
          return "Ref. Circular"
        }

        const result = eval(processedFormula)

        // Formatar o resultado
        if (typeof result === "number") {
          // Verificar se é um número inteiro
          if (Number.isInteger(result)) {
            return result.toString()
          }
          // Caso contrário, formatar com 2 casas decimais
          return result.toFixed(2)
        }

        return result
      } catch (error) {
        console.error("Erro ao avaliar fórmula:", error, processedFormula)
        return "ERROR"
      }
    } catch (error) {
      console.error("Erro ao processar fórmula:", error)
      return "ERROR"
    }
  }

  // Recalculate all formulas
  const calculateFormulas = () => {
    // Criar uma cópia das linhas para não modificar durante o cálculo
    const newRows = [...rows]
    let changed = false

    // Percorrer todas as células e recalcular fórmulas
    for (let r = 0; r < newRows.length; r++) {
      for (let c = 0; c < newRows[r].cells.length; c++) {
        const cell = newRows[r].cells[c]

        // Se for uma fórmula, verificar se o resultado mudou
        if (typeof cell === "string" && cell.startsWith("=")) {
          const calculatedValue = calculateCellValue(r, c)

          // Se o valor calculado for diferente, marcar como alterado
          if (calculatedValue !== cell) {
            changed = true
          }
        }
      }
    }

    // Se houve alterações, atualizar o estado
    if (changed) {
      setRows(newRows)
    }
  }

  // Add a new row
  const addRow = () => {
    const newRow = {
      id: rows.length + 1,
      cells: Array(headers.length).fill(""),
    }
    setRows([...rows, newRow])
  }

  // Add a new column
  const addColumn = () => {
    const newHeader = String.fromCharCode(65 + headers.length) // A, B, C, ...
    setHeaders([...headers, newHeader])

    const newRows = rows.map((row) => ({
      ...row,
      cells: [...row.cells, ""],
    }))
    setRows(newRows)
  }

  // Delete a row
  const deleteRow = () => {
    if (activeCell && rows.length > 1) {
      const newRows = rows.filter((_, index) => index !== activeCell.row)
      setRows(newRows)
      setActiveCell(null)
    }
  }

  // Delete a column
  const deleteColumn = () => {
    if (activeCell && headers.length > 1) {
      const newHeaders = headers.filter((_, index) => index !== activeCell.col)
      const newRows = rows.map((row) => ({
        ...row,
        cells: row.cells.filter((_, index) => index !== activeCell.col),
      }))
      setHeaders(newHeaders)
      setRows(newRows)
      setActiveCell(null)
    }
  }

  // Sort data by column
  const sortByColumn = (colIndex, ascending = true) => {
    // Skip the header row (rowIndex 0)
    const headerRow = rows[0]
    const dataRows = rows.slice(1)

    const sortedRows = [...dataRows].sort((a, b) => {
      const aValue = a.cells[colIndex]
      const bValue = b.cells[colIndex]

      // Try to convert to numbers for numeric sorting
      const aNum = Number(aValue)
      const bNum = Number(bValue)

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return ascending ? aNum - bNum : bNum - aNum
      }

      // String comparison
      return ascending ? String(aValue).localeCompare(String(bValue)) : String(bValue).localeCompare(String(aValue))
    })

    setRows([headerRow, ...sortedRows])
  }

  // Apply common formulas
  const applyCommonFormula = (formula) => {
    if (activeCell) {
      let formulaText = ""

      switch (formula) {
        case "sum":
          formulaText = "=SUM(A1:A5)" // Example range
          break
        case "average":
          formulaText = "=AVERAGE(A1:A5)" // Example range
          break
        case "count":
          formulaText = "=COUNT(A1:A5)" // Example range
          break
        default:
          formulaText = ""
      }

      setFormulaInput(formulaText)
    }
  }

  // Create a chart (simulated)
  const createChart = () => {
    alert(`Gráfico criado com tipo: ${chartType} e intervalo: ${chartRange}`)
    setShowChartDialog(false)
  }

  // Save spreadsheet
  const saveSpreadsheet = () => {
    localStorage.setItem("calmSheetsData", JSON.stringify({ headers, rows }))
    localStorage.setItem("calmSheetsTitle", spreadsheetTitle)
    alert("Planilha salva!")
  }

  // Download as CSV
  const downloadAsCsv = () => {
    let csvContent = ""

    // Add headers
    csvContent += headers.join(",") + "\n"

    // Add rows
    rows.forEach((row) => {
      const rowData = row.cells.map((cell) => {
        // If it's a formula, calculate the value
        if (typeof cell === "string" && cell.startsWith("=")) {
          const rowIndex = rows.indexOf(row)
          const colIndex = row.cells.indexOf(cell)
          return calculateCellValue(rowIndex, colIndex)
        }
        // Escape commas and quotes
        if (typeof cell === "string" && (cell.includes(",") || cell.includes('"'))) {
          return `"${cell.replace(/"/g, '""')}"`
        }
        return cell || "" // Garantir que células vazias sejam representadas como strings vazias
      })
      csvContent += rowData.join(",") + "\n"
    })

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${spreadsheetTitle}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download as PDF
  const downloadAsPdf = () => {
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    })

    // Preparar dados para jsPDF-AutoTable
    const tableData = rows.map((row) =>
      row.cells.map((cell, colIndex) => {
        if (typeof cell === "string" && cell.startsWith("=")) {
          const rowIndex = rows.indexOf(row)
          return calculateCellValue(rowIndex, colIndex)
        }
        return cell || "" // Garantir que células vazias sejam representadas como strings vazias
      }),
    )

    // Configurar opções da tabela com melhor suporte para tabelas grandes
    pdf.autoTable({
      head: [headers],
      body: tableData.slice(1), // Pular linha de cabeçalho
      startY: 20,
      margin: { top: 30 },
      styles: {
        overflow: "linebreak",
        cellPadding: 3,
        fontSize: 8,
        cellWidth: "auto", // Ajustar automaticamente a largura das células
      },
      columnStyles: {
        // Definir largura mínima para todas as colunas
        ...headers.reduce((acc, _, i) => ({ ...acc, [i]: { cellWidth: 20 } }), {}),
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      didDrawPage: (data) => {
        // Cabeçalho
        pdf.setFontSize(18)
        pdf.setTextColor(40)
        pdf.text(spreadsheetTitle, data.settings.margin.left, 15)

        // Rodapé
        pdf.setFontSize(8)
        pdf.setTextColor(100)
        const pageSize = pdf.internal.pageSize
        const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
        pdf.text(
          `Gerado por CalmSheets em ${new Date().toLocaleDateString()}`,
          data.settings.margin.left,
          pageHeight - 10,
        )
        pdf.text(`Página ${data.pageNumber}`, data.settings.margin.left + 150, pageHeight - 10)
      },
      // Configurações para tabelas grandes
      willDrawCell: (data) => {
        // Reduzir o tamanho da fonte para células com muito conteúdo
        if (data.cell.text && data.cell.text.length > 20) {
          data.cell.styles.fontSize = 6
        }
      },
      // Dividir tabelas grandes em várias páginas
      tableWidth: "auto",
      showHead: "everyPage",
      tableLineColor: [200, 200, 200],
      tableLineWidth: 0.1,
    })

    pdf.save(`${spreadsheetTitle}.pdf`)
  }

  // Download as HTML
  const downloadAsHtml = () => {
    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${spreadsheetTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { margin-bottom: 20px; color: #333; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; position: sticky; top: 0; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .container { max-width: 100%; overflow-x: auto; }
        @media print {
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
        }
      </style>
    </head>
    <body>
      <h1>${spreadsheetTitle}</h1>
      <div class="container">
        <table>
          <thead>
            <tr>
              <th></th>
              ${headers.map((header) => `<th>${header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
  `

    rows.forEach((row, rowIndex) => {
      htmlContent += `<tr><td>${row.id}</td>`

      row.cells.forEach((cell, colIndex) => {
        const displayValue =
          cell && typeof cell === "string" && cell.startsWith("=") ? calculateCellValue(rowIndex, colIndex) : cell || ""

        htmlContent += `<td>${displayValue}</td>`
      })

      htmlContent += `</tr>`
    })

    htmlContent += `
          </tbody>
        </table>
      </div>
      <footer>
        <p>Gerado por CalmSheets em ${new Date().toLocaleDateString()}</p>
      </footer>
    </body>
    </html>
  `

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${spreadsheetTitle}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download as XLSX (simulated with HTML)
  const downloadAsXlsx = () => {
    // Na prática, precisaríamos de uma biblioteca como xlsx-js
    // Aqui estamos apenas simulando com HTML
    downloadAsHtml()
  }

  // Load saved spreadsheet
  useEffect(() => {
    const savedData = localStorage.getItem("calmSheetsData")
    const savedTitle = localStorage.getItem("calmSheetsTitle")

    if (savedData) {
      const { headers: savedHeaders, rows: savedRows } = JSON.parse(savedData)
      setHeaders(savedHeaders)
      setRows(savedRows)
    }

    if (savedTitle) {
      setSpreadsheetTitle(savedTitle)
    }

    // Calculate formulas on initial load
    calculateFormulas()
  }, [])

  const filterByColumn = () => {
    if (!activeCell) return

    const colIndex = activeCell.col
    const headerRow = rows[0]

    // Obter valores únicos na coluna
    const uniqueValues = new Set()
    for (let i = 1; i < rows.length; i++) {
      const value = rows[i].cells[colIndex]
      if (value) {
        uniqueValues.add(value)
      }
    }

    // Converter para array e ordenar
    const filterValues = Array.from(uniqueValues).sort()

    // Criar diálogo de filtro
    const filterValue = prompt(
      `Filtrar por ${headers[colIndex]}:\nValores disponíveis: ${filterValues.join(", ")}\n\nDigite o valor para filtrar ou deixe em branco para mostrar todos:`,
    )

    if (filterValue === null) return // Usuário cancelou

    if (filterValue.trim() === "") {
      // Mostrar todos
      // Nada a fazer, já que estamos usando o estado original
    } else {
      // Filtrar linhas
      const filteredRows = [headerRow]

      for (let i = 1; i < rows.length; i++) {
        const cellValue = rows[i].cells[colIndex]
        if (cellValue && cellValue.toString().includes(filterValue)) {
          filteredRows.push(rows[i])
        }
      }

      // Atualizar linhas
      setRows(filteredRows)
    }
  }

  const copyCell = () => {
    if (!activeCell) return

    const { row, col } = activeCell
    const value = rows[row].cells[col]
    setClipboard({ value, isFormula: typeof value === "string" && value.startsWith("=") })

    alert("Célula copiada!")
  }

  const pasteCell = () => {
    if (!activeCell || !clipboard) return

    const { row, col } = activeCell
    updateCellValue(row, col, clipboard.value)

    alert("Célula colada!")
  }

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
              <span className="rounded-md bg-green-600 px-2 py-0.5 text-xs font-medium text-white">Sheets</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={spreadsheetTitle}
              onChange={(e) => setSpreadsheetTitle(e.target.value)}
              className="rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm focus:border-green-500 focus:outline-none dark:border-slate-700"
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
                <DropdownMenuItem onClick={saveSpreadsheet}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={downloadAsCsv}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar como CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadAsHtml}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar como HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadAsXlsx}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Baixar como XLSX
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
        <div className="mb-4">
          <input
            type="text"
            value={formulaInput}
            onChange={handleFormulaInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFormula()
              }
            }}
            className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm focus:border-green-500 focus:outline-none dark:border-slate-700"
            placeholder="Digite fórmula ou valor..."
          />
        </div>

        <Tabs defaultValue="home">
          <TabsList className="mb-4">
            <TabsTrigger value="home">Início</TabsTrigger>
            <TabsTrigger value="insert">Inserir</TabsTrigger>
            <TabsTrigger value="formulas">Fórmulas</TabsTrigger>
            <TabsTrigger value="data">Dados</TabsTrigger>
          </TabsList>

          <TabsContent
            value="home"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="mr-2 h-4 w-4" />
              Linha
            </Button>
            <Button variant="outline" size="sm" onClick={addColumn}>
              <Plus className="mr-2 h-4 w-4" />
              Coluna
            </Button>
            <Button variant="outline" size="sm" onClick={deleteRow} disabled={!activeCell}>
              <Trash className="mr-2 h-4 w-4" />
              Excluir Linha
            </Button>
            <Button variant="outline" size="sm" onClick={deleteColumn} disabled={!activeCell}>
              <Trash className="mr-2 h-4 w-4" />
              Excluir Coluna
            </Button>
            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>
            <Button variant="outline" size="sm" onClick={copyCell} disabled={!activeCell}>
              Copiar
            </Button>
            <Button variant="outline" size="sm" onClick={pasteCell} disabled={!activeCell || !clipboard}>
              Colar
            </Button>
            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>
            <Button variant="outline" size="sm">
              <Undo className="mr-2 h-4 w-4" />
              Desfazer
            </Button>
            <Button variant="outline" size="sm">
              <Redo className="mr-2 h-4 w-4" />
              Refazer
            </Button>
          </TabsContent>

          <TabsContent
            value="insert"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Dialog open={showChartDialog} onOpenChange={setShowChartDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Gráfico
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Gráfico</DialogTitle>
                  <DialogDescription>Selecione o tipo de gráfico e o intervalo de dados.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="chart-type" className="text-right">
                      Tipo de Gráfico
                    </Label>
                    <Select value={chartType} onValueChange={setChartType} className="col-span-3">
                      <SelectTrigger id="chart-type">
                        <SelectValue placeholder="Selecione o tipo de gráfico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">Gráfico de Barras</SelectItem>
                        <SelectItem value="line">Gráfico de Linhas</SelectItem>
                        <SelectItem value="pie">Gráfico de Pizza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="data-range" className="text-right">
                      Intervalo de Dados
                    </Label>
                    <Input
                      id="data-range"
                      value={chartRange}
                      onChange={(e) => setChartRange(e.target.value)}
                      placeholder="ex: A1:B5"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createChart}>Criar Gráfico</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              Tabela
            </Button>
            <Button variant="outline" size="sm">
              Imagem
            </Button>
          </TabsContent>

          <TabsContent
            value="formulas"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Button variant="outline" size="sm" onClick={() => applyCommonFormula("sum")}>
              <Calculator className="mr-2 h-4 w-4" />
              Soma
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyCommonFormula("average")}>
              Média
            </Button>
            <Button variant="outline" size="sm" onClick={() => applyCommonFormula("count")}>
              Contar
            </Button>
            <div className="h-6 border-r border-slate-300 dark:border-slate-700"></div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Mais Funções
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFormulaInput("=MAX(A1:A10)")}>MÁXIMO</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormulaInput("=MIN(A1:A10)")}>MÍNIMO</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormulaInput('=IF(A1>10,"Sim","Não")')}>SE</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFormulaInput('=CONCATENATE(A1," ",B1)')}>
                  CONCATENAR
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TabsContent>

          <TabsContent
            value="data"
            className="mb-4 flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-800"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => activeCell && sortByColumn(activeCell.col, true)}
              disabled={!activeCell}
            >
              <SortAsc className="mr-2 h-4 w-4" />
              Ordenar A-Z
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => activeCell && sortByColumn(activeCell.col, false)}
              disabled={!activeCell}
            >
              <SortDesc className="mr-2 h-4 w-4" />
              Ordenar Z-A
            </Button>
            <Button variant="outline" size="sm" onClick={filterByColumn}>
              <Filter className="mr-2 h-4 w-4" />
              Filtro
            </Button>
          </TabsContent>
        </Tabs>

        <div
          ref={tableRef}
          className="overflow-auto rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800">
                <th className="w-10 border-r border-b border-slate-200 bg-slate-100 p-2 text-center text-xs font-medium dark:border-slate-700 dark:bg-slate-800"></th>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="min-w-[100px] border-r border-b border-slate-200 bg-slate-100 p-2 text-center text-xs font-medium dark:border-slate-700 dark:bg-slate-800"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="border-r border-b border-slate-200 bg-slate-100 p-2 text-center text-xs font-medium dark:border-slate-700 dark:bg-slate-800">
                    {row.id}
                  </td>
                  {row.cells.map((cell, cellIndex) => {
                    const isActive = activeCell && activeCell.row === rowIndex && activeCell.col === cellIndex
                    const displayValue =
                      cell && typeof cell === "string" && cell.startsWith("=")
                        ? calculateCellValue(rowIndex, cellIndex)
                        : cell || ""

                    return (
                      <td
                        key={cellIndex}
                        className={`border-r border-b border-slate-200 p-0 dark:border-slate-700 ${isActive ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
                        onClick={() => handleCellClick(rowIndex, cellIndex)}
                      >
                        <input
                          type="text"
                          value={isActive ? formulaInput : displayValue}
                          onChange={(e) =>
                            isActive
                              ? setFormulaInput(e.target.value)
                              : updateCellValue(rowIndex, cellIndex, e.target.value)
                          }
                          onBlur={() => isActive && applyFormula()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              applyFormula()
                            } else if (e.key === "ArrowUp" && rowIndex > 0) {
                              handleCellClick(rowIndex - 1, cellIndex)
                            } else if (e.key === "ArrowDown" && rowIndex < rows.length - 1) {
                              handleCellClick(rowIndex + 1, cellIndex)
                            } else if (e.key === "ArrowLeft" && cellIndex > 0) {
                              handleCellClick(rowIndex, cellIndex - 1)
                            } else if (e.key === "ArrowRight" && cellIndex < headers.length - 1) {
                              handleCellClick(rowIndex, cellIndex + 1)
                            }
                          }}
                          className="w-full h-full p-2 text-sm border-0 focus:outline-none focus:bg-blue-50 dark:focus:bg-slate-700 dark:bg-transparent"
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div>Planilha 1 de 1</div>
          <div>
            {rows.length} linhas × {headers.length} colunas
          </div>
        </div>
      </div>
    </div>
  )
}

