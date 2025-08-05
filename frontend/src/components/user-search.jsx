'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';


const CustomAvatar = ({ user }) => {
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.trim().split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
      <div className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full">

        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
        {getInitials(user.name)}
      </span>
      </div>
  );
};


export default function UserSearch() {

  const [search, setSearch] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false); // Our reliable switch for the UI
  const router = useRouter();
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    if (!search.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsOpen(true);
    setLoading(true);

    const debounceTimer = setTimeout(() => {
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      fetch(`http://localhost:8080/user-service/users/search?email=${search}`, { headers })
          .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
          })
          .then(data => setResults(Array.isArray(data) ? data : []))
          .catch(error => {
            console.error("Failed to fetch users:", error);
            setResults([]);
          })
          .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserSelect = (userId) => {
    router.push(`/users/${userId}`);
    setIsOpen(false);
    setSearch(''); // Also clear the search bar for better UX
  };

  return (
      <div className="relative w-full max-w-md" ref={containerRef}>

        <div className="relative">

          <input
              type="text"
              placeholder="Search for a user..."
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
              value={search}
              onFocus={() => {
                if (search.trim().length > 0) {
                  setIsOpen(true);
                }
              }}
              onChange={(e) => setSearch(e.target.value)}
          />
          {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
        </div>

        {isOpen && (
            <div className="absolute top-full z-50 mt-2 w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md max-h-60">
              <div className="p-1">
                {/* 3. Custom Loading/Empty/Group States */}
                {loading && results.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                ) : null}

                {!loading && results.length === 0 && search.trim() ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">No results found.</div>
                ) : null}

                {results.length > 0 && (
                    <div>

                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        Users
                      </div>
                      {results.map((user) => (

                          <div
                              key={user.id}
                              onClick={() => handleUserSelect(user.id)}
                              className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                          >
                            <div className="flex items-center gap-3">
                              <CustomAvatar user={user} />
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
              </div>
            </div>
        )}
      </div>
  );
}