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

// Типы для контактов
export interface ContactData {
  id: string
  title: string
  subtitle: string
  address: string
  addressNote: string
  phone: string
  phoneNote: string
  email: string
  emailNote: string
  workingHours: {
    weekdays: string
    weekends: string
  }
  socialMedia: {
    instagram?: {
      name: string
      url: string
    }
    telegram?: {
      name: string
      url: string
    }
    avby?: {
      name: string
      url: string
    }
    tiktok?: {
      name: string
      url: string
    }
  }
  created_at?: string
  updated_at?: string
}

// Типы для контактных форм
export interface ContactForm {
  id: string
  name: string
  phone: string
  message: string
  status: 'new' | 'read' | 'responded'
  created_at?: string
  updated_at?: string
}

// Типы для банков
export interface Bank {
  id: string
  name: string
  logo_url?: string
  description?: string
  min_rate: number
  max_rate: number
  min_amount: number
  max_amount: number
  min_term_months: number
  max_term_months: number
  features: string[]
  requirements: string[]
  is_active: boolean
  order_index: number
  created_at?: string
  updated_at?: string
}

// Типы для лизинговых компаний
export interface LeasingCompany {
  id: string
  name: string
  logo_url?: string
  description?: string
  min_rate: number
  max_rate: number
  min_advance_percent: number
  max_advance_percent: number
  min_term_months: number
  max_term_months: number
  features: string[]
  requirements: string[]
  is_active: boolean
  order_index: number
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
  },

  // Контакты
  contacts: {
    async get(): Promise<ContactData | null> {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('page_type', 'contacts')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data?.content || null
    },

    async set(contactData: Omit<ContactData, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
      const { error } = await supabase
        .from('pages')
        .upsert({
          page_type: 'contacts',
          content: contactData,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    }
  },

  // Контактные формы
  contactForms: {
    async getAll(): Promise<ContactForm[]> {
      const { data, error } = await supabase
        .from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    },

    async create(form: Omit<ContactForm, 'id' | 'created_at' | 'updated_at'>): Promise<ContactForm> {
      const { data, error } = await supabase
        .from('contact_forms')
        .insert([{ ...form, status: 'new' }])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async updateStatus(id: string, status: ContactForm['status']): Promise<void> {
      const { error } = await supabase
        .from('contact_forms')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('contact_forms')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  },

  // Банки
  banks: {
    async getAll(): Promise<Bank[]> {
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    },

    async getActive(): Promise<Bank[]> {
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    },

    async getById(id: string): Promise<Bank | null> {
      const { data, error } = await supabase
        .from('banks')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },

    async create(bank: Omit<Bank, 'id' | 'created_at' | 'updated_at'>): Promise<Bank> {
      const { data, error } = await supabase
        .from('banks')
        .insert([bank])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<Bank>): Promise<Bank> {
      const { data, error } = await supabase
        .from('banks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('banks')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  },

  // Лизинговые компании
  leasingCompanies: {
    async getAll(): Promise<LeasingCompany[]> {
      const { data, error } = await supabase
        .from('leasing_companies')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    },

    async getActive(): Promise<LeasingCompany[]> {
      const { data, error } = await supabase
        .from('leasing_companies')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) throw error
      return data || []
    },

    async getById(id: string): Promise<LeasingCompany | null> {
      const { data, error } = await supabase
        .from('leasing_companies')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },

    async create(company: Omit<LeasingCompany, 'id' | 'created_at' | 'updated_at'>): Promise<LeasingCompany> {
      const { data, error } = await supabase
        .from('leasing_companies')
        .insert([company])
        .select()
        .single()

      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<LeasingCompany>): Promise<LeasingCompany> {
      const { data, error } = await supabase
        .from('leasing_companies')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('leasing_companies')
        .delete()
        .eq('id', id)

      if (error) throw error
    }
  }
}

// Утилиты для работы с файлами
export const storage = {
  async uploadImage(file: File, folder: string = 'general'): Promise<string> {
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)

    return publicUrl
  },

  async deleteImage(url: string): Promise<void> {
    // Извлекаем путь файла из URL
    const urlParts = url.split('/storage/v1/object/public/images/')
    if (urlParts.length < 2) return

    const filePath = urlParts[1]

    const { error } = await supabase.storage
      .from('images')
      .remove([filePath])

    if (error) throw error
  },

  async uploadMultipleImages(files: File[], folder: string = 'general'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder))
    return Promise.all(uploadPromises)
  }
}
