import * as svelte from './svelte.js';

export const generator = `deno ${Deno.version.deno} | svelte ${
  svelte.version
} | ${new Date().toLocaleString('en-GB')} | ${Deno.build.os}/${
  Deno.build.arch
}`;

export const title = 'David Bushell – Freelance Web Design (UK)';

export const version = '11.6.0';
