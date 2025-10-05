#!/usr/bin/env bash

# SafeSolidity Lite - WASM Build Script
# This script compiles Slither to WebAssembly using Emscripten

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}SafeSolidity Lite - WASM Build Pipeline${NC}"
echo "======================================="

# Configuration
WASM_DIR="public/wasm"
BUILD_DIR="build/wasm"
SLITHER_DIR="external/slither"
EMSCRIPTEN_FLAGS="-O3 -s WASM=1 -s EXPORTED_FUNCTIONS='[\"_analyze\", \"_init\", \"_cleanup\", \"_malloc\", \"_free\", \"_get_result_length\"]' -s EXPORTED_RUNTIME_METHODS='[\"ccall\", \"cwrap\"]' -s ALLOW_MEMORY_GROWTH=1 -s MAXIMUM_MEMORY=268435456"

# Check if Emscripten is available
if ! command -v emcc &> /dev/null; then
    echo -e "${RED}Error: Emscripten not found. Please install Emscripten SDK first.${NC}"
    echo "Visit: https://emscripten.org/docs/getting_started/downloads.html"
    exit 1
fi

# Check if we're in the project root
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Must be run from project root directory${NC}"
    exit 1
fi

# Create necessary directories
echo -e "${YELLOW}Creating build directories...${NC}"
mkdir -p "$WASM_DIR"
mkdir -p "$BUILD_DIR"
mkdir -p "external"

# Function to create a placeholder WASM file for development
create_placeholder_wasm() {
    echo -e "${YELLOW}Creating placeholder WASM file for development...${NC}"
    
    # Create a minimal WASM module that exports required functions
    cat > "$BUILD_DIR/placeholder.c" << 'EOF'
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <emscripten.h>

// Placeholder analysis function
EMSCRIPTEN_KEEPALIVE
char* analyze(const char* source_code, int length, const char* options) {
    // Simple placeholder that returns a basic JSON result
    const char* template = "{\"vulnerabilities\":[],\"summary\":{\"total\":0,\"critical\":0,\"high\":0,\"medium\":0,\"low\":0,\"info\":0,\"riskScore\":0},\"version\":\"placeholder-0.1.0\"}";
    
    int result_len = strlen(template) + 1;
    char* result = malloc(result_len);
    strcpy(result, template);
    
    return result;
}

// Initialize function
EMSCRIPTEN_KEEPALIVE
void init() {
    printf("Placeholder WASM initialized\\n");
}

// Cleanup function
EMSCRIPTEN_KEEPALIVE
void cleanup() {
    printf("Placeholder WASM cleaned up\\n");
}

// Get result length helper
EMSCRIPTEN_KEEPALIVE
int get_result_length(const char* result) {
    return strlen(result);
}
EOF

    # Compile placeholder to WASM
    echo -e "${BLUE}Compiling placeholder WASM module...${NC}"
    emcc "$BUILD_DIR/placeholder.c" \
        -o "$BUILD_DIR/slither-wasm.js" \
        $EMSCRIPTEN_FLAGS \
        -s MODULARIZE=1 \
        -s EXPORT_NAME="'SlitherWasm'" \
        --pre-js <(echo "var Module = { onRuntimeInitialized: function() { console.log('Slither WASM ready'); } };")
    
    # Copy WASM files to public directory
    cp "$BUILD_DIR/slither-wasm.wasm" "$WASM_DIR/"
    cp "$BUILD_DIR/slither-wasm.js" "$WASM_DIR/"
    
    echo -e "${GREEN}Placeholder WASM module created successfully!${NC}"
}

# Function to build actual Slither WASM (when available)
build_slither_wasm() {
    echo -e "${YELLOW}Building Slither WASM module...${NC}"
    
    # Check if Slither source exists
    if [ ! -d "$SLITHER_DIR" ]; then
        echo -e "${YELLOW}Slither source not found. Cloning repository...${NC}"
        git clone https://github.com/crytic/slither.git "$SLITHER_DIR" || {
            echo -e "${RED}Failed to clone Slither repository${NC}"
            return 1
        }
    fi
    
    cd "$SLITHER_DIR"
    
    # TODO: Implement actual Slither compilation to WASM
    # This would involve:
    # 1. Setting up Python environment
    # 2. Installing Slither dependencies
    # 3. Creating C/C++ bindings
    # 4. Compiling with Emscripten
    
    echo -e "${RED}Full Slither WASM compilation not yet implemented${NC}"
    echo -e "${YELLOW}Using placeholder for now...${NC}"
    
    cd - > /dev/null
    return 1
}

# Main build process
echo -e "${BLUE}Starting WASM build process...${NC}"

# Try to build actual Slither WASM, fall back to placeholder
if ! build_slither_wasm; then
    echo -e "${YELLOW}Falling back to placeholder WASM...${NC}"
    create_placeholder_wasm
fi

# Verify the build
if [ -f "$WASM_DIR/slither-wasm.wasm" ]; then
    WASM_SIZE=$(du -h "$WASM_DIR/slither-wasm.wasm" | cut -f1)
    echo -e "${GREEN}\u2713 WASM build completed successfully!${NC}"
    echo -e "  Module size: $WASM_SIZE"
    echo -e "  Location: $WASM_DIR/slither-wasm.wasm"
else
    echo -e "${RED}\u2717 WASM build failed!${NC}"
    exit 1
fi

# Create a simple test to verify the WASM module loads
cat > "$WASM_DIR/test.js" << 'EOF'
// Simple test script to verify WASM loading
if (typeof require !== 'undefined') {
    const fs = require('fs');
    const path = require('path');
    
    const wasmPath = path.join(__dirname, 'slither-wasm.wasm');
    
    if (fs.existsSync(wasmPath)) {
        console.log('✓ WASM file exists');
        
        const stats = fs.statSync(wasmPath);
        console.log(`  Size: ${stats.size} bytes`);
        
        // Try to validate WASM format
        const buffer = fs.readFileSync(wasmPath);
        const magicNumber = buffer.slice(0, 4);
        const expectedMagic = Buffer.from([0x00, 0x61, 0x73, 0x6d]);
        
        if (magicNumber.equals(expectedMagic)) {
            console.log('✓ WASM magic number valid');
        } else {
            console.log('✗ Invalid WASM magic number');
        }
    } else {
        console.log('✗ WASM file not found');
    }
} else {
    console.log('Node.js not available for testing');
}
EOF

echo -e "${BLUE}Running WASM validation...${NC}"
node "$WASM_DIR/test.js" 2>/dev/null || echo "Validation skipped (Node.js not available)"

echo -e "${GREEN}WASM build pipeline completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Test the analysis functionality in the browser"
echo "3. Check browser console for WASM loading messages"
echo ""
echo "To implement full Slither integration:"
echo "1. Set up Python environment with Slither dependencies"
echo "2. Create C/C++ bindings for Slither's analysis engine"
echo "3. Update the build script to compile actual Slither code"
