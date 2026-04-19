import { useCallback, useEffect, useMemo, useState } from 'react'
2import { type FileError, type FileRejection, useDropzone } from 'react-dropzone'
3import {type SupabaseClient} from '@supabase/supabase-js'
4
5interface FileWithPreview extends File {
6  preview?: string
7  errors: readonly FileError[]
8}
9
10type UseSupabaseUploadOptions = {
11  /**
12   * Name of bucket to upload files to in your Supabase project
13   */
14  bucketName: string
15  /**
16   * Folder to upload files to in the specified bucket within your Supabase project.
17   *
18   * Defaults to uploading files to the root of the bucket
19   *
20   * e.g If specified path is `test`, your file will be uploaded as `test/file_name`
21   */
22  path?: string
23  /**
24   * Allowed MIME types for each file upload (e.g `image/png`, `text/html`, etc). Wildcards are also supported (e.g `image/*`).
25   *
26   * Defaults to allowing uploading of all MIME types.
27   */
28  allowedMimeTypes?: string[]
29  /**
30   * Maximum upload size of each file allowed in bytes. (e.g 1000 bytes = 1 KB)
31   */
32  maxFileSize?: number
33  /**
34   * Maximum number of files allowed per upload.
35   */
36  maxFiles?: number
37  /**
38   * The number of seconds the asset is cached in the browser and in the Supabase CDN.
39   *
40   * This is set in the Cache-Control: max-age=<seconds> header. Defaults to 3600 seconds.
41   */
42  cacheControl?: number
43  /**
44   * When set to true, the file is overwritten if it exists.
45   *
46   * When set to false, an error is thrown if the object already exists. Defaults to `false`
47   */
48  upsert?: boolean
49
50  /**
51   * initialized Supabase client instance
52   */
53  supabase: SupabaseClient
54}
55
56type UseSupabaseUploadReturn = ReturnType<typeof useSupabaseUpload>
57
58const useSupabaseUpload = (options: UseSupabaseUploadOptions) => {
59  const {
60    bucketName,
61    path,
62    allowedMimeTypes = [],
63    maxFileSize = Number.POSITIVE_INFINITY,
64    maxFiles = 1,
65    cacheControl = 3600,
66    upsert = false,
67    supabase
68  } = options
69
70  const [files, setFiles] = useState<FileWithPreview[]>([])
71  const [loading, setLoading] = useState<boolean>(false)
72  const [errors, setErrors] = useState<{ name: string; message: string }[]>([])
73  const [successes, setSuccesses] = useState<string[]>([])
74
75  const isSuccess = useMemo(() => {
76    if (errors.length === 0 && successes.length === 0) {
77      return false
78    }
79    if (errors.length === 0 && successes.length === files.length) {
80      return true
81    }
82    return false
83  }, [errors.length, successes.length, files.length])
84
85  const onDrop = useCallback(
86    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
87      const validFiles = acceptedFiles
88        .filter((file) => !files.find((x) => x.name === file.name))
89        .map((file) => {
90          ;(file as FileWithPreview).preview = URL.createObjectURL(file)
91          ;(file as FileWithPreview).errors = []
92          return file as FileWithPreview
93        })
94
95      const invalidFiles = fileRejections.map(({ file, errors }) => {
96        ;(file as FileWithPreview).preview = URL.createObjectURL(file)
97        ;(file as FileWithPreview).errors = errors
98        return file as FileWithPreview
99      })
100
101      const newFiles = [...files, ...validFiles, ...invalidFiles]
102
103      setFiles(newFiles)
104    },
105    [files, setFiles]
106  )
107
108  const dropzoneProps = useDropzone({
109    onDrop,
110    noClick: true,
111    accept: allowedMimeTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
112    maxSize: maxFileSize,
113    maxFiles: maxFiles,
114    multiple: maxFiles !== 1,
115  })
116
117  const onUpload = useCallback(async () => {
118    setLoading(true)
119
120    // [Joshen] This is to support handling partial successes
121    // If any files didn't upload for any reason, hitting "Upload" again will only upload the files that had errors
122    const filesWithErrors = errors.map((x) => x.name)
123    const filesToUpload =
124      filesWithErrors.length > 0
125        ? [
126            ...files.filter((f) => filesWithErrors.includes(f.name)),
127            ...files.filter((f) => !successes.includes(f.name)),
128          ]
129        : files
130
131    const responses = await Promise.all(
132      filesToUpload.map(async (file) => {
133        const { error } = await supabase.storage
134          .from(bucketName)
135          .upload(!!path ? `${path}/${file.name}` : file.name, file, {
136            cacheControl: cacheControl.toString(),
137            upsert,
138          })
139        if (error) {
140          return { name: file.name, message: error.message }
141        } else {
142          return { name: file.name, message: undefined }
143        }
144      })
145    )
146
147    const responseErrors = responses.filter((x) => x.message !== undefined)
148    // if there were errors previously, this function tried to upload the files again so we should clear/overwrite the existing errors.
149    setErrors(responseErrors)
150
151    const responseSuccesses = responses.filter((x) => x.message === undefined)
152    const newSuccesses = Array.from(
153      new Set([...successes, ...responseSuccesses.map((x) => x.name)])
154    )
155    setSuccesses(newSuccesses)
156
157    setLoading(false)
158  }, [files, path, bucketName, errors, successes])
159
160  useEffect(() => {
161    if (files.length === 0) {
162      setErrors([])
163    }
164
165    // If the number of files doesn't exceed the maxFiles parameter, remove the error 'Too many files' from each file
166    if (files.length <= maxFiles) {
167      let changed = false
168      const newFiles = files.map((file) => {
169        if (file.errors.some((e) => e.code === 'too-many-files')) {
170          file.errors = file.errors.filter((e) => e.code !== 'too-many-files')
171          changed = true
172        }
173        return file
174      })
175      if (changed) {
176        setFiles(newFiles)
177      }
178    }
179  }, [files.length, setFiles, maxFiles])
180
181  return {
182    files,
183    setFiles,
184    successes,
185    isSuccess,
186    loading,
187    errors,
188    setErrors,
189    onUpload,
190    maxFileSize: maxFileSize,
191    maxFiles: maxFiles,
192    allowedMimeTypes,
193    ...dropzoneProps,
194  }
195}
196
197export { useSupabaseUpload, type UseSupabaseUploadOptions, type UseSupabaseUploadReturn }
198