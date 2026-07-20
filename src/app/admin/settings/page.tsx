"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Settings, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast"

export default function AdminSettingsPage() {
  const { addToast } = useToast()
  const [siteName, setSiteName] = useState("UmaWall")
  const [siteDescription, setSiteDescription] = useState("Your ultimate Umamusume Pretty Derby wallpaper gallery")
  const [maxUploadSize, setMaxUploadSize] = useState("50")
  const [autoApprove, setAutoApprove] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          const s = data.data as { key: string; value: string }[]
          for (const setting of s) {
            if (setting.key === "siteName") setSiteName(setting.value)
            else if (setting.key === "siteDescription") setSiteDescription(setting.value)
            else if (setting.key === "maxUploadSize") setMaxUploadSize(setting.value)
            else if (setting.key === "autoApprove") setAutoApprove(setting.value === "true")
            else if (setting.key === "maintenanceMode") setMaintenanceMode(setting.value === "true")
          }
        }
      })
      .catch(() => {})
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            siteName,
            siteDescription,
            maxUploadSize,
            autoApprove: String(autoApprove),
            maintenanceMode: String(maintenanceMode),
          },
        }),
      })
      const data = await res.json()
      if (data.success) {
        addToast({ type: "success", title: "Settings saved!" })
      } else {
        addToast({ type: "error", title: data.message || "Failed to save" })
      }
    } catch {
      addToast({ type: "error", title: "Failed to save settings" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-[#999] hover:text-white transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-[#D4A843]" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-[#666] mb-1">Site Name</label>
                <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-[#666] mb-1">Site Description</label>
                <Textarea value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm text-[#666] mb-1">Max Upload Size (MB)</label>
                <Input type="number" value={maxUploadSize} onChange={(e) => setMaxUploadSize(e.target.value)} />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]">
                <div>
                  <p className="text-sm font-medium">Auto-approve uploads</p>
                  <p className="text-xs text-[#666]">Automatically publish uploaded wallpapers</p>
                </div>
                <button
                  onClick={() => setAutoApprove(!autoApprove)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${autoApprove ? "bg-[#D4A843]" : "bg-[#333]"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoApprove ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0a] border border-[#2a2a2a]">
                <div>
                  <p className="text-sm font-medium">Maintenance Mode</p>
                  <p className="text-xs text-[#666]">Show maintenance page to non-admin users</p>
                </div>
                <button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${maintenanceMode ? "bg-red-500" : "bg-[#333]"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${maintenanceMode ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
