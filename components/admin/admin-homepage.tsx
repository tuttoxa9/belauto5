"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"
import { database } from "@/lib/supabase"

interface HomepageSettings {
  heroTitle: string
  heroSubtitle: string
  heroButtonText: string
  ctaTitle: string
  ctaSubtitle: string
}

export default function AdminHomepage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<HomepageSettings>({
    heroTitle: "Найди свой автомобиль надежным способом",
    heroSubtitle: "Поможем вам с приобретением автомобиля",
    heroButtonText: "Посмотреть каталог",
    ctaTitle: "Не нашли подходящий автомобиль?",
    ctaSubtitle: "Оставьте заявку, и мы подберем автомобиль специально для вас",
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const [heroTitle, heroSubtitle, heroButtonText, ctaTitle, ctaSubtitle] = await Promise.all([
        database.settings.get('heroTitle'),
        database.settings.get('heroSubtitle'),
        database.settings.get('heroButtonText'),
        database.settings.get('ctaTitle'),
        database.settings.get('ctaSubtitle'),
      ])

      setSettings(prev => ({
        ...prev,
        ...(heroTitle && { heroTitle }),
        ...(heroSubtitle && { heroSubtitle }),
        ...(heroButtonText && { heroButtonText }),
        ...(ctaTitle && { ctaTitle }),
        ...(ctaSubtitle && { ctaSubtitle }),
      }))
    } catch (error) {
      console.error("Ошибка загрузки настроек главной страницы:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      await Promise.all([
        database.settings.set('heroTitle', settings.heroTitle),
        database.settings.set('heroSubtitle', settings.heroSubtitle),
        database.settings.set('heroButtonText', settings.heroButtonText),
        database.settings.set('ctaTitle', settings.ctaTitle),
        database.settings.set('ctaSubtitle', settings.ctaSubtitle),
      ])
      alert("Настройки главной страницы сохранены!")
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка сохранения настроек")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Настройки главной страницы</h2>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Сохранить
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Настройки героя */}
        <Card>
          <CardHeader>
            <CardTitle>Главный баннер (Hero Section)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="heroTitle">Заголовок</Label>
              <Input
                id="heroTitle"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                placeholder="Найди свой автомобиль надежным способом"
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Подзаголовок</Label>
              <Input
                id="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                placeholder="Поможем вам с приобретением автомобиля"
              />
            </div>
            <div>
              <Label htmlFor="heroButtonText">Текст кнопки</Label>
              <Input
                id="heroButtonText"
                value={settings.heroButtonText}
                onChange={(e) => setSettings({ ...settings, heroButtonText: e.target.value })}
                placeholder="Посмотреть каталог"
              />
            </div>
          </CardContent>
        </Card>

        {/* Настройки призыва к действию */}
        <Card>
          <CardHeader>
            <CardTitle>Блок призыва к действию (CTA)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ctaTitle">Заголовок</Label>
              <Input
                id="ctaTitle"
                value={settings.ctaTitle}
                onChange={(e) => setSettings({ ...settings, ctaTitle: e.target.value })}
                placeholder="Не нашли подходящий автомобиль?"
              />
            </div>
            <div>
              <Label htmlFor="ctaSubtitle">Подзаголовок</Label>
              <Textarea
                id="ctaSubtitle"
                value={settings.ctaSubtitle}
                onChange={(e) => setSettings({ ...settings, ctaSubtitle: e.target.value })}
                placeholder="Оставьте заявку, и мы подберем автомобиль специально для вас"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
