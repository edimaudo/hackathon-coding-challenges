import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
2// @ts-ignore
3import { supabase } from '@/db/supabase';
4import type { User } from '@supabase/supabase-js';
5// @ts-ignore
6import type { Profile } from '@/types/types';
7import { toast } from 'sonner';
8
9export async function getProfile(userId: string): Promise<Profile | null> {
10  const { data, error } = await supabase
11    .from('profiles')
12    .select('*')
13    .eq('id', userId)
14    .maybeSingle();
15
16  if (error) {
17    console.error(':', error);
18    return null;
19  }
20  return data;
21}
22interface AuthContextType {
23  user: User | null;
24  profile: Profile | null;
25  loading: boolean;
26  signInWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
27  signUpWithUsername: (username: string, password: string) => Promise<{ error: Error | null }>;
28  signOut: () => Promise<void>;
29  refreshProfile: () => Promise<void>;
30}
31
32const AuthContext = createContext<AuthContextType | undefined>(undefined);
33
34export function AuthProvider({ children }: { children: ReactNode }) {
35  const [user, setUser] = useState<User | null>(null);
36  const [profile, setProfile] = useState<Profile | null>(null);
37  const [loading, setLoading] = useState(true);
38
39  const refreshProfile = async () => {
40    if (!user) {
41      setProfile(null);
42      return;
43    }
44
45    const profileData = await getProfile(user.id);
46    setProfile(profileData);
47  };
48
49  useEffect(() => {
50    supabase
51      .auth
52      .getSession()
53      // @ts-ignore
54      .then(({ data: { session } }) => {
55        setUser(session?.user ?? null);
56        if (session?.user) {
57          getProfile(session.user.id).then(setProfile);
58        }
59      })
60      // @ts-ignore
61      .catch(error => {
62        toast.error(`: ${error.message}`);
63      })
64      .finally(() => {
65        setLoading(false);
66      });
67
68    // @ts-ignore
69    // In this function, do NOT use any await calls. Use `.then()` instead to avoid deadlocks.
70    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
71      setUser(session?.user ?? null);
72      if (session?.user) {
73        getProfile(session.user.id).then(setProfile);
74      } else {
75        setProfile(null);
76      }
77    });
78
79    return () => subscription.unsubscribe();
80  }, []);
81
82  const signInWithUsername = async (username: string, password: string) => {
83    try {
84      const email = `${username}@miaoda.com`;
85      const { error } = await supabase.auth.signInWithPassword({
86        email,
87        password,
88      });
89
90      if (error) throw error;
91      return { error: null };
92    } catch (error) {
93      return { error: error as Error };
94    }
95  };
96
97  const signUpWithUsername = async (username: string, password: string) => {
98    try {
99      const email = `${username}@miaoda.com`;
100      const { error } = await supabase.auth.signUp({
101        email,
102        password,
103      });
104
105      if (error) throw error;
106      return { error: null };
107    } catch (error) {
108      return { error: error as Error };
109    }
110  };
111
112  const signOut = async () => {
113    await supabase.auth.signOut();
114    setUser(null);
115    setProfile(null);
116  };
117
118  return (
119    <AuthContext.Provider value={{ user, profile, loading, signInWithUsername, signUpWithUsername, signOut, refreshProfile }}>
120      {children}
121    </AuthContext.Provider>
122  );
123}
124
125export function useAuth() {
126  const context = useContext(AuthContext);
127  if (context === undefined) {
128    throw new Error('useAuth must be used within an AuthProvider');
129  }
130  return context;
131}