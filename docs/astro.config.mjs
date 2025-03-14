// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    integrations: [starlight({
        title: 'Coat Rack',
        social: {
            github: 'https://github.com/coat-rack',
        },
        sidebar: [
            {
                label: 'Guides',
                items: [
                    // Each item here is one entry in the navigation menu.
                    { label: 'Example Guide', slug: 'guides/example' },
                ],
            },
            {
                label: 'Reference',
                autogenerate: { directory: 'reference' },
            },
        ],
        customCss: ['./src/tailwind.css'],
        components: {
            Hero: './src/components/Hero.astro'
        }
		}), tailwind({ applyBaseStyles: false }), react()],
});
