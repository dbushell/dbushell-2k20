import * as svelte from './svelte.js';

export const generator = `${Deno.build.os}/${Deno.build.arch} | deno ${
  Deno.version.deno
} | svelte ${svelte.version} | ${new Date().toString().split(' GMT')[0]}`;

export const title = 'David Bushell – Freelance Web Design (UK)';

export const version = '11.5';
