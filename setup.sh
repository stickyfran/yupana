#!/bin/bash

# Yupana - CuentasClaras Installation Script

echo "======================================"
echo "  Yupana - CuentasClaras Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if Expo CLI is installed globally
if ! command -v expo &> /dev/null; then
    echo "📥 Installing Expo CLI globally..."
    npm install -g expo-cli
fi

echo ""
echo "======================================"
echo "  ✅ Setup Complete!"
echo "======================================"
echo ""
echo "To start the app, run:"
echo "  npm start"
echo ""
echo "To run on specific platform:"
echo "  npm run ios     # iOS"
echo "  npm run android # Android"
echo "  npm run web     # Web"
echo ""
echo "Enjoy using Yupana! 🎉"
