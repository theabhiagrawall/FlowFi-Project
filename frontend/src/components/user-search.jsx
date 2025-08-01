'use client';

import * as React from 'react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from '@/components/ui/command.jsx';
import { users } from '@/lib/data.js';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { useRouter } from 'next/navigation';

export default function UserSearch() {
  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState([]);
  const router = useRouter();

  React.useEffect(() => {
    if (search) {
      const lowercasedSearch = search.toLowerCase();
      const filteredUsers = users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowercasedSearch) ||
          user.email.toLowerCase().includes(lowercasedSearch)
      );
      setResults(filteredUsers);
    } else {
      setResults([]);
    }
  }, [search]);

  const handleUserSelect = (userId) => {
    router.push(`/users/${userId}`);
  };

  const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return names[0].substring(0, 2);
  };

  return (
    <div className="relative">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Search for a user by name or email..."
          value={search}
          onValueChange={setSearch}
        />
        {results.length > 0 && (
          <CommandList className="absolute top-full z-10 w-full rounded-b-lg border bg-background shadow-md">
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {results.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => handleUserSelect(user.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait"/>
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        )}
      </Command>
    </div>
  );
}
