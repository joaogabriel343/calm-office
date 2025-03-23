import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Presentation, Table, ChevronRight, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-blue-950 dark:via-slate-900 dark:to-blue-950">
      {/* Header com espaço para logo */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm dark:border-blue-900/30 dark:bg-slate-950/80 sticky top-0 z-10">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Espaço para a logo */}
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                <span className="text-blue-500 dark:text-blue-300 text-xs">
                  <img src="https://i.postimg.cc/bw2FcW5Y/Logo-Calm-Dev2-so-o-C.png" alt="Logo" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100">Calm</span>
                <span className="text-xs text-blue-600 dark:text-blue-400">Office Suite</span>
              </div>
            </div>
            <nav>
              <ul className="flex items-center gap-6">
                <li>
                  <Link
                    href="/writer"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                  >
                    CalmWriter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/slides"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                  >
                    CalmSlides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sheets"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                  >
                    CalmSheets
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section com design inovador */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Elementos decorativos de fundo */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/10"></div>
          <div className="absolute top-1/2 -right-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-700/10"></div>
          <div className="absolute -bottom-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-300/10 blur-3xl dark:bg-blue-500/10"></div>

          <div className="container mx-auto px-4 relative">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
                  Produtividade <span className="text-blue-600 dark:text-blue-400">simplificada</span>
                </h1>
                <p className="mb-8 text-lg text-slate-600 dark:text-slate-300 max-w-lg">
                  Crie documentos, apresentações e planilhas com nossa suíte de escritório intuitiva e moderna.
                  Projetada para simplificar seu fluxo de trabalho.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                    <Link href="/writer">
                      Começar agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                    asChild
                  >
                    <Link href="#features">Saiba Mais</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 p-1 shadow-xl dark:from-blue-500 dark:to-blue-700">
                  <div className="h-full w-full rounded-xl bg-white p-4 dark:bg-slate-900">
                    <div className="flex gap-1.5 mb-4">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="h-6 w-2/3 rounded bg-blue-100 dark:bg-blue-900/30 mb-3"></div>
                    <div className="h-4 w-full rounded bg-blue-50 dark:bg-blue-900/20 mb-2"></div>
                    <div className="h-4 w-full rounded bg-blue-50 dark:bg-blue-900/20 mb-2"></div>
                    <div className="h-4 w-3/4 rounded bg-blue-50 dark:bg-blue-900/20 mb-4"></div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-20 rounded bg-blue-100 dark:bg-blue-900/30"></div>
                      <div className="h-20 rounded bg-blue-100 dark:bg-blue-900/30"></div>
                      <div className="h-20 rounded bg-blue-100 dark:bg-blue-900/30"></div>
                    </div>
                  </div>
                </div>

                {/* Elementos decorativos */}
                <div className="absolute -right-6 -bottom-6 h-24 w-24 rounded-lg bg-blue-200 dark:bg-blue-800 -z-10"></div>
                <div className="absolute -left-6 -top-6 h-16 w-16 rounded-lg border-4 border-blue-100 dark:border-blue-900 -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Aplicativos Section */}
        <section id="features" className="py-20 bg-white dark:bg-slate-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Nossos Aplicativos</h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Uma suíte completa de ferramentas de produtividade projetada para atender todas as suas necessidades de
                escritório.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card className="group border-blue-100 dark:border-blue-900/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                    <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white">CalmWriter</CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    Crie e edite documentos de texto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Um poderoso editor de texto com ferramentas de formatação, tabelas, imagens e muito mais. Exporte
                    para DOCX, PDF ou TXT.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600"
                    asChild
                  >
                    <Link href="/writer" className="flex items-center">
                      Abrir CalmWriter
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="group border-blue-100 dark:border-blue-900/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                    <Presentation className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white">CalmSlides</CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    Crie apresentações incríveis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Projete slides impressionantes com texto, imagens, gráficos e animações. Exporte para PPTX ou PDF.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600"
                    asChild
                  >
                    <Link href="/slides" className="flex items-center">
                      Abrir CalmSlides
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="group border-blue-100 dark:border-blue-900/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/20 hover:-translate-y-1">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                    <Table className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white">CalmSheets</CardTitle>
                  <CardDescription className="text-slate-500 dark:text-slate-400">
                    Crie e gerencie planilhas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-300">
                    Organize dados com fórmulas, gráficos e filtros. Importe e exporte arquivos XLSX ou CSV.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button
                    variant="outline"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600"
                    asChild
                  >
                    <Link href="/sheets" className="flex items-center">
                      Abrir CalmSheets
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Recursos Section */}
        <section className="py-20 bg-gradient-to-b from-white to-blue-50 dark:from-slate-950 dark:to-blue-950/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Por que escolher a Calm Suite?</h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Projetada para oferecer a melhor experiência de produtividade com recursos inovadores.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="group rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-100 dark:border-blue-900/50 dark:bg-slate-900 dark:hover:shadow-blue-900/20">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white dark:group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Interface Moderna</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Design limpo e intuitivo que torna a produtividade mais fácil.
                </p>
              </div>

              <div className="group rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-100 dark:border-blue-900/50 dark:bg-slate-900 dark:hover:shadow-blue-900/20">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white dark:group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Baseado na Nuvem</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Acesse seus documentos de qualquer lugar, em qualquer dispositivo.
                </p>
              </div>

              <div className="group rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-100 dark:border-blue-900/50 dark:bg-slate-900 dark:hover:shadow-blue-900/20">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white dark:group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Colaboração</h3>
                <p className="text-slate-600 dark:text-slate-300">Trabalhe junto com sua equipe em tempo real.</p>
              </div>

              <div className="group rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:shadow-blue-100 dark:border-blue-900/50 dark:bg-slate-900 dark:hover:shadow-blue-900/20">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-600 dark:group-hover:bg-blue-600 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:text-white dark:group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Compatibilidade</h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Importe e exporte para formatos populares de arquivo.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-12 dark:bg-slate-950 border-t border-blue-100 dark:border-blue-900/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-blue-500 dark:text-blue-400 text-xs">
                    <img src="https://i.postimg.cc/bw2FcW5Y/Logo-Calm-Dev2-so-o-C.png" alt="Logo" />
                  </span>
                </div>
                <span className="text-xl font-bold text-slate-800 dark:text-slate-100">Calm</span>
                <span className="text-xs text-blue-600 dark:text-blue-400">Suite</span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                © 2025 Calm Suite. Todos os direitos reservados.
              </p>
            </div>
            <nav>
              <ul className="flex flex-wrap gap-6">
                <li>
                  <Link
                    href="/writer"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                  >
                    CalmWriter
                  </Link>
                </li>
                <li>
                  <Link
                    href="/slides"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                  >
                    CalmSlides
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sheets"
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                  >
                    CalmSheets
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

