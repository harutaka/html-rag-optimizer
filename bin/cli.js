#!/usr/bin/env node

// Import the CLI module from the built distribution
const { runCli } = require('../dist/cli.js')

// Run the CLI with process arguments
runCli(process.argv).catch((error) => {
  console.error('Fatal error:', error.message)
  process.exit(1)
})