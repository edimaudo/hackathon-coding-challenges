import * as React from "react"
2
3const MOBILE_BREAKPOINT = 768
4
5export function useIsMobile() {
6  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
7
8  React.useEffect(() => {
9    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
10    const onChange = () => {
11      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
12    }
13    mql.addEventListener("change", onChange)
14    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
15    return () => mql.removeEventListener("change", onChange)
16  }, [])
17
18  return !!isMobile
19}
20