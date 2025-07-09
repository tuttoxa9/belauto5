import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Типы для автомобилей
export interface Car {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage?: number
  engine_volume?: string
  fuel_type?: string
  transmission?: string
  drive_train?: string
  body_type?: string
  color?: string
  description?: string
  image_urls: string[]
  is_available: boolean
  specifications: Record<string, string>
  features: string[]
  created_at?: string
  updated_at?: string
}

// Типы для настроек
export interface Setting {
  id: string
  key: string
  value: any
  created_at?: string
  updated_at?: string
}

// Типы для лидов
export interface Lead {
  id: string
  name: string
  phone: string
  email?: string
  message?: string
  car_id?: string
  status: 'new' | 'contacted' | 'closed'
  created_at?: string
  updated_at?: string
}

// Типы для отзывов
export interface Review {
  id: string
  name: string
  content: string
  rating: number
  is_published: boolean
  created_at?: string
  updated_at?: string
}

// Типы для историй
export interface Story {
  id: string
  title: string
  content: string
  image_url?: string
  is_published: boolean
  created_at?: string
  updated_at?: string
}

// Утилиты для работы с базой данных
export const database = {
  // Автомобили
  cars: {
    async getAll(): Promise<Car[]> {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },

    async getById(id: string): Promise<Car | null> {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },

    async create(car: Omit<Car, 'id' | 'created_at' | 'updated_at'>): Promise<Car> {
      const { data, error } = await supabase
        .from('cars')
        .insert([car])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<Car>): Promise<Car> {
      const { data, error } = await supabase
        .from('cars')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  },

  // Настройки
  settings: {
    async get(key: string): Promise<any> {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', key)
        .single()

      if (error) throw error
      return data?.value
    },

    async set(key: string, value: any): Promise<void> {
      const { error } = await supabase
        .from('settings')
        .upsert({
          key,
          value,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    },

    async getAll(): Promise<Record<string, any>> {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')

      if (error) throw error

      const settings: Record<string, any> = {}
      data?.forEach(setting => {
        settings[setting.key] = setting.value
      })

      return settings
    }
  },

  // Лиды
  leads: {
    async getAll(): Promise<Lead[]> {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },

    async create(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
      const { data, error } = await supabase
        .from('leads')
        .insert([{ ...lead, status: 'new' }])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async updateStatus(id: string, status: Lead['status']): Promise<void> {
      const { error } = await supabase
        .from('leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    }
  },

  // Отзывы
  reviews: {
    async getAll(): Promise<Review[]> {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },

    async getPublished(): Promise<Review[]> {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },

    async create(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>): Promise<Review> {
      const { data, error } = await supabase
        .from('reviews')
        .insert([review])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<Review>): Promise<Review> {
      const { data, error } = await supabase
        .from('reviews')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  },

  // Истории
  stories: {
    async getAll(): Promise<Story[]> {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },

    async getPublished(): Promise<Story[]> {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },

    async create(story: Omit<Story, 'id' | 'created_at' | 'updated_at'>): Promise<Story> {
      const { data, error } = await supabase
        .from('stories')
        .insert([story])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<Story>): Promise<Story> {
      const { data, error } = await supabase
        .from('stories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  }
}

// Утилиты для работы с файлами
export const storage = {
  async uploadImage(file: File, bucket: string = 'images'): Promise<string> {
    const fileName = `${Date.now()}_${file.name}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return publicUrl
  },

  async deleteImage(url: string, bucket: string = 'images'): Promise<void> {
    // Извлекаем имя файла из URL
    const fileName = url.split('/').pop()
    if (!fileName) return

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName])

    if (error) throw error
  }
}
