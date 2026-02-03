#!/bin/bash

echo "🔍 Verifying Albanian translation removal..."
echo ""

has_errors=false

# Check for translation calls
echo "Checking for .t() translation calls..."
if grep -r "\.t(" app components lib --include="*.tsx" --include="*.ts" 2>/dev/null; then
    echo "❌ Found .t() translation calls"
    has_errors=true
else
    echo "✅ No .t() translation calls found"
fi

echo ""

# Check for useLocale hook
echo "Checking for useLocale hook usage..."
if grep -r "useLocale" app components lib --include="*.tsx" --include="*.ts" 2>/dev/null; then
    echo "❌ Found useLocale hook usage"
    has_errors=true
else
    echo "✅ No useLocale hook usage found"
fi

echo ""

# Check for LocaleProvider
echo "Checking for LocaleProvider usage..."
if grep -r "LocaleProvider" app components lib --include="*.tsx" --include="*.ts" 2>/dev/null; then
    echo "❌ Found LocaleProvider usage"
    has_errors=true
else
    echo "✅ No LocaleProvider usage found"
fi

echo ""

# Check for getLocalizedValue
echo "Checking for getLocalizedValue usage..."
if grep -r "getLocalizedValue" app components lib --include="*.tsx" --include="*.ts" 2>/dev/null; then
    echo "❌ Found getLocalizedValue usage"
    has_errors=true
else
    echo "✅ No getLocalizedValue usage found"
fi

echo ""

# Check if locale-context.tsx exists
echo "Checking if locale-context.tsx was deleted..."
if [ -f "lib/locale-context.tsx" ]; then
    echo "❌ locale-context.tsx still exists"
    has_errors=true
else
    echo "✅ locale-context.tsx deleted"
fi

echo ""
echo "============================================"

if [ "$has_errors" = true ]; then
    echo "❌ Verification failed! Some checks did not pass."
    exit 1
else
    echo "✅ All verifications passed!"
    exit 0
fi
