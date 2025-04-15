"use client"

import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { SubscriptionStatus } from "@/components/subscription-status"

export function UserHeader() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  // Erstelle Initialen für die Avatar-Fallback
  const initials = user.name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
    
  return (
    <div className="bg-muted/50 py-2 px-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {user.role === 'admin' && (
          <Badge variant="secondary">Administrator</Badge>
        )}
        
        <SubscriptionStatus />
      </div>
    </div>
  )
} 