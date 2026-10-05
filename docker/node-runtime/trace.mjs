import { copyFile, lstat, mkdir, readlink, symlink, chmod } from 'node:fs/promises';
import { dirname, resolve, relative, sep } from 'node:path';
import { createRequire } from 'node:module';
import { nodeFileTrace } from '@vercel/nft';

const [entryArgument, outputArgument] = process.argv.slice(2);
if (!entryArgument || !outputArgument) {
  throw new Error('Usage: node trace.mjs <compiled-entrypoint> <output-directory>');
}

const base = process.cwd();
const entry = resolve(base, entryArgument);
const output = resolve(outputArgument);
const serviceDirectory = dirname(dirname(entry));
const requireService = createRequire(entry);
// NestJS 12 loads the configurable proto loader dynamically with createRequire.
// Seed the gRPC dependencies and expose them at the workspace root as well.
const runtimeModules = ['@grpc/grpc-js', '@grpc/proto-loader'];
const { fileList, warnings } = await nodeFileTrace([
  entry, ...runtimeModules.map(name => requireService.resolve(name)),
], {
  base,
  processCwd: serviceDirectory,
  ignore: ['**/.env*'],
});

const optionalImports = new Set([
  '@nestjs/websockets/socket-module', '@nestjs/websockets/socket-module.js',
  'class-transformer', 'class-validator', 'pg-native', 'cloudflare:sockets',
  'nats', '@nats-io/transport-node', 'ioredis', 'mqtt',
  'amqp-connection-manager', 'kafkajs',
]);
for (const warning of warnings) {
  const missing = warning.message.match(/^Failed to resolve dependency "([^"]+)"/);
  const licenseAsset = warning.message.startsWith('Failed to parse ') &&
    /\/LICENSE as (script|module):/.test(warning.message);
  if (!licenseAsset && !(missing && optionalImports.has(missing[1]))) {
    throw warning;
  }
}

// Keep the workspace layout so pnpm symlinks and Node's module resolution work.
// Copy real files before links, whose targets might not exist yet.
const links = [];
let bytes = 0;
for (const file of fileList) {
  const source = resolve(base, file);
  const destination = resolve(output, file);
  if (relative(output, destination).startsWith(`..${sep}`)) {
    throw new Error(`Traced path escapes the output directory: ${file}`);
  }
  const stat = await lstat(source);
  if (stat.isSymbolicLink()) {
    links.push([source, destination]);
    continue;
  }
  if (!stat.isFile()) {
    throw new Error(`Unexpected non-file in dependency trace: ${file}`);
  }
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(source, destination);
  await chmod(destination, stat.mode);
  bytes += stat.size;
}
for (const [source, destination] of links) {
  await mkdir(dirname(destination), { recursive: true });
  const target = await readlink(source);
  if (target.startsWith('/')) {
    throw new Error(`Absolute dependency symlink cannot be relocated: ${source}`);
  }
  await symlink(target, destination);
}
for (const name of runtimeModules) {
  const packageDirectory = dirname(requireService.resolve(`${name}/package.json`));
  const destination = resolve(output, 'node_modules', name);
  const target = resolve(output, relative(base, packageDirectory));
  await mkdir(dirname(destination), { recursive: true });
  await symlink(relative(dirname(destination), target), destination);
}

console.log(`Runtime: ${fileList.size} files, ${(bytes / 1024 / 1024).toFixed(1)} MiB`);
// NestJS probes optional transports, validators and pg-native even when unused.
// Runtime smoke checks verify the dependencies used by these applications.
if (warnings.size) {
  console.log(`Trace warnings for optional imports/assets: ${warnings.size}`);
}
