"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Download, Zap, ArrowRight, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function DemoApp() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text first",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      })

      if (!response.ok) {
        throw new Error("Failed to process input")
      }

      const data = await response.json()
      setOutput(data.output)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your input. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!output) {
      toast({
        title: "Nothing to copy",
        description: "No output available to copy",
        variant: "destructive",
      })
      return
    }

    try {
      await navigator.clipboard.writeText(output)
      toast({
        title: "Copied!",
        description: "Output copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    if (!output) {
      toast({
        title: "Nothing to download",
        description: "No output available to download",
        variant: "destructive",
      })
      return
    }

    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "output.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded!",
      description: "Output saved as output.txt",
    })
  }

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">TextFlow</span>
            </div>

          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="hero-gradient absolute inset-0" />
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-muted text-muted-foreground border border-border mb-6">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              Now in Beta
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Transform text with{" "}
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                intelligent processing
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Experience the future of text processing. Our advanced API transforms your content with precision and
              speed, delivering results you can trust.
            </p>
          </div>
        </section>

        <section className="pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Input Section */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    Input
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Enter your text to process through our intelligent API
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Type or paste your text here..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-[300px] resize-none bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{input.length} characters</span>
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading || !input.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Process Text
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        Output
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Processed results ready for use</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={!output}
                        className="border-border/50 hover:bg-accent/50 bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                        disabled={!output}
                        className="border-border/50 hover:bg-accent/50 bg-transparent"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Processed output will appear here..."
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    className="min-h-[300px] resize-none bg-input/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                  {output && (
                    <div className="mt-4 flex items-center justify-between">
                      <div>

                      <span className="text-xs text-muted-foreground">{output.length} characters</span>
                      <span className="px-2"></span>
                      <span className="text-xs text-muted-foreground">{output.split(' ').length} words</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        Ready
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-20 grid gap-8 md:grid-cols-3">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">
                  Process text in milliseconds with our optimized API infrastructure
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Reliable</h3>
                <p className="text-muted-foreground text-sm">
                  99.9% uptime with enterprise-grade reliability and monitoring
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Copy className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Easy Integration</h3>
                <p className="text-muted-foreground text-sm">Simple API with comprehensive documentation and SDKs</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">© 2024 TextFlow. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
