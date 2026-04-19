import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
2import type { Theme, FontSize, Language, UserPreferences } from '@/types/types';
3import { supabase } from '@/db/supabase';
4
5interface AppContextType {
6  theme: Theme;
7  fontSize: FontSize;
8  language: Language;
9  sessionId: string;
10  setTheme: (theme: Theme) => void;
11  setFontSize: (size: FontSize) => void;
12  setLanguage: (lang: Language) => void;
13  reminderEnabled: boolean;
14  reminderTime: string;
15  setReminderEnabled: (enabled: boolean) => void;
16  setReminderTime: (time: string) => void;
17  savePreferences: () => Promise<void>;
18}
19
20const AppContext = createContext<AppContextType | undefined>(undefined);
21
22function generateSessionId(): string {
23  const stored = localStorage.getItem('unbiased_session_id');
24  if (stored) return stored;
25  
26  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
27  localStorage.setItem('unbiased_session_id', newId);
28  return newId;
29}
30
31export function AppProvider({ children }: { children: React.ReactNode }) {
32  const [sessionId] = useState(generateSessionId);
33  const [theme, setThemeState] = useState<Theme>('dark');
34  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
35  const [language, setLanguageState] = useState<Language>('en');
36  const [reminderEnabled, setReminderEnabledState] = useState(false);
37  const [reminderTime, setReminderTimeState] = useState('09:00');
38  const [loaded, setLoaded] = useState(false);
39
40  // Load preferences from database
41  useEffect(() => {
42    async function loadPreferences() {
43      const { data } = await supabase
44        .from('user_preferences')
45        .select('*')
46        .eq('session_id', sessionId)
47        .maybeSingle();
48
49      if (data) {
50        setThemeState(data.theme);
51        setFontSizeState(data.font_size);
52        setLanguageState(data.language);
53        setReminderEnabledState(data.reminder_enabled);
54        setReminderTimeState(data.reminder_time);
55      }
56      setLoaded(true);
57    }
58
59    loadPreferences();
60  }, [sessionId]);
61
62  // Apply theme to document
63  useEffect(() => {
64    if (!loaded) return;
65    
66    const root = document.documentElement;
67    root.classList.remove('light', 'dark');
68    root.classList.add(theme);
69  }, [theme, loaded]);
70
71  // Apply font size to document
72  useEffect(() => {
73    if (!loaded) return;
74    
75    const root = document.documentElement;
76    root.classList.remove('font-small', 'font-medium', 'font-large');
77    root.classList.add(`font-${fontSize}`);
78  }, [fontSize, loaded]);
79
80  const setTheme = (newTheme: Theme) => {
81    setThemeState(newTheme);
82  };
83
84  const setFontSize = (size: FontSize) => {
85    setFontSizeState(size);
86  };
87
88  const setLanguage = (lang: Language) => {
89    setLanguageState(lang);
90  };
91
92  const setReminderEnabled = (enabled: boolean) => {
93    setReminderEnabledState(enabled);
94  };
95
96  const setReminderTime = (time: string) => {
97    setReminderTimeState(time);
98  };
99
100  const savePreferences = useCallback(async () => {
101    const preferences: Omit<UserPreferences, 'id' | 'created_at' | 'updated_at'> = {
102      session_id: sessionId,
103      theme,
104      font_size: fontSize,
105      language,
106      reminder_enabled: reminderEnabled,
107      reminder_time: reminderTime,
108    };
109
110    const { data: existing } = await supabase
111      .from('user_preferences')
112      .select('id')
113      .eq('session_id', sessionId)
114      .maybeSingle();
115
116    if (existing) {
117      await supabase
118        .from('user_preferences')
119        .update(preferences)
120        .eq('session_id', sessionId);
121    } else {
122      await supabase
123        .from('user_preferences')
124        .insert(preferences);
125    }
126  }, [sessionId, theme, fontSize, language, reminderEnabled, reminderTime]);
127
128  return (
129    <AppContext.Provider
130      value={{
131        theme,
132        fontSize,
133        language,
134        sessionId,
135        setTheme,
136        setFontSize,
137        setLanguage,
138        reminderEnabled,
139        reminderTime,
140        setReminderEnabled,
141        setReminderTime,
142        savePreferences,
143      }}
144    >
145      {children}
146    </AppContext.Provider>
147  );
148}
149
150export function useApp() {
151  const context = useContext(AppContext);
152  if (!context) {
153    throw new Error('useApp must be used within AppProvider');
154  }
155  return context;
156}