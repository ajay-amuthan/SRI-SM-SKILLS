const fs = require("fs");
const path = require("path");

const schemaPath = path.resolve(__dirname, "../prisma/schema.prisma");
const envPath = path.resolve(__dirname, "../.env");

const mode = process.argv[2];

if (mode !== "sqlite" && mode !== "postgres") {
  console.error("Usage: node scripts/switch-db.js [sqlite|postgres]");
  process.exit(1);
}

// 1. Update schema.prisma provider
try {
  let schema = fs.readFileSync(schemaPath, "utf8");
  if (mode === "sqlite") {
    schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  } else {
    schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  }
  fs.writeFileSync(schemaPath, schema, "utf8");
  console.log(`Successfully updated prisma/schema.prisma provider to: ${mode === "sqlite" ? "sqlite" : "postgresql"}`);
} catch (error) {
  console.error("Error updating schema.prisma:", error.message);
  process.exit(1);
}

// 2. Update .env file
try {
  let envContent = fs.readFileSync(envPath, "utf8");
  
  if (mode === "sqlite") {
    // Enable SQLite line, comment out PostgreSQL line
    if (envContent.includes('# DATABASE_URL="file:./dev.db"')) {
      envContent = envContent.replace('# DATABASE_URL="file:./dev.db"', 'DATABASE_URL="file:./dev.db"');
    } else if (!envContent.includes('DATABASE_URL="file:./dev.db"')) {
      envContent = 'DATABASE_URL="file:./dev.db"\n' + envContent;
    }
    
    // Comment out any postgresql DATABASE_URL
    envContent = envContent.replace(/^(DATABASE_URL\s*=\s*"postgre?sql:\/\/.*")$/m, '# $1');
  } else {
    // postgres mode: comment out sqlite line, uncomment postgres line
    if (envContent.includes('DATABASE_URL="file:./dev.db"')) {
      envContent = envContent.replace('DATABASE_URL="file:./dev.db"', '# DATABASE_URL="file:./dev.db"');
    }
    
    // Find commented postgres line and uncomment it, or add template if none
    const postgresRegex = /^#\s*(DATABASE_URL\s*=\s*"postgre?sql:\/\/.*")$/m;
    if (postgresRegex.test(envContent)) {
      envContent = envContent.replace(postgresRegex, '$1');
    } else {
      if (!envContent.includes('postgresql://') && !envContent.includes('postgres://')) {
        envContent = 'DATABASE_URL="postgresql://user:password@host:5432/srismskills?sslmode=require"\n' + envContent;
      }
    }
  }
  
  fs.writeFileSync(envPath, envContent, "utf8");
  console.log(`Successfully adjusted DATABASE_URL in .env for ${mode}`);
} catch (error) {
  console.error("Error updating .env file:", error.message);
}
