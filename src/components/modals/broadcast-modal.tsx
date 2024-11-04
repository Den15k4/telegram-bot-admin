"use client";

import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Filter {
  hasCredits: boolean;
  activeLastWeek: boolean;
  hasReferrals: boolean;
}

export function BroadcastModal({ isOpen, onClose }: BroadcastModalProps) {
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState<Filter>({
    hasCredits: false,
    activeLastWeek: false,
    hasReferrals: false
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);

  const handleFilterChange = async (field: keyof Filter) => {
    const newFilter = {
      ...filter,
      [field]: !filter[field]
    };
    setFilter(newFilter);

    // Получаем количество получателей с новыми фильтрами
    try {
      const response = await fetch('/api/broadcast/recipients-count', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ filter: newFilter })
      });

      if (response.ok) {
        const data = await response.json();
        setRecipientCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching recipients count:', error);
    }
  };

  const handlePreview = () => {
    setPreview(message);
  };

  const handleSend = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/broadcast/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          message,
          filter
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Рассылка начата! Сообщение будет отправлено ${data.recipientCount} пользователям.`);
        onClose();
      } else {
        throw new Error('Failed to send broadcast');
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      alert('Ошибка при отправке рассылки');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Создать рассылку</h2>
            
            {/* Фильтры */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Фильтры получателей</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Checkbox
                    id="hasCredits"
                    checked={filter.hasCredits}
                    onCheckedChange={() => handleFilterChange('hasCredits')}
                  />
                  <Label htmlFor="hasCredits" className="ml-2">
                    Есть кредиты
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="activeLastWeek"
                    checked={filter.activeLastWeek}
                    onCheckedChange={() => handleFilterChange('activeLastWeek')}
                  />
                  <Label htmlFor="activeLastWeek" className="ml-2">
                    Активны за последнюю неделю
                  </Label>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="hasReferrals"
                    checked={filter.hasReferrals}
                    onCheckedChange={() => handleFilterChange('hasReferrals')}
                  />
                  <Label htmlFor="hasReferrals" className="ml-2">
                    Есть рефералы
                  </Label>
                </div>
              </div>
              {recipientCount !== null && (
                <p className="mt-2 text-sm text-gray-600">
                  Получателей: {recipientCount}
                </p>
              )}
            </div>

            {/* Текст сообщения */}
            <div className="mb-6">
              <Label htmlFor="message">Текст сообщения</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите текст сообщения..."
                className="mt-1 h-32"
              />
              <p className="text-sm text-gray-500 mt-1">
                Поддерживается Markdown разметка
              </p>
            </div>

            {/* Предпросмотр */}
            {preview && (
              <div className="mb-6 p-4 border rounded-md">
                <h4 className="font-semibold mb-2">Предпросмотр:</h4>
                <div className="prose max-w-none">{preview}</div>
              </div>
            )}

            {/* Кнопки */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handlePreview}
                disabled={!message || isLoading}
              >
                Предпросмотр
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button
                onClick={handleSend}
                disabled={!message || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Отправка...
                  </>
                ) : (
                  'Отправить'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}