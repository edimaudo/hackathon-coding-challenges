import { cn } from '@/lib/utils'
2import { type UseSupabaseUploadReturn } from '@/hooks/use-supabase-upload'
3import { Button } from '@/components/ui/button'
4import { CheckCircle, File, Loader2, Upload, X } from 'lucide-react'
5import { createContext, type PropsWithChildren, useCallback, useContext } from 'react'
6
7export const formatBytes = (
8  bytes: number,
9  decimals = 2,
10  size?: 'bytes' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB'
11) => {
12  const k = 1000
13  const dm = decimals < 0 ? 0 : decimals
14  const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
15
16  if (bytes === 0 || bytes === undefined) return size !== undefined ? `0 ${size}` : '0 bytes'
17  const i = size !== undefined ? sizes.indexOf(size) : Math.floor(Math.log(bytes) / Math.log(k))
18  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
19}
20
21type DropzoneContextType = Omit<UseSupabaseUploadReturn, 'getRootProps' | 'getInputProps'>
22
23const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined)
24
25type DropzoneProps = UseSupabaseUploadReturn & {
26  className?: string
27}
28
29const Dropzone = ({
30  className,
31  children,
32  getRootProps,
33  getInputProps,
34  ...restProps
35}: PropsWithChildren<DropzoneProps>) => {
36  const isSuccess = restProps.isSuccess
37  const isActive = restProps.isDragActive
38  const isInvalid =
39    (restProps.isDragActive && restProps.isDragReject) ||
40    (restProps.errors.length > 0 && !restProps.isSuccess) ||
41    restProps.files.some((file) => file.errors.length !== 0)
42
43  return (
44    <DropzoneContext.Provider value={{ ...restProps }}>
45      <div
46        {...getRootProps({
47          className: cn(
48            'border-2 border-gray-300 rounded-lg p-6 text-center bg-card transition-colors duration-300 text-foreground',
49            className,
50            isSuccess ? 'border-solid' : 'border-dashed',
51            isActive && 'border-primary bg-primary/10',
52            isInvalid && 'border-destructive bg-destructive/10'
53          ),
54        })}
55      >
56        <input {...getInputProps()} />
57        {children}
58      </div>
59    </DropzoneContext.Provider>
60  )
61}
62const DropzoneContent = ({ className }: { className?: string }) => {
63  const {
64    files,
65    setFiles,
66    onUpload,
67    loading,
68    successes,
69    errors,
70    maxFileSize,
71    maxFiles,
72    isSuccess,
73  } = useDropzoneContext()
74
75  const exceedMaxFiles = files.length > maxFiles
76
77  const handleRemoveFile = useCallback(
78    (fileName: string) => {
79      setFiles(files.filter((file) => file.name !== fileName))
80    },
81    [files, setFiles]
82  )
83
84  if (isSuccess) {
85    return (
86      <div className={cn('flex flex-row items-center gap-x-2 justify-center', className)}>
87        <CheckCircle size={16} className="text-primary" />
88        <p className="text-primary text-sm">
89          Successfully uploaded {files.length} file{files.length > 1 ? 's' : ''}
90        </p>
91      </div>
92    )
93  }
94
95  return (
96    <div className={cn('flex flex-col', className)}>
97      {files.map((file, idx) => {
98        const fileError = errors.find((e) => e.name === file.name)
99        const isSuccessfullyUploaded = !!successes.find((e) => e === file.name)
100
101        return (
102          <div
103            key={`${file.name}-${idx}`}
104            className="flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4 "
105          >
106            {file.type.startsWith('image/') ? (
107              <div className="h-10 w-10 rounded border overflow-hidden shrink-0 bg-muted flex items-center justify-center">
108                <img src={file.preview} alt={file.name} className="object-cover" />
109              </div>
110            ) : (
111              <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center">
112                <File size={18} />
113              </div>
114            )}
115
116            <div className="shrink grow flex flex-col items-start truncate">
117              <p title={file.name} className="text-sm truncate max-w-full">
118                {file.name}
119              </p>
120              {file.errors.length > 0 ? (
121                <p className="text-xs text-destructive">
122                  {file.errors
123                    .map((e) =>
124                      e.message.startsWith('File is larger than')
125                        ? `File is larger than ${formatBytes(maxFileSize, 2)} (Size: ${formatBytes(file.size, 2)})`
126                        : e.message
127                    )
128                    .join(', ')}
129                </p>
130              ) : loading && !isSuccessfullyUploaded ? (
131                <p className="text-xs text-muted-foreground">Uploading file...</p>
132              ) : !!fileError ? (
133                <p className="text-xs text-destructive">Failed to upload: {fileError.message}</p>
134              ) : isSuccessfullyUploaded ? (
135                <p className="text-xs text-primary">Successfully uploaded file</p>
136              ) : (
137                <p className="text-xs text-muted-foreground">{formatBytes(file.size, 2)}</p>
138              )}
139            </div>
140
141            {!loading && !isSuccessfullyUploaded && (
142              <Button
143                size="icon"
144                variant="link"
145                className="shrink-0 justify-self-end text-muted-foreground hover:text-foreground"
146                onClick={() => handleRemoveFile(file.name)}
147              >
148                <X />
149              </Button>
150            )}
151          </div>
152        )
153      })}
154      {exceedMaxFiles && (
155        <p className="text-sm text-left mt-2 text-destructive">
156          You may upload only up to {maxFiles} files, please remove {files.length - maxFiles} file
157          {files.length - maxFiles > 1 ? 's' : ''}.
158        </p>
159      )}
160      {files.length > 0 && !exceedMaxFiles && (
161        <div className="mt-2">
162          <Button
163            variant="outline"
164            onClick={onUpload}
165            disabled={files.some((file) => file.errors.length !== 0) || loading}
166          >
167            {loading ? (
168              <>
169                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
170                Uploading...
171              </>
172            ) : (
173              <>Upload files</>
174            )}
175          </Button>
176        </div>
177      )}
178    </div>
179  )
180}
181
182const DropzoneEmptyState = ({ className }: { className?: string }) => {
183  const { maxFiles, maxFileSize, inputRef, isSuccess } = useDropzoneContext()
184
185  if (isSuccess) {
186    return null
187  }
188
189  return (
190    <div className={cn('flex flex-col items-center gap-y-2', className)}>
191      <Upload size={20} className="text-muted-foreground" />
192      <p className="text-sm">
193        Upload{!!maxFiles && maxFiles > 1 ? ` ${maxFiles}` : ''} file
194        {!maxFiles || maxFiles > 1 ? 's' : ''}
195      </p>
196      <div className="flex flex-col items-center gap-y-1">
197        <p className="text-xs text-muted-foreground">
198          Drag and drop or{' '}
199          <a
200            onClick={() => inputRef.current?.click()}
201            className="underline cursor-pointer transition hover:text-foreground"
202          >
203            select {maxFiles === 1 ? `file` : 'files'}
204          </a>{' '}
205          to upload
206        </p>
207        {maxFileSize !== Number.POSITIVE_INFINITY && (
208          <p className="text-xs text-muted-foreground">
209            Maximum file size: {formatBytes(maxFileSize, 2)}
210          </p>
211        )}
212      </div>
213    </div>
214  )
215}
216
217const useDropzoneContext = () => {
218  const context = useContext(DropzoneContext)
219
220  if (!context) {
221    throw new Error('useDropzoneContext must be used within a Dropzone')
222  }
223
224  return context
225}
226
227export { Dropzone, DropzoneContent, DropzoneEmptyState, useDropzoneContext }
228