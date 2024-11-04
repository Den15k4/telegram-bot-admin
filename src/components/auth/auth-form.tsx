// src/components/auth/auth-form.tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginResponse {
  token: string
  user: {
    id: number
    email: string
    role: string
    created_at: string
  }
}

export function AuthForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      console.log('Отправка запроса на сервер...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('Получен ответ от сервера:', response.status)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка входа')
      }

      const loginData = data as LoginResponse
      
      // Сохраняем токен
      localStorage.setItem('token', loginData.token)
      // Сохраняем информацию о пользователе
      localStorage.setItem('user', JSON.stringify(loginData.user))

      console.log('Успешный вход, перенаправление...')
      router.push('/dashboard')
    } catch (error) {
      console.error('Ошибка при входе:', error)
      setError(error instanceof Error ? error.message : 'Произошла ошибка при входе')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}
          <Button disabled={isLoading} className="w-full">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Вход...
              </div>
            ) : (
              'Войти'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}