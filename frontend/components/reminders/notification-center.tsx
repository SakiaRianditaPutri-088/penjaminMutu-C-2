"use client"

import { useState } from "react"
import { useReminders } from "@/hooks/use-reminders"
import { Button } from "@/components/ui/button"
import { X, Bell, AlertCircle, Clock } from "lucide-react"

export default function NotificationCenter() {
  const { notifications, dismissNotification, clearAllNotifications } = useReminders()
  const [isOpen, setIsOpen] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case "urgent":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <Clock className="w-5 h-5 text-yellow-600" />
      default:
        return <Bell className="w-5 h-5 text-blue-600" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      case "overdue":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Notification Bell */}
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative rounded-full shadow-lg"
        >
          <Bell className="w-5 h-5" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </Button>

        {/* Notification Dropdown */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-96 max-h-96 overflow-y-auto bg-card border border-border rounded-lg shadow-xl">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <p>No notifications</p>
              </div>
            ) : (
              <>
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Notifications ({notifications.length})</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </Button>
                </div>

                <div className="space-y-2 p-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border flex items-start gap-3 ${getBackgroundColor(notification.type)}`}
                    >
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{notification.taskTitle}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissNotification(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Floating Notifications */}
      <div className="fixed bottom-20 right-4 space-y-2 pointer-events-none">
        {notifications.slice(0, 3).map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border shadow-lg pointer-events-auto animate-in slide-in-from-right ${getBackgroundColor(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon(notification.type)}</div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{notification.taskTitle}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(notification.id)}
                className="h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
