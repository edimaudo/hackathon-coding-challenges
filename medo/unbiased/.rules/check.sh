#!/bin/bash
2
3ast-grep scan -r .rules/SelectItem.yml
4
5ast-grep scan -r .rules/contrast.yml
6
7ast-grep scan -r .rules/supabase-google-sso.yml
8
9ast-grep scan -r .rules/toast-hook.yml
10
11ast-grep scan -r .rules/slot-nesting.yml
12
13ast-grep scan -r .rules/require-button-interaction.yml
14
15ast-grep scan -r .rules/supabase-edge-function-get-body.yml
16
17useauth_output=$(ast-grep scan -r .rules/useAuth.yml 2>/dev/null)
18
19if [ -z "$useauth_output" ]; then
20    exit 0
21fi
22
23authprovider_output=$(ast-grep scan -r .rules/authProvider.yml 2>/dev/null)
24
25if [ -n "$authprovider_output" ]; then
26    exit 0
27fi
28
29echo "=== ast-grep scan -r .rules/useAuth.yml output ==="
30echo "$useauth_output"
31echo ""
32echo "=== ast-grep scan -r .rules/authProvider.yml output ==="
33echo "$authprovider_output"
34echo ""
35echo "⚠️  Issue detected:"
36echo "The code uses useAuth Hook but does not have AuthProvider component wrapping the components."
37echo "Please ensure that components using useAuth are wrapped with AuthProvider to provide proper authentication context."
38echo ""
39echo "Suggested fixes:"
40echo "1. Add AuthProvider wrapper in app.tsx or corresponding root component"
41echo "2. Ensure all components using useAuth are within AuthProvider scope"