import { useState, useEffect } from 'react';
2import { Layout } from '@/components/layouts/Layout';
3import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
4import { Label } from '@/components/ui/label';
5import { Switch } from '@/components/ui/switch';
6import { Button } from '@/components/ui/button';
7import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
8import { Input } from '@/components/ui/input';
9import { useApp } from '@/contexts/AppContext';
10import { t } from '@/lib/i18n';
11import { toast } from 'sonner';
12import type { Theme, FontSize, Language } from '@/types/types';
13
14export default function SettingsPage() {
15  const {
16    theme,
17    fontSize,
18    language,
19    reminderEnabled,
20    reminderTime,
21    setTheme,
22    setFontSize,
23    setLanguage,
24    setReminderEnabled,
25    setReminderTime,
26    savePreferences,
27  } = useApp();
28
29  const [saving, setSaving] = useState(false);
30  const [initialLoad, setInitialLoad] = useState(true);
31
32  // Auto-save when theme, fontSize, or language changes
33  useEffect(() => {
34    if (initialLoad) {
35      setInitialLoad(false);
36      return;
37    }
38
39    const autoSave = async () => {
40      try {
41        await savePreferences();
42      } catch (error) {
43        console.error('Error auto-saving preferences:', error);
44      }
45    };
46
47    autoSave();
48  }, [theme, fontSize, language, savePreferences, initialLoad]);
49
50  const handleSave = async () => {
51    try {
52      setSaving(true);
53      await savePreferences();
54      toast.success(t('settings.saved', language));
55    } catch (error) {
56      console.error('Error saving preferences:', error);
57      toast.error(t('common.error', language));
58    } finally {
59      setSaving(false);
60    }
61  };
62
63  const handleReminderToggle = async (enabled: boolean) => {
64    if (enabled && typeof Notification !== 'undefined') {
65      const permission = await Notification.requestPermission();
66      if (permission !== 'granted') {
67        toast.error(t('settings.notification_permission', language));
68        return;
69      }
70    }
71    setReminderEnabled(enabled);
72  };
73
74  return (
75    <Layout>
76      <div className="container px-4 py-12 max-w-3xl mx-auto">
77        <div className="mb-8">
78          <h1 className="text-4xl font-bold mb-2">{t('settings.title', language)}</h1>
79        </div>
80
81        <div className="space-y-6">
82          {/* Theme */}
83          <Card className="editorial-shadow">
84            <CardHeader>
85              <CardTitle>{t('settings.theme', language)}</CardTitle>
86            </CardHeader>
87            <CardContent>
88              <Select value={theme} onValueChange={(value) => setTheme(value as Theme)}>
89                <SelectTrigger>
90                  <SelectValue />
91                </SelectTrigger>
92                <SelectContent>
93                  <SelectItem value="dark">{t('settings.theme_dark', language)}</SelectItem>
94                  <SelectItem value="light">{t('settings.theme_light', language)}</SelectItem>
95                </SelectContent>
96              </Select>
97            </CardContent>
98          </Card>
99
100          {/* Font Size */}
101          <Card className="editorial-shadow">
102            <CardHeader>
103              <CardTitle>{t('settings.font_size', language)}</CardTitle>
104            </CardHeader>
105            <CardContent>
106              <Select value={fontSize} onValueChange={(value) => setFontSize(value as FontSize)}>
107                <SelectTrigger>
108                  <SelectValue />
109                </SelectTrigger>
110                <SelectContent>
111                  <SelectItem value="small">{t('settings.font_small', language)}</SelectItem>
112                  <SelectItem value="medium">{t('settings.font_medium', language)}</SelectItem>
113                  <SelectItem value="large">{t('settings.font_large', language)}</SelectItem>
114                </SelectContent>
115              </Select>
116            </CardContent>
117          </Card>
118
119          {/* Language */}
120          <Card className="editorial-shadow">
121            <CardHeader>
122              <CardTitle>{t('settings.language', language)}</CardTitle>
123            </CardHeader>
124            <CardContent>
125              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
126                <SelectTrigger>
127                  <SelectValue />
128                </SelectTrigger>
129                <SelectContent>
130                  <SelectItem value="en">{t('settings.lang_en', language)}</SelectItem>
131                  <SelectItem value="fr">{t('settings.lang_fr', language)}</SelectItem>
132                  <SelectItem value="es">{t('settings.lang_es', language)}</SelectItem>
133                </SelectContent>
134              </Select>
135            </CardContent>
136          </Card>
137
138          {/* Daily Reminder */}
139          <Card className="editorial-shadow">
140            <CardHeader>
141              <CardTitle>{t('settings.daily_reminder', language)}</CardTitle>
142              <CardDescription>{t('settings.reminder_desc', language)}</CardDescription>
143            </CardHeader>
144            <CardContent className="space-y-4">
145              <div className="flex items-center justify-between">
146                <Label htmlFor="reminder-toggle">{t('settings.daily_reminder', language)}</Label>
147                <Switch
148                  id="reminder-toggle"
149                  checked={reminderEnabled}
150                  onCheckedChange={handleReminderToggle}
151                />
152              </div>
153
154              {reminderEnabled && (
155                <div className="space-y-2">
156                  <Label htmlFor="reminder-time">{t('settings.reminder_time', language)}</Label>
157                  <Input
158                    id="reminder-time"
159                    type="time"
160                    value={reminderTime}
161                    onChange={(e) => setReminderTime(e.target.value)}
162                  />
163                </div>
164              )}
165            </CardContent>
166          </Card>
167
168          {/* Save Button */}
169          <Button onClick={handleSave} disabled={saving} className="w-full">
170            {saving ? t('settings.saving', language) : t('common.save', language)}
171          </Button>
172        </div>
173      </div>
174    </Layout>
175  );
176}
177