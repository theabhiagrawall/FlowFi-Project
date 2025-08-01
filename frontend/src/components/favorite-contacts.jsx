'use client';

import { favoriteContacts } from '@/lib/data.js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import Link from 'next/link';

export default function FavoriteContacts() {
    const getInitials = (name) => {
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[1][0]}`;
        }
        return names[0].substring(0, 2);
    };

  return (
    <div className="w-full">
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {favoriteContacts.map((contact) => (
          <Link key={contact.id} href={`/users/${contact.id}`}>
            <div className="flex flex-col items-center gap-2 cursor-pointer group">
              <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-primary transition-colors">
                <AvatarImage src={contact.avatar} data-ai-hint="person portrait" />
                <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{contact.name.split(' ')[0]}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
