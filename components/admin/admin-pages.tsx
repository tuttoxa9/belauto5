"use client"

import { useState, useEffect } from "react"
import { database } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Loader2 } from "lucide-react"
import AdminPrivacy from "./admin-privacy"
import AdminHomepage from "./admin-homepage"

export default function AdminPages() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pages, setPages] = useState({
    about: {
      title: "О компании Белавто Центр",
      subtitle: "Мы помогаем людям найти идеальный автомобиль уже более 12 лет",
      description: "Наша миссия — сделать покупку автомобиля простой, безопасной и выгодной.",
    },
    credit: {
      title: "Автокредит на выгодных условиях",
      subtitle: "Получите кредит на автомобиль мечты уже сегодня",
      description:
        "Мы работаем с ведущими банками Беларуси и поможем вам получить автокредит на самых выгодных условиях.",
    },
    leasing: {
      title: "Лизинг автомобилей для бизнеса",
      subtitle: "Выгодное решение для предпринимателей и юридических лиц",
      description:
        "Лизинг автомобилей - это удобный способ получить транспорт для бизнеса без больших первоначальных затрат.",
    },
  })

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const [aboutPage, creditPage, leasingPage] = await Promise.all([
        database.settings.get('page_about'),
        database.settings.get('page_credit'),
        database.settings.get('page_leasing'),
      ])

      setPages({
        about: aboutPage || pages.about,
        credit: creditPage || pages.credit,
        leasing: leasingPage || pages.leasing,
      })
    } catch (error) {
      console.error("Ошибка загрузки страниц:", error)
    } finally {
      setLoading(false)
    }
  }

  const savePages = async () => {
    setSaving(true)
    try {
      await Promise.all([
        database.settings.set('page_about', pages.about),
        database.settings.set('page_credit', pages.credit),
        database.settings.set('page_leasing', pages.leasing),
      ])
      alert("Страницы сохранены!")
    } catch (error) {
      console.error("Ошибка сохранения:", error)
      alert("Ошибка сохранения страниц")
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
        <h2 className="text-2xl font-bold">Управление страницами</h2>
        <Button onClick={savePages} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Сохранить все
        </Button>
      </div>

      <Tabs defaultValue="homepage" className="w-full">
        <TabsList>
          <TabsTrigger value="homepage">Главная</TabsTrigger>
          <TabsTrigger value="about">О нас</TabsTrigger>
          <TabsTrigger value="credit">Кредит</TabsTrigger>
          <TabsTrigger value="leasing">Лизинг</TabsTrigger>
          <TabsTrigger value="privacy">Политика конфиденциальности</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-6">
          <AdminHomepage />
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Страница "О нас"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input
                  value={pages.about.title}
                  onChange={(e) =>
                    setPages({
                      ...pages,
                      about: { ...pages.about, title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Подзаголовок</Label>
                <Input
                  value={pages.about.subtitle}
                  onChange={(e) =>
                    setPages({
                      ...pages,
                      about: { ...pages.about, subtitle: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={pages.about.description}
                  onChange={(e) =>
                    setPages({
                      ...pages,
                      about: { ...pages.about, description: e.target.value },
                    })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Страница "Кредит"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input
                  value={pages.credit.title}
                  onChange={(e) =>
                    setPages({
                      ...pages,
                      credit: { ...pages.credit, title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Подзаголовок</Label>
                <Input
                  value={pages.credit.subtitle}
                  onChange={(e) =>
                    setPages({
                      ...pages,
                      credit: { ...pages.credit, subtitle: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={pages.credit.description}
                  onChange={(e) =>
                    setPages({
                      ...pages,
                      credit: { ...pages.credit, description: e.target.value },
                    })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leasing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Страница "Лизинг"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input
                  value={pages.leasing.title}
                  onChange={(e) =>
                    setPages({
                      ...pages,
                      leasing: { ...pages.leasing, title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Подзаголовок</Label>
                <Input
                  value={pages.leasing.subtitle}
                  onChange={(e) =>
                    setPages({
                      ...pages,
                      leasing: { ...pages.leasing, subtitle: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={pages.leasing.description}
                  onChange={(e) =>
                    setPages({
                      ...pages,
                      leasing: { ...pages.leasing, description: e.target.value },
                    })
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <AdminPrivacy />
        </TabsContent>
      </Tabs>
    </div>
  )
}
